import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema({

    restaurant_id: String,
    plan: String,
    planAmount: Number,
    payment_method: String,
    cardholder_name: String,
    card_number: String,
    paymentProof: String,

},
    {
        timestamps: true
    }
);

const Billing = mongoose.models.billing || mongoose.model('billing', BillingSchema);

export default Billing;