import nodemailer from 'nodemailer';
import User from '../models/user';
import { pass, user } from '../../@core/utils/global';
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId, isActivated, reason, password } = req.body;

    try {
        let user;

        if (isActivated) {
            const hashedPassword = await bcrypt.hash(password, 10);

            user = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        isActivated: isActivated,
                        password: hashedPassword
                    },
                    new: true
                },
            );
        } else {
            user = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        isActivated: isActivated
                    },
                    new: true
                },
            );
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let htmlContent;
        if (isActivated) {
            htmlContent = `
                <div style="background-color: #f0f4f8; padding: 40px; font-family: Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0; font-size: 24px;">Welcome to Dine QR!</h1>
                        </div>
                        <div style="padding: 30px;">
                            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                                Dear ${user.restaurantDetails.restaurantOwner},
                            </p>
                            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                                Your account has been activated successfully. Here are your credentials:
                            </p>
                            <div style="background-color: #f0f4f8; padding: 20px; border-radius: 8px;">
                                <p style="font-size: 16px; color: #333333; margin: 0;"><strong>Email:</strong> ${user.email}</p>
                                <p style="font-size: 16px; color: #333333; margin: 0;"><strong>Password:</strong> ${password}</p>
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
        } else {
            htmlContent = `
                <div style="background-color: #f0f4f8; padding: 40px; font-family: Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0; font-size: 24px;">Account Deactivated</h1>
                        </div>
                        <div style="padding: 30px;">
                            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                                Dear ${user.restaurantDetails.restaurantOwner},
                            </p>
                            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                                Your account has been deactivated for the following reason:
                            </p>
                            <div style="background-color: #f0f4f8; padding: 20px; border-radius: 8px;">
                                <p style="font-size: 16px; color: #333333; margin: 0;">${reason}</p>
                            </div>
                            <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 20px;">
                                If you did not request this, please ignore this email, and no action will be taken.
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
        }

        await sendVerificationEmail(user.email, htmlContent);

        res.status(200).json({ message: 'User status updated and email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

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
        subject: "DineQr Account Status",
        html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
};