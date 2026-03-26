const cartService = require("../services/cartService");

const createCartController = async (req, res, next) => {
    try {
        const userPhone = req.user ? req.user.phone : null;
        const cart = await cartService.createCart(userPhone);
        res.status(201).json(cart);
    } catch (error) {
        next(error);
    }
};
const getCartController = async (req, res, next) => {
    try {
        const cartId = req.params.id;
        const cart = await cartService.getCart(cartId);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

const detectionEventController = async (req, res, next) => {
    try {
        const cartId = req.params.id;
        const { event, product_id, confidence } = req.body;

        if (confidence === undefined) {
            throw new Error("Confidence is missing");
        }

        if (confidence < 0.7) {
            throw new Error("Low confidence detection");
        }

        const isDuplicate = cartService.isDuplicateEvent(cartId, product_id);

        if (isDuplicate) {
            const currentCart = await cartService.getCart(cartId);
            return res.status(200).json({
                message: "Duplicate detection ignored",
                cart: currentCart
            });
        }

        let updatedCart;

        if (event === "ADD") {
            updatedCart = await cartService.addItem(cartId, product_id);
        } else if (event === "REMOVE") {
            updatedCart = await cartService.removeItem(cartId, product_id);
        } else {
            throw new Error("Invalid event type");
        }

        res.status(200).json(updatedCart);
    } catch (error) {
        next(error);
    }
};

const checkoutController = async (req, res, next) => {
    try {
        const cartId = req.params.id;

        // Get cart with items BEFORE checkout (so we have bill data)
        const cartBeforeCheckout = await cartService.getCart(cartId);

        // Perform checkout
        const cart = await cartService.checkoutCart(cartId);

        // Send bill SMS automatically
        if (cartBeforeCheckout.user_phone && cartBeforeCheckout.items.length > 0) {
            const { sendBillSMS, generateBillText } = require("../services/smsService");
            const billText = generateBillText(cartBeforeCheckout);
            sendBillSMS(cartBeforeCheckout.user_phone, billText)
                .then(() => console.log(`[SMS] Bill sent to ${cartBeforeCheckout.user_phone}`))
                .catch((err) => console.error("[SMS] Failed to send bill:", err));
        }

        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCartController,
    getCartController,
    detectionEventController,
    checkoutController,
};
