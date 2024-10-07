import mongoose from "mongoose";
import User from "./user";

var FoodSchema = new mongoose.Schema({
  food_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  preparationTime: {
    type: Number,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
  images: [
    {
      name: String,
    },
  ],
  allergens: {
    type: [String],
  },
  specialityTags: {
    type: [String],
  },
  availableSizes: {
    type: [String],
  },
  availability: {
    type: Boolean,
    default: true,
  },
  customiseable: {
    type: Boolean,
    default: false,
  },
  restaurant_id: {
    type: String,
    ref: User,
  },
  addOns: [
    {
      name: {
        type: String,
        required: false,
      },
      price: {
        type: Number,
        required: false,
      },
    },
  ],
  quantity: {
    type: Number,
    default: 1,
  },
});

const FoodItems =
  mongoose.models.fooditems || mongoose.model("fooditems", FoodSchema);

export default FoodItems;
