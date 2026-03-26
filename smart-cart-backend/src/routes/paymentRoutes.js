const express = require("express");
const router = express.Router();
const { paymentWebhookController } = require("../controllers/paymentController");

// Payment webhook
router.post("/webhook", paymentWebhookController);

module.exports = router;
