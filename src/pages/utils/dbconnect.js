import mongoose from "mongoose";
const connection = {};
const connectDB = async () => {
  if (connection.isConnected) {
    console.log("Already Connected to MongoDB");
    return;
  } else {
    let db;
    if (typeof mongoose?.connect === "function") {
      db = await mongoose?.connect(
        "mongodb+srv://mubeenijaz773:mubeen7879@cluster0.dlofbt5.mongodb.net/test",);
    }
    connection.isConnected = db?.connections[0]?.readyState;
    console.log("Connected to MongoDB");
  }
};
export default connectDB;