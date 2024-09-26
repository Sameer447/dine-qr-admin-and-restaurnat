// @ts-nocheck
import * as formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import * as fs from "fs";
import User from "../../models/user";
import bcrypt from "bcrypt";

export const config = {
  api: {
    bodyParser: false,
  },
};

const saltRounds = 10;

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
    if (!fields[field] || fields[field].length === 0) {
      return `${field} is required.`;
    }
  }
  return null;
};

// Main API handler
export default async function handler(req, res) {
  console.log("Received request:", req.method);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const uploadDir = path.join(process.cwd(), "/data");
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  // Parse the incoming form data
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing the form:", err);
      return res.status(500).json({ message: "Error parsing form data" });
    }

    // Validate form fields
    const validationError = validateFields(fields);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    try {
      // Destructure the fields for easier access
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

      // Handle file upload
      let imageFilename = "";
      const uploadedFile = files.logo;

      if (uploadedFile && uploadedFile.length > 0) {
        const uniqueId = uuidv4();
        const oldPath = uploadedFile[0].filepath;
        imageFilename = `${uniqueId}_${uploadedFile[0].originalFilename}`;
        const newPath = path.join(uploadDir, imageFilename);
        fs.renameSync(oldPath, newPath); // Rename file
      }

      // Hash the password
      // const hash = await bcrypt.hash(password[0], saltRounds);

      // Create the user in the database
      const createdUser = await User.create({
        email: email[0],
        // password: hash,
        role: role[0],
        restaurantDetails: {
          logo: imageFilename,
          tagline: tagline[0],
          restaurantName: restaurantName[0],
          cnicNumber: cnicNumber[0].replace(/[^0-9]/g, ""),
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
      });

      return res
        .status(200)
        .json({ message: "User created successfully", createdUser });
    } catch (error) {
      console.error("Error handling signup:", error);
      return res.status(500).json({ message: "Error processing signup" });
    }
  });
}

export async function GET(request) {
  const Users = await User.find();
  return NextResponse.json({ Users }, { status: 200 });
}
