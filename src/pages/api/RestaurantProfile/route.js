import User from "../../models/user"; // Adjust the import based on your project structure

// Main API handler
export default async function handler(req, res) {
  console.log("Received request:", req.method);

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query; // Get the user ID from the query parameters

  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Fetch the existing user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Parse the incoming request body
    const {
      email,
      role,
      restaurantDetails,
      addressDetails,
      restaurantContactUs,
      restaurantSocialMedia,
      restaurantAboutUs,
    } = req.body;

    // Update user data
    user.email = email !== undefined ? email : user.email;
    user.role = role !== undefined ? role : user.role;
    user.isActivated = true; // Setting isActivated to true
    user.restaurantDetails = {
      ...user.restaurantDetails,
      ...(restaurantDetails || {}),
    };
    user.addressDetails = {
      ...user.addressDetails,
      ...(addressDetails || {}),
    };
    user.restaurantContactUs = {
      ...user.restaurantContactUs,
      ...(restaurantContactUs || {}),
    };
    user.restaurantSocialMedia = {
      ...user.restaurantSocialMedia,
      ...(restaurantSocialMedia || {}),
    };
    user.restaurantAboutUs = {
      ...user.restaurantAboutUs,
      ...(restaurantAboutUs || {}),
    };
    user.isSetup = true; // Set isSetup to true on update

    // Save the updated user
    const updatedUser = await user.save();

    return res
      .status(200)
      .json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Error updating user" });
  }
}
