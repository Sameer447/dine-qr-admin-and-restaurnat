import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    payment_method: String,
    cardholder_name: String,
    card_number: String,
    restaurant_id: String,
},
    {
        timestamps: true
    }
);

const Payment = mongoose.models.paymentMethod || mongoose.model('paymentMethod', PaymentSchema);

export default Payment;