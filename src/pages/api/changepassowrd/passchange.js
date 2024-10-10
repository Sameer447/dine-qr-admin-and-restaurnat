"use server";
// "UpdatePassword.js" file
import User from "../../models/user";
import bcrypt from "bcrypt";

export async function UpdatePassword(userId, newPassword) {
  try {
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(
      userId,
      { password: newPasswordHash },
      { new: true },
    );
    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    return { success: false, error: "Internal server error" };
  }
}

export async function UserById(userId) {
  // console.log(userId,newPassword,'hit ...?');
  try {
    const updatedUser = await User.findById(userId);
    return {
      updatedUser: updatedUser,
      success: true,
      message: "fetched user data successfully",
    };
  } catch (error) {
    return { success: false, error: "Internal server error" };
  }
}

export async function UpdateData(userId, updateFields) {
  try {
    const updatedData = await User.findByIdAndUpdate(
      userId,
      updateFields, // Pass an object containing the field(s) to update
      { new: true },
    );
    return {
      updatedData: updatedData,
      success: true,
      message: "Data updated successfully",
    };
  } catch (error) {
    return { success: false, error: "Internal server error" };
  }
}
