import dbconnect from "../../utils/dbconnect";
export default async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const restaurants = await db
      .collection("restaurants")
      .find({ signedIn: true })
      .toArray();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
