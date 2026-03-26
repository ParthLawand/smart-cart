const paymentWebhookController = async (req, res, next) => {
    try {
        const { status } = req.body;

        // Placeholder for future payment logic

        res.status(200).json({
            message: "Payment webhook received",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    paymentWebhookController,
};
