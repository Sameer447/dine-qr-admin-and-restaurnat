// @ts-nocheck
import jwt from "jsonwebtoken";
import User from "../../models/user";
import bcrypt from "bcryptjs";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Destructure request body
  const { type, token, newPassword } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

    if (type === "reset-password") {
      const { email } = decoded; // Extract email from the decoded token

      if (!email) {
        return res.status(400).json({ message: "Invalid token data." });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({
        message: "Password has been reset successfully.",
        status: 200,
        error: false,
      });
    } else if (type === "set-password") {
      const { userData } = decoded; // Extract user data from the token
      const { email, role, restaurantDetails, addressDetails } = userData;

      if (!email || !role || !restaurantDetails || !addressDetails) {
        return res.status(400).json({ message: "Invalid token data." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const newUser = new User({
        email,
        password: hashedPassword,
        isActivated: true,
        role,
        restaurantDetails,
        addressDetails,
      });

      await newUser.save();

      return res.status(200).json({
        message: "Account has been activated and password set successfully.",
        status: 200,
        error: false,
      });
    } else {
      return res.status(400).json({ message: "Invalid request type." });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token has expired. Please log in again." });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(400)
        .json({ message: "Invalid token. Please try again." });
    }

    console.error("Error processing request:", error);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};
