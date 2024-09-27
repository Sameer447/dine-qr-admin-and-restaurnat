import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

var UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // Set default value to a unique UUID
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    restaurantDetails: {
      logo: {
        type: String,
      },
      tagline: {
        type: String,
      },
      restaurantName: {
        type: String,
      },
      cnicNumber: {
        type: String,
      },
      restaurantOwner: {
        type: String,
      },
    },
    addressDetails: {
      mobile: {
        type: String,
      },
      zipcode: {
        type: String,
      },
      address: {
        type: String,
      },
      landmark: {
        type: String,
        required: false,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);
UserSchema.pre("save", function (next) {
  if (!this.id) {
    this.id = uuidv4();
  }
  next();
});
const User =
  mongoose.models.users_dineqr || mongoose.model("users_dineqr", UserSchema);

export default User;
