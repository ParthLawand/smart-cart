const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING"
    },
    payment_method: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);
