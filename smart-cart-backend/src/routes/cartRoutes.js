const express = require("express");
const router = express.Router();
const {
    createCartController,
    getCartController,
    detectionEventController,
    checkoutController,
} = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new cart (protected - needs logged in user)
router.post("/", authMiddleware, createCartController);

// Get cart details
router.get("/:id", getCartController);

// Add detection event
router.post("/:id/detection-event", detectionEventController);

// Checkout cart
router.post("/:id/checkout", checkoutController);

module.exports = router;
