// @ts-nocheck
import jwt from "jsonwebtoken";
import User from "../../models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    const email = decoded.email;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.isActivated = true;
    await user.save();
    res.status(200).json({
      message: "Password has been reset successfully.",
      status: 200,
      error: false,
    });
    // return NextResponse.json({ status: 200,  });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};
