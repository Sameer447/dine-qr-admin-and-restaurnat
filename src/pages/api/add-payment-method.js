import Payment from "../models/payment-methods";

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const { restaurant_id, paymentMethod, cardholderName, cardNumber } = req.body;

    if (!cardholderName || !cardNumber) {
      return res.status(400).json({ message: 'Missing required fields for card payment' });
    }

    try {
      const result = await Payment.create({
        payment_method: paymentMethod,
        cardholder_name: cardholderName,
        card_number: cardNumber,
        restaurant_id: restaurant_id
      });

      res.status(201).json({ message: 'Payment method added', data: result });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}