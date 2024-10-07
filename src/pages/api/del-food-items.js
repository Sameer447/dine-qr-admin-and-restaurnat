import FoodItems from ".././models/fooditem";
import * as fs from "fs";

export default async function handler(req, res) {
    if (req.method === "DELETE") {
        console.log("hit del food items ??");
        const { id } = req.query;
        try {
            const foodItems = await FoodItems.findByIdAndDelete({ _id: id });
            // await fs.unlinkSync(foodItems.image);
            res.status(200).json(foodItems);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}