import * as nodemailer from "nodemailer";
import * as formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import * as fs from "fs";
import {
  pass,
  user,
  verificationLinkBaseUrl,
} from "../../../@core/utils/global";
import generateVerificationToken from "../../utils/jwt";

// Disable body parsing (since we are using formidable for multipart form data)
export const config = {
  api: {
    bodyParser: false,
  },
};

const validateFields = (fields) => {
  const requiredFields = [
    "role",
    "email",
    "tagline",
    "restaurantName",
    "cnicNumber",
    "restaurantOwner",
    "mobile",
    "zipcode",
    "address",
    "landmark",
    "city",
    "state",
  ];

  for (const field of requiredFields) {
    // Check if the field is an array or object and handle accordingly
    const fieldValue = fields[field];

    // If it's an array, take the first value
    let valueToCheck = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;

    // Ensure the value is a string before trimming
    if (typeof valueToCheck !== "string" || valueToCheck.trim().length === 0) {
      return `${field} is required.`;
    }
  }
  return null; // No validation errors
};

// Async wrapper for formidable form parsing
const parseForm = (req, uploadDir) => {
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

// Send verification email
const sendVerificationEmail = async (
  email,
  role,
  verificationLink,
  htmlContent,
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });

  const mailOptions = {
    from: user,
    to: email,
    subject: "Account Verification",
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "/data");

  try {
    const { fields, files } = await parseForm(req, uploadDir);

    // Validate form fields
    const validationError = validateFields(fields);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const {
      role,
      email,
      tagline,
      restaurantName,
      cnicNumber,
      restaurantOwner,
      mobile,
      zipcode,
      address,
      landmark,
      city,
      state,
    } = fields;

    let imageFilename = "";
    const uploadedFile = files.logo;

    // Handle logo file upload if present
    if (uploadedFile && uploadedFile.length > 0) {
      const uniqueId = uuidv4();
      const oldPath = uploadedFile[0].filepath;
      imageFilename = `${uniqueId}_${uploadedFile[0].originalFilename}`;
      const newPath = path.join(uploadDir, imageFilename);

      // File validation (optional but recommended)
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (
        !allowedTypes.includes(uploadedFile[0].mimetype) ||
        uploadedFile[0].size > maxSize
      ) {
        return res.status(400).json({ message: "Invalid file type or size" });
      }

      // Save the file
      fs.renameSync(oldPath, newPath);
    }

    // Prepare user data
    const userData = {
      email: email[0],
      role: role[0],
      restaurantDetails: {
        logo: imageFilename || "",
        tagline: tagline[0],
        restaurantName: restaurantName[0],
        cnicNumber: cnicNumber[0],
        restaurantOwner: restaurantOwner[0],
      },
      addressDetails: {
        mobile: mobile[0],
        zipcode: zipcode[0],
        address: address[0],
        landmark: landmark[0],
        city: city[0],
        state: state[0],
      },
    };

    // Generate verification token and link
    const token = generateVerificationToken(userData);
    const type = "set-password";
    const verificationLink = `${verificationLinkBaseUrl}?type=${type}&token=${token}`;
    // Generate email content based on user type
    let htmlContent;
    if (role[0] === "Resturant") {
      htmlContent = `
      <div style="background-color: #f0f4f8; padding: 40px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Dine QR, ${restaurantName[0]}!</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
              Dear ${restaurantOwner[0]},
            </p>
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
              Thank you for joining the Dine QR platform as a restaurant partner. We're thrilled to have you on board!
            </p>
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
              To verify your email and complete your account setup, please click the button below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="display: inline-block; padding: 15px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify Email</a>
            </div>
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
              Here are the details of your restaurant for your reference:
            </p>
            <div style="background-color: #f0f4f8; padding: 20px; border-radius: 8px;">
              <p style="font-size: 16px; color: #333333; margin: 0;"><strong>Restaurant Name:</strong> ${restaurantName[0]}</p>
              <p style="font-size: 16px; color: #333333; margin: 0;"><strong>Tagline:</strong> ${tagline[0]}</p>
              <p style="font-size: 16px; color: #333333; margin: 0;"><strong>CNIC Number:</strong> ${cnicNumber[0]}</p>
              <p style="font-size: 16px; color: #333333; margin: 0;"><strong>Address:</strong> ${address[0]}, ${city[0]}, ${state[0]}, ${zipcode[0]}</p>
              <p style="font-size: 16px; color: #333333; margin: 0;"><strong>Mobile:</strong> ${mobile[0]}</p>
            </div>
            <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 20px;">
              If you did not request this, please ignore this email, and no action will be taken.
            </p>
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
              We're excited to see your restaurant thrive on Dine QR!
            </p>
          </div>
          <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
            <p style="font-size: 14px; margin: 0;">&copy; 2024 Dine QR. All rights reserved.</p>
            <p style="font-size: 14px; margin: 0;">123 Food Street, Gourmet City, FS 56789</p>
            <p style="font-size: 14px; margin: 0;">Contact us: support@dineqr.com</p>
          </div>
        </div>
      </div>
    `;
    } else if (role[0] === "Admin") {
      htmlContent = `
        <div style="background: linear-gradient(135deg, #3b82f6, #eff6ff); padding: 20px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px;">
            <h2>Welcome, ${restaurantName[0]}!</h2>
            <p>To verify your email, click the button below:</p>
            <a href="${verificationLink}" style="background-color: #3b82f6; color: white; padding: 10px 20px; border-radius: 5px;">Verify Email</a>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        </div>
      `;
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Send verification email
    const response = await sendVerificationEmail(
      email[0],
      role[0],
      verificationLink,
      htmlContent,
    );
    return res
      .status(200)
      .json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
