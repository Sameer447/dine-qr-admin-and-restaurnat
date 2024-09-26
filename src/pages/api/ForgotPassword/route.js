// @ts-nocheck
// // @ts-nocheck
import * as nodemailer from "nodemailer";
import { pass, user } from "../../../@core/utils/global";
import User from "../../models/user";
import jwt from "jsonwebtoken";

// Send verification email
const sendVerificationEmail = async (email, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });

  const mailOptions = {
    from: user,
    to: email,
    subject: "Password Reset Email Verification",
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const email = req.body;
  try {
    const user = await User.find({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const resetToken = jwt.sign(
      { email: email },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: "5m" },
    );
    const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?type=reset-password&token=${resetToken}`;
    let htmlContent;
    htmlContent = `
      <div style="background-color: #f0f4f8; padding: 40px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Dine QR!</h1>
          </div>  
        <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
              To reset your password please click the button below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; padding: 15px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
            </div>
            <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 20px;">
              If you did not request this, please ignore this email, and no action will be taken.
            </p>
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
              We're excited to see your restaurant thrive on Dine QR!
            </p>
          </div>
          <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
            <p style="font-size: 14px; margin: 0;">&copy; 2024 Dine QR. All rights reserved.</p>
            <p style="font-size: 14px; margin: 0;">123 Food Street, Gourmet City, FS 56789</p>
            <p style="font-size: 14px; margin: 0;">Contact us: support@dineqr.com</p>
          </div>
        </div>
      </div>
    `;

    // Send verification email
    const response = await sendVerificationEmail(email, htmlContent);
    return res.status(200).json({
      message: "Verification email sent successfully",
      status: 200,
      error: false,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
