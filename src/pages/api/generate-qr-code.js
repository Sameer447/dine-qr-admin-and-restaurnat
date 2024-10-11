import User from "../models/user";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { restaurantId } = req.body;

  if (!restaurantId) {
    return res.status(400).json({ message: 'Restaurant ID is required' });
  }

  try {
    const qrCodeUrl = `http://localhost:3000/MainMenu?resturant_id=${restaurantId}`;

    // Save the QR code URL to the database
    const updatedData = await User.findByIdAndUpdate(
      restaurantId,
      { qr_code_url: qrCodeUrl },
      { new: true }
    );

    if (!updatedData) {
      return { success: false, error: 'User not found', message: 'User not found' };
    }

    return res.status(200).json({ success: true, message: 'QrCode Generate Successfully.', qrCodeUrl: updatedData.qr_code_url });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}