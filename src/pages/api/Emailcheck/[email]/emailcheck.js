import User from "../../../models/user"

export default async function handler(req, res) {
  const { method } = req;

  if (method !== 'GET') {
    return res.status(405).json({ status: 405, message: "Method Not Allowed" });
  }

  const { email } = req.query;

  try {
    const checkemail = await User.find({ email });

    if (checkemail.length > 0) {
      return res.status(200).json({ status: 200 });
    } else {
      return res.status(201).json({ status: 404 }); // Email does not exist
    }
  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({ status: 500});
  }
}