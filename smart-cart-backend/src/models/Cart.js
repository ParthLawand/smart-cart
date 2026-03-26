const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["ACTIVE", "PAYMENT_PENDING", "PAID", "CANCELLED"],
        default: "ACTIVE"
    },
    items: [cartItemSchema],
    total_amount: {
        type: Number,
        default: 0
    },
    user_phone: {
        type: String
    },
    payment_order_id: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Cart", cartSchema);
