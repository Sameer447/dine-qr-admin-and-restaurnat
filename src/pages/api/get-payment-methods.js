import Payment from "../models/payment-methods";


export default async function handler(req, res) {
    if (req.method === "GET") {
        console.log("hit get payment methods ??");
        const { restaurant_id } = req.query;
        try {
            const methods = await Payment.find({ restaurant_id: restaurant_id });
            res.status(200).json(methods);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}