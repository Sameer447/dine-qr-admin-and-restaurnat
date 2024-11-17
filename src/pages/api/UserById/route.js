import User from "../../models/user";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      const user = await User.findOne({ _id: id });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error finding user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
