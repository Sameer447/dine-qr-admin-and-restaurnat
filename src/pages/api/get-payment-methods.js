import Payment from "../models/payment-methods";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const allowedOrigins = [
    "https://dine-qr-customer.vercel.app",
    "http://dine-qr-customer.vercel.app"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
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