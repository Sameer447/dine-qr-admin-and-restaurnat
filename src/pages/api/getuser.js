import User from ".././models/user";
export default async function handler(req, res) {
    console.log("Get user request hit!!?", req.method);
  
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    const { _id } = req.query; // Retrieve the _id from the query parameters
    console.log("Get user data hit!!?", _id);
  
    try {
      const user = await User.findById(_id).lean();
  
      if (!user) {
        return res.status(404).json({ status: 404, message: "User Not Found" });
      }
  
      const { ...userData } = user;
      return res.status(200).json({ user: userData, status: 200, message: "User retrieved Successfully" });
    } catch (error) {
      console.error("Error during get user process:", error);
      return res.status(500).json({ status: 500, message: "Server Error", error: error.message });
    }
  }
  