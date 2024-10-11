// @ts-nocheck
import * as formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import * as fs from "fs";
import User from "../../../models/user";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req, uploadDir) => {
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024 * 1024 * 1024, // 20MB
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

const uploadFile = (file, uploadDir) => {
  if (file && file.size > 0) {
    const uniqueId = uuidv4();
    const oldPath = file.filepath;
    const imageFilename = `${uniqueId}_${file.originalFilename}`;
    const newPath = path.join(uploadDir, imageFilename);

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`File ${file.originalFilename} exceeds 5MB size limit`);
    }

    try {
      fs.renameSync(oldPath, newPath);
    } catch (error) {
      console.error(`Error saving file ${file.originalFilename}:`, error);
      throw new Error(`Failed to save file ${file.originalFilename}`);
    }

    return imageFilename;
  }
  return null;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "/data");

  try {
    const { id } = req.query;

    let user;
    try {
      user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Restaurant not found." });
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const { fields, files } = await parseForm(req, uploadDir);

    const {
      email,
      role,
      isActivated,
      restaurantName,
      cnicNumber,
      restaurantOwner,
      tagline,
      address,
      state,
      zipcode,
      mobile,
      city,
      landmark,
      contactUsHeading,
      contactUsSubHeading,
      contactUsDescription,
      facebook,
      twitter,
      instagram,
      linkedin,
      portfolio,
      aboutUsHeading,
      aboutUsSubHeading,
      aboutUsDescription,
      featuresDescription,
      workingDays,
      startTime,
      offTime,
      discountTitle,
      discountDescription,
    } = fields;

    console.log("Fields:", fields);
    console.log("Files:", files);

    const qualities = JSON.parse(fields.qualities || "[]");
    const features = JSON.parse(fields.features || "[]");

    const processedFeatures = features.features?.map((feature, index) => {
      const logoKey = `featuresLogo_${index + 1}`;
      const logoFile = files[logoKey] ? files[logoKey][0] : null;

      if (logoFile) {
        const fileName = uploadFile(logoFile, uploadDir);
        feature.logo = fileName;
      } else {
        feature.logo = null;
      }
      return feature;
    });
    console.log("Processed Features:", processedFeatures);

    if (files.logo && files.logo[0] && files.logo[0].filepath) {
      user.restaurantDetails.logo = uploadFile(files.logo[0], uploadDir);
    }
    if (files.banner && files.banner[0] && files.banner[0].filepath) {
      user.restaurantDetails.banner = uploadFile(files.banner[0], uploadDir);
    }
    if (
      files.aboutUsLogo &&
      files.aboutUsLogo[0] &&
      files.aboutUsLogo[0].filepath
    ) {
      user.restaurantAboutUs.logo = uploadFile(files.aboutUsLogo[0], uploadDir);
    }
    if (
      files.aboutUsBanner &&
      files.aboutUsBanner[0] &&
      files.aboutUsBanner[0].filepath
    ) {
      user.restaurantAboutUs.banner = uploadFile(
        files.aboutUsBanner[0],
        uploadDir,
      );
    }
    if (
      files.workingBanner &&
      files.workingBanner[0] &&
      files.workingBanner[0].filepath
    ) {
      user.restaurantAboutUs.workingHours.banner = uploadFile(
        files.workingBanner[0],
        uploadDir,
      );
    }
    if (
      files.discountBanner &&
      files.discountBanner[0] &&
      files.discountBanner[0].filepath
    ) {
      user.restaurantAboutUs.discount.banner = uploadFile(
        files.discountBanner[0],
        uploadDir,
      );
    }

    console.log("tagline:", tagline);

    // Update user data
    user.email = email[0];
    user.role = role[0];
    user.isActivated = isActivated[0] === "true";

    user.restaurantDetails = {
      restaurantName: restaurantName[0],
      cnicNumber: cnicNumber[0],
      restaurantOwner: restaurantOwner[0],
      tagline: tagline[0],
      banner: user.restaurantDetails.banner,
      logo: user.restaurantDetails.logo,
    };

    user.addressDetails = {
      address: address[0],
      state: state[0],
      zipcode: zipcode[0],
      mobile: mobile[0],
      city: city[0],
      landmark: landmark[0],
    };

    user.restaurantContactUs = {
      heading: contactUsHeading[0],
      subHeading: contactUsSubHeading[0],
      description: contactUsDescription[0],
    };

    user.restaurantSocialMedia = {
      facebook: facebook[0],
      twitter: twitter[0],
      instagram: instagram[0],
      linkedin: linkedin[0],
      portfolio: portfolio[0],
    };

    user.restaurantAboutUs = {
      heading: aboutUsHeading[0],
      subHeading: aboutUsSubHeading[0],
      description: aboutUsDescription[0],
      features: {
        description: featuresDescription[0],
        features: processedFeatures,
      },
      qualities: qualities,
      workingHours: {
        days: workingDays[0],
        startTime: startTime[0],
        offTime: offTime[0],
        banner: user.restaurantAboutUs.workingHours.banner,
      },
      discount: {
        title: discountTitle[0],
        description: discountDescription[0],
        banner: user.restaurantAboutUs.discount.banner,
      },
    };

    const updatedUser = user;
    console.log("Updated User:", updatedUser);

    await user.save();

    return res.status(200).json({
      message: "Restaurant updated successfully",
      updatedUser: updatedUser,
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return res.status(500).json({ message: "Error updating restaurant" });
  }
}
