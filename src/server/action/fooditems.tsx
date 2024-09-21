"use server"

import  FoodItems from "../models/fooditem";
import User from "../models/user";





export async function FetchItems(restaurant_id) {
    try {
        const getdata = await FoodItems.find({ restaurant_id: restaurant_id }).lean();
        return { success: true, message: "Data fetched successfully", Productdata: getdata };
    } catch (error) {
        return { error: error, message: "Error fetching data" };
    }
}


export async function fetchUserData(restaurant_id) {
    try {
        const userData = await User.findOne({ _id: restaurant_id }).lean();
        return { success: true, message: "Data fetched successfully", userData: userData }; 
    } catch (error) {
        return { error: error, message: "Error fetching user data" };
    }
}



// export async function addRestaurantIdToMenuItems(restaurantId) {
//     try {
//         // Assuming you have a database connection and a MenuItems collection/model
//         // Replace 'MenuItems' with the appropriate collection/model name in your database

//         // Find all menu items in the database
//         const menuItems = await FoodItems.find({});

//         // Update each menu item document to include the restaurant_id
//         // This assumes that each menu item document has a field called 'restaurant_id'
//         for (const menuItem of menuItems) {
//             menuItem.restaurant_id = restaurantId;
//             await menuItem.save(); // Save the updated menu item document
//         }

//         console.log('Restaurant ID added to all menu items successfully.');
//         return true;
//     } catch (error) {
//         console.error('Error adding restaurant ID to menu items:', error);
//         return false;
//     }
// }
