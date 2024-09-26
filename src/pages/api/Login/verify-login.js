import User from "../../models/user";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(404).json({ status: 404, message: "User Not Found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ status: 401, message: "Incorrect Password" });
    }

    const { password: _, ...userData } = user;
    console.log("User logged in successfully", userData);
    return res
      .status(200)
      .json({
        user: userData,
        status: 200,
        message: "User Logged In Successfully",
      });
  } catch (error) {
    console.error("Error during login process:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Server Error", error: error.message });
  }
}
