import FoodItems from ".././models/fooditem";


export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("hit get food items ??");
    const { restaurant_id } = req.query;
    try {
      const foodItems = await FoodItems.find({ restaurant_id: restaurant_id });
      res.status(200).json(foodItems);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}