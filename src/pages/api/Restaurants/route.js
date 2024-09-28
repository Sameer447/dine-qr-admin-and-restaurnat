import { v4 as uuidv4 } from "uuid";
import User from "../../models/user";

// Get all users with role "Restaurant"
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await User.find({ role: "Resturant" }).select("-password"); // Exclude password field from the response
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // else if (req.method === "POST") {
  //   try {
  //     // Find users without a unique ID
  //     const usersWithoutId = await User.find({ id: { $exists: false } });

  //     for (const user of usersWithoutId) {
  //       const uniqueId = uuidv4();
  //       await User.updateOne({ _id: user._id }, { $set: { id: uniqueId } });
  //       console.log(`Updated user ${user.email} with id ${uniqueId}`);
  //     }

  //     res
  //       .status(200)
  //       .json({
  //         message: "All users updated with unique IDs.",
  //         users: usersWithoutId,
  //       });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }
  else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
