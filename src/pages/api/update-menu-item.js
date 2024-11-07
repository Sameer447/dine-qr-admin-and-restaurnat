import * as formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import * as fs from "fs";
import FoodItems from '../models/fooditem';

export const config = {
    api: {
        bodyParser: false,
    },
};

const parseForm = (req, uploadDir) => {
    const form = new formidable.IncomingForm({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 20 * 1024 * 1024, // 20MB
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

const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
    }
};

export default async function handler(req, res) {
    const uploadDir = path.join(process.cwd(), "/data/menu-items");

    try {
        const { id } = req.query;

        const { fields, files } = await parseForm(req, uploadDir);

        const {
            food_name,
            description,
            price,
            preparationTime,
            cuisine,
            calories,
            category,
            subCategory,
            allergens,
            specialityTags,
            availableSizes,
            availability,
            customiseable,
            quantity,
            'addOns[0]': addOns
        } = fields;

        let existingMenuItem = await FoodItems.findById(id);

        let image = null;

        if (files['images[0]']) {
            if (existingMenuItem && existingMenuItem.images.length > 0) {
                const existingImagePath = path.join(process.cwd(), '/data/menu-items', existingMenuItem.images[0].name);
                deleteFile(existingImagePath);
            }
            const uploadedFileName = uploadFile(files['images[0]'][0], uploadDir);
            image = uploadedFileName;
        }

        const updateData = {
            food_name: food_name[0] ? food_name[0] : existingMenuItem.food_name,
            description: description[0] ? description[0] : existingMenuItem.description,
            price: price[0] ? price[0] : existingMenuItem.price,
            preparationTime: preparationTime[0] ? preparationTime[0] : existingMenuItem.preparationTime,
            cuisine: cuisine[0] ? cuisine[0] : existingMenuItem.cuisine,
            calories: calories[0] ? calories[0] : existingMenuItem.calories,
            category: category[0] ? category[0] : existingMenuItem.category,
            subCategory: subCategory[0] ? subCategory[0] : existingMenuItem.subCategory,
            images: image ? [{ name: image }] : existingMenuItem.images,
            allergens: JSON.parse(allergens[0]) ? JSON.parse(allergens[0]) : existingMenuItem.allergens,
            specialityTags: JSON.parse(specialityTags[0]) ? JSON.parse(specialityTags[0]) : existingMenuItem.specialityTags,
            availableSizes: JSON.parse(availableSizes[0]) ? JSON.parse(availableSizes[0]) : existingMenuItem.availableSizes,
            availability: availability[0] ? availability[0] : existingMenuItem.availability,
            customiseable: customiseable[0] ? customiseable[0] : existingMenuItem.customiseable,
            quantity: quantity[0] ? quantity[0] : existingMenuItem.quantity,
            addOns: addOns[0] ? JSON.parse(addOns[0]) : existingMenuItem.addOns
        };

        const updatedMenuItem = await FoodItems.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedMenuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        res.status(200).json(updatedMenuItem);
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};