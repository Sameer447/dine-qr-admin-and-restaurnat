import mongoose from "mongoose";

var UserSchema = new mongoose.Schema({
        email: {
                type: String,
        },
        password: {
                type: String
        },
        userType: {
                type: String
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
                }
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
                },
                city: {
                        type: String,
                },
                state: {
                        type: String,
                }
        }
}, {
        timestamps: true
});


const User = mongoose.models.users_dineqr || mongoose.model('users_dineqr', UserSchema);

export default User;


// import mongoose from "mongoose";

// var UserSchema = new mongoose.Schema({
//     resturantname: {
//         type: String,
//     },
//     phonenum: {
//         type: Number,
//     },
//     cnic: {
//         type: String,
//     },
//     email: {
//         type: String,
//     },
//     password: {
//         type: String
//     },
//     username: {
//         type: String
//     },
//     userType: {
//         type: String
//     },
//     resturant: {
//         type: String
//     },

//     // Restaurant Details
//     restaurantDetails: {
//         logo: {
//             type: String, // Assuming a URL or path to the logo image
//         },
//         tagline: {
//             type: String,
//         },
//         restaurantName: {
//             type: String,
//         },
//         registrationNumber: {
//             type: String,
//         },
//         restaurantOwner: {
//             type: String,
//         },
//         email: {
//             type: String,
//         }
//     },

//     // Address Details
//     addressDetails: {
//         mobile: {
//             type: String,
//         },
//         zipcode: {
//             type: String,
//         },
//         address: {
//             type: String,
//         },
//         landmark: {
//             type: String,
//         },
//         city: {
//             type: String,
//         },
//         state: {
//             type: String,
//         }
//     }
// });

// const User = mongoose.models.users_dineqr || mongoose.model('users_dineqr', UserSchema);

// export default User;
