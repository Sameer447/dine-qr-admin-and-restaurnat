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

      if (!user) {
        return res.status(404).json({ message: "Restaurant not found." });
      }

      // Ensure nested objects exist
      user.restaurantDetails = user.restaurantDetails || {};
      user.restaurantAboutUs = user.restaurantAboutUs || {};
      user.restaurantAboutUs.features = user.restaurantAboutUs.features || {};
      user.restaurantAboutUs.workingHours =
        user.restaurantAboutUs.workingHours || {};
      user.restaurantAboutUs.discount = user.restaurantAboutUs.discount || {};

      // Handle file uploads (logo, banner, etc.)
      const restaurantLogo =
        uploadFile(files.logo, uploadDir) || user.restaurantDetails.logo;
      const restaurantBanner =
        uploadFile(files.banner, uploadDir) || user?.restaurantDetails?.banner;

      // Log the file paths
      console.log("Uploaded restaurantLogo:", restaurantLogo);
      console.log("Uploaded restaurantBanner:", restaurantBanner);

      // Convert array values to strings
      const getStringValue = (value) =>
        Array.isArray(value) ? value[0] : value;

      // Update the user with new data
      user.email = getStringValue(fields.email) || user.email;
      user.role = getStringValue(fields.role) || user.role;
      user.isActivated = true; // Assume the restaurant is activated after the update

      // Update restaurant details
      user.restaurantDetails = {
        logo: restaurantLogo,
        banner: restaurantBanner,
        tagline:
          getStringValue(fields.tagline) || user.restaurantDetails.tagline,
        restaurantName:
          getStringValue(fields.restaurantName) ||
          user.restaurantDetails.restaurantName,
        cnicNumber:
          getStringValue(fields.cnicNumber) ||
          user.restaurantDetails.cnicNumber,
        restaurantOwner:
          getStringValue(fields.restaurantOwner) ||
          user.restaurantDetails.restaurantOwner,
      };

      // Log the updated restaurantDetails
      console.log("Updated restaurantDetails:", user.restaurantDetails);

      // Update address details
      user.addressDetails = {
        address: getStringValue(fields.address) || user.addressDetails.address,
        state: getStringValue(fields.state) || user.addressDetails.state,
        zipcode: getStringValue(fields.zipcode) || user.addressDetails.zipcode,
        mobile: getStringValue(fields.mobile) || user.addressDetails.mobile,
        city: getStringValue(fields.city) || user.addressDetails.city,
        landmark:
          getStringValue(fields.landmark) || user.addressDetails.landmark,
      };

      // Update contact us section
      user.restaurantContactUs = {
        heading:
          getStringValue(fields.contactUsHeading) ||
          user.restaurantContactUs.heading,
        subHeading:
          getStringValue(fields.contactUsSubHeading) ||
          user.restaurantContactUs.subHeading,
        description:
          getStringValue(fields.contactUsDescription) ||
          user.restaurantContactUs.description,
      };

      // Update social media links
      user.restaurantSocialMedia = {
        facebook:
          getStringValue(fields.facebook) ||
          user.restaurantSocialMedia.facebook,
        twitter:
          getStringValue(fields.twitter) || user.restaurantSocialMedia.twitter,
        instagram:
          getStringValue(fields.instagram) ||
          user.restaurantSocialMedia.instagram,
        linkedin:
          getStringValue(fields.linkedin) ||
          user.restaurantSocialMedia.linkedin,
        portfolio:
          getStringValue(fields.portfolio) ||
          user.restaurantSocialMedia.portfolio,
      };

      // Update "About Us" section
      user.restaurantAboutUs = {
        heading:
          getStringValue(fields.aboutUsHeading) ||
          user.restaurantAboutUs.heading,
        subHeading:
          getStringValue(fields.aboutUsSubHeading) ||
          user.restaurantAboutUs.subHeading,
        description:
          getStringValue(fields.aboutUsDescription) ||
          user.restaurantAboutUs.description,
        logo:
          uploadFile(files.aboutUsLogo, uploadDir) ||
          user.restaurantAboutUs.logo,
        banner:
          uploadFile(files.aboutUsBanner, uploadDir) ||
          user.restaurantAboutUs.banner,
        qualities: fields.qualities
          ? JSON.parse(fields.qualities)
          : user.restaurantAboutUs.qualities || [],
        features: {
          description:
            getStringValue(fields.featuresDescription) ||
            user.restaurantAboutUs.features.description,
          features: fields.features
            ? JSON.parse(fields.features)
            : user.restaurantAboutUs.features.features || [],
        },
        workingHours: {
          days:
            getStringValue(fields.workingDays) ||
            user.restaurantAboutUs.workingHours.days,
          startTime:
            getStringValue(fields.startTime) ||
            user.restaurantAboutUs.workingHours.startTime,
          offTime:
            getStringValue(fields.offTime) ||
            user.restaurantAboutUs.workingHours.offTime,
          banner: files.workingBanner
            ? uploadFile(files.workingBanner, uploadDir)
            : user?.restaurantAboutUs?.workingHours?.banner,
        },
        discount: {
          description:
            getStringValue(fields.discountDescription) ||
            user.restaurantAboutUs.discount.description,
          banner: files.discountBanner
            ? uploadFile(files.discountBanner, uploadDir)
            : user.restaurantAboutUs.discount.banner,
          title:
            getStringValue(fields.discountTitle) ||
            user.restaurantAboutUs.discount.title,
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
