import FoodItems from "../models/fooditem";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.query;

    try {
       
        const menuItem = await FoodItems.findOne({ _id: id });

        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json(menuItem);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}