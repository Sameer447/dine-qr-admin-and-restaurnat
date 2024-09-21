import User from "../../models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
const saltRounds = 10;

export async function POST(request) {
  console.log("login hit..!");
  const { email, password } = await request.json();

  const user = await User.findOne({ email: email }).lean();

  if (!user) {
    // User not found
    console.log("User not found");
    return NextResponse.json({ status: 500, message: "User Not Found" });
  }

  try {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Passwords match, user is authenticated
      console.log("User logged in successfully", user);
      return NextResponse.json({ user, status: 200 });
    } else {
      // Passwords don't match, user is not authenticated
      console.log("Incorrect password");
      return NextResponse.json({ status: 400, message: "Incorrect Password" });
    }
  } catch (err) {
    console.error("Error comparing passwords:", err);
    return NextResponse.json({ status: 400, message: "Error during authentication" });
  }
}
