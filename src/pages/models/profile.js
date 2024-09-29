import mongoose from "mongoose";

const RestaurantProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "Restaurant" },
  isActivated: { type: Boolean, default: true },
  restaurantDetails: {
    logo: { type: String },
    banner: { type: String },
    restaurantName: { type: String, required: true },
    cnicNumber: { type: String },
    restaurantOwner: { type: String, required: true },
  },
  addressDetails: {
    address: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    mobile: { type: String, required: true },
    city: { type: String, required: true },
    landmark: { type: String },
  },
  restaurantContactUs: {
    heading: { type: String },
    subHeading: { type: String },
    description: { type: String },
  },
});

export default mongoose.models.RestaurantProfile ||
  mongoose.model("RestaurantProfile", RestaurantProfileSchema);
