import mongoose from "mongoose";

var UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
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

const User =
  mongoose.models.users_dineqr || mongoose.model("users_dineqr", UserSchema);

export default User;
