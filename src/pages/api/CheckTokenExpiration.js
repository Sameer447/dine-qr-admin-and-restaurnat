import jwt from "jsonwebtoken";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { token } = req.body;
  try {
    jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    return res.status(200).json({ message: "Token is valid." });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token has expired." });
    }
    return res.status(400).json({ message: "Invalid token." });
  }
};