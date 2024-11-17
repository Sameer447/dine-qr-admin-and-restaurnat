import Billing from "../models/billing";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query; 
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        try {
            const billing = await Billing.findOne({
                restaurant_id: id,
            });

            if (!billing) {
                return res.status(404).json({ message: "Billing not found" });
            }

            return res.status(200).json(billing);
        } catch (error) {
            console.error("Error finding Billing:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}