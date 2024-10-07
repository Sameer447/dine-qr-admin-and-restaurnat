// @ts-nocheck
import * as formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import * as fs from "fs";
import User from "../../models/user"; // Adjust the path based on your structure

export const config = {
  api: {
    bodyParser: false, // Disabling body parser for handling form data
  },
};

// Utility function for uploading files
const uploadFile = (file, uploadDir) => {
  if (!file) return null;
  const uniqueId = uuidv4();
  const oldPath = file[0].filepath;
  const fileName = `${uniqueId}_${file[0].originalFilename}`;
  const newPath = path.join(uploadDir, fileName);
  fs.renameSync(oldPath, newPath);
  return fileName;
};

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query; // Restaurant ID from query parameters
  if (!id) {
    return res.status(400).json({ message: "Restaurant ID is required." });
  }

  const uploadDir = path.join(process.cwd(), "/data"); // Directory for file uploads
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ message: "Error parsing form data" });
    }

    try {
      // Fetch the existing restaurant user
      const user = await User.findById(id);
      console.log("User:", user);
      console.log("Fields:", fields);

      if (!user) {
        return res.status(404).json({ message: "Restaurant not found." });
      }

      const getStringValue = (value) =>
        Array.isArray(value) ? value[0] : value;

      // Ensure nested objects exist
      user.restaurantDetails = user.restaurantDetails || {};
      user.restaurantAboutUs = user.restaurantAboutUs || {};
      user.restaurantAboutUs.features = user.restaurantAboutUs.features || {};
      user.restaurantAboutUs.workingHours =
        user.restaurantAboutUs.workingHours || {};
      user.restaurantAboutUs.discount = user.restaurantAboutUs.discount || {};

      const restaurantLogo = uploadFile(files.logo, uploadDir) || user.restaurantDetails.logo;
      const restaurantBanner = uploadFile(files.banner, uploadDir) || user?.restaurantDetails?.banner;

      // Parse and handle `features` and `qualities` logos
      const featuresLogo = fields.features ? JSON.parse(fields.features) : user?.restaurantAboutUs?.features?.features || [];
      const qualitiesLogo = fields.qualities ? JSON.parse(fields.qualities) : user?.restaurantAboutUs?.qualities || [];

      // Map through the `features` array to handle logo uploads for each feature
      const features = featuresLogo.map((feature) => {
        // Check if a logo file exists for this feature and upload it
        const featureLogoFile = files[`featuresLogo_${feature.id}`]; // Assuming logos are uploaded with names like `featuresLogo_1`
        const logo = featureLogoFile ? uploadFile(featureLogoFile, uploadDir) : feature.logo;

        return { ...feature, logo }; // Return updated feature object with logo path
      });

      // Map through the `qualities` array to handle logo uploads for each quality
      const qualities = qualitiesLogo.map((quality) => {
        // Check if a logo file exists for this quality and upload it
        const qualityLogoFile = files[`qualitiesLogo_${quality.id}`]; // Assuming logos are uploaded with names like `qualitiesLogo_1`
        const logo = qualityLogoFile ? uploadFile(qualityLogoFile, uploadDir) : quality.logo;

        return { ...quality, logo }; // Return updated quality object with logo path
      });

      // Handle the rest of the About Us section uploads
      const aboutUsLogo = uploadFile(files.aboutUsLogo, uploadDir) || user?.restaurantAboutUs?.logo;
      const aboutUsBanner = uploadFile(files.aboutUsBanner, uploadDir) || user?.restaurantAboutUs?.banner;
      const workingBanner = uploadFile(files.workingBanner, uploadDir) || user?.restaurantAboutUs?.workingHours?.banner;
      const discountBanner = uploadFile(files.discountBanner, uploadDir) || user?.restaurantAboutUs?.discount?.banner;

      // Log uploaded file paths
      console.log("Uploaded restaurantLogo:", restaurantLogo);
      console.log("Uploaded restaurantBanner:", restaurantBanner);
      console.log("Uploaded features logos:", features.map(f => f.logo));
      console.log("Uploaded qualities logos:", qualities.map(q => q.logo));

      // Update restaurant details and other sections
      user.restaurantDetails = {
        logo: restaurantLogo,
        banner: restaurantBanner,
        tagline: getStringValue(fields.tagline) || user.restaurantDetails.tagline,
        restaurantName: getStringValue(fields.restaurantName) || user.restaurantDetails.restaurantName,
        cnicNumber: getStringValue(fields.cnicNumber) || user.restaurantDetails.cnicNumber,
        restaurantOwner: getStringValue(fields.restaurantOwner) || user.restaurantDetails.restaurantOwner,
      };

      user.restaurantAboutUs = {
        heading: getStringValue(fields.aboutUsHeading) || user.restaurantAboutUs.heading,
        subHeading: getStringValue(fields.aboutUsSubHeading) || user.restaurantAboutUs.subHeading,
        description: getStringValue(fields.aboutUsDescription) || user.restaurantAboutUs.description,
        logo: aboutUsLogo,
        banner: aboutUsBanner,
        qualities: fields.qualities ? qualities : user.restaurantAboutUs.qualities || [],
        features: fields.features ? features : user.restaurantAboutUs.features || [],
        workingHours: {
          days: getStringValue(fields.workingDays) || user.restaurantAboutUs.workingHours.days,
          startTime: getStringValue(fields.startTime) || user.restaurantAboutUs.workingHours.startTime,
          offTime: getStringValue(fields.offTime) || user.restaurantAboutUs.workingHours.offTime,
          banner: workingBanner,
        },
        discount: {
          description: getStringValue(fields.discountDescription) || user.restaurantAboutUs.discount.description,
          banner: discountBanner,
          title: getStringValue(fields.discountTitle) || user.restaurantAboutUs.discount.title,
        },
      };

      // Log the updated user object before saving
      console.log("Updated User:", user);

      // Save updated restaurant user
      const updatedUser = await user.save();

      // Log the saved user object
      console.log("Saved User:", updatedUser);

      return res
        .status(200)
        .json({ message: "Restaurant updated successfully", updatedUser });
    } catch (error) {
      console.error("Error updating restaurant:", error);
      return res.status(500).json({ message: "Error updating restaurant" });
    }
  });
}