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
      addOns,
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

    // Parse addOns if provided
    let parsedAddOns = [];
    if (addOns) {
      parsedAddOns = JSON.parse(addOns[0]).map((addOn) => ({
        name: addOn.name,
        price: parseFloat(addOn.price),
      }));
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
      addOns: parsedAddOns,
    });

    return res
      .status(201)
      .json({ message: "Menu item added successfully", savedItemData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
