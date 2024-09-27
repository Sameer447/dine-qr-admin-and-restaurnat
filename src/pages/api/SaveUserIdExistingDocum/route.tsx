import FoodItems from "../../models/fooditem";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    let { _id, userid } = await request.json();

    // Check if the document with the given _id exists
    const existingDocument = await FoodItems.findById(_id);

    if (existingDocument) {
      // Update the existing document with the userid
      await FoodItems.findByIdAndUpdate(_id, { userid });
      return NextResponse.json({
        status: 200,
        message: "Userid saved in the existing document",
      });
    } else {
      return NextResponse.json({ status: 404, message: "Document not found" });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({
      status: 500,
      message: "Error updating document",
    });
  }
}
