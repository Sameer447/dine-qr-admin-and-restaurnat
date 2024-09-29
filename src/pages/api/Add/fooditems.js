import * as formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import * as fs from "fs";
import FoodItems from "../../models/fooditem";

export const config = {
  api: {
    bodyParser: false,
  },
};

const validateFields = (fields) => {
  const requiredFields = [
    "category",
    "menuItemName",
    "price",
    "preparationTime",
    "cuisine",
  ];

  for (const field of requiredFields) {
    const fieldValue = fields[field];

    let valueToCheck = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;

    if (typeof valueToCheck !== "string" || valueToCheck.trim().length === 0) {
      return `${field} is required.`;
    }
  }
  return null;
};

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "/data/menu-items");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    const { fields, files } = await parseForm(req, uploadDir);

    const validationError = validateFields(fields);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const {
      menuItemName,
      description,
      price,
      preparationTime,
      cuisine,
      calories,
      category,
      subCategory,
      availability,
      customiseable,
      restaurant_id,
      addones,
    } = fields;

    const allergens = Array.isArray(fields["allergens"])
      ? fields["allergens"]
      : [];
    const specialityTags = Array.isArray(fields["specialityTags"])
      ? fields["specialityTags"]
      : [];
    const availableSizes = Array.isArray(fields["availableSizes"])
      ? fields["availableSizes"]
      : [];

    let imageFilename = "";
    const uploadedFile = files.itemImage;

    if (uploadedFile && uploadedFile.length > 0) {
      const uniqueId = uuidv4();
      const oldPath = uploadedFile[0].filepath;
      imageFilename = `${uniqueId}_${uploadedFile[0].originalFilename}`;
      const newPath = path.join(uploadDir, imageFilename);

      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024;
      if (
        !allowedTypes.includes(uploadedFile[0].mimetype) ||
        uploadedFile[0].size > maxSize
      ) {
        return res.status(400).json({ message: "Invalid file type or size" });
      }

      fs.renameSync(oldPath, newPath);
    }

    const savedItemData = await FoodItems.create({
      food_name: menuItemName[0],
      description: description ? description[0] : "",
      price: parseFloat(price[0]),
      preparationTime: parseInt(preparationTime[0], 10),
      cuisine: cuisine[0],
      calories: calories ? parseInt(calories[0], 10) : null,
      category: category[0],
      subCategory: subCategory[0],
      allergens: allergens,
      specialityTags: specialityTags,
      availableSizes: availableSizes,
      availability: availability[0] === "true",
      customiseable: customiseable[0] === "true",
      images: [
        {
          name: imageFilename,
        },
      ],
      restaurant_id: restaurant_id[0],
    });

    return res
      .status(201)
      .json({ message: "Menu item added successfully", savedItemData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// export default async function handlerData(req, res) {
//   if (req.method === "GET") {
//     console.log("hit get food items ??");
//     const { restaurant_id } = req.query;
//      console.log("restaurant_id", restaurant_id);
//     try {
//       const foodItems = await FoodItems.find({ restaurant_id: restaurant_id });
//       res.status(200).json(foodItems);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// }

// export async function GET(request) {
//   const url = new URL(request.url);
//   const filename = url.searchParams.get('filename');

//   if (!filename) {
//     return new Response(null, { status: 400, statusText: 'Bad Request' });
//   }

//   // Assuming the uploaded files are stored in the "/public/tmp" directory
//   const path = `../data/${filename}`;

//   try {
//     // Read the file from the filesystem
//     const fileData = await readFile(path);

//     // Get the file extension
//     const extension = filename.split('.').pop().toLowerCase();

//     // Set the appropriate content type based on the file extension
//     let contentType = 'application/octet-stream'; // Default content type for unknown file types

//     if (extension === 'png') {
//       contentType = 'image/png';
//     } else if (extension === 'jpg' || extension === 'jpeg') {
//       contentType = 'image/jpeg';
//     }
//     // Add more conditions for other supported file types as needed

//     // Set the appropriate headers for the image or video response
//     const headers = {
//       'Content-Type': contentType,
//       'Content-Length': fileData.length.toString(),
//     };

//     // Return the file as the response
//     return new Response(fileData, { headers });
//   } catch (error) {
//     console.error(`Error reading file: ${error}`);
//     return new Response(null, { status: 404, statusText: 'Not Found' });
//   }
// }
