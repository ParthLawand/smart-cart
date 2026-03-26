const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createCart = async (userPhone) => {
    const cart = new Cart({
        status: "ACTIVE",
        items: [],
        total_amount: 0,
        user_phone: userPhone || ""
    });

    await cart.save();
    return cart;
};

const lastEvents = {};

const isDuplicateEvent = (cartId, productId) => {
    const currentTime = Date.now();
    
    if (!lastEvents[cartId]) {
        lastEvents[cartId] = {};
    }

    const lastTime = lastEvents[cartId][productId];
    
    if (lastTime && (currentTime - lastTime < 2000)) {
        return true;
    }
    
    lastEvents[cartId][productId] = currentTime;
    return false;
};

const getCart = async (cartId) => {
    const cart = await Cart.findById(cartId);
    if (!cart) {
        throw new Error("Cart not found");
    }
    return cart;
};

const addItem = async (cartId, productId) => {
    const cart = await Cart.findById(cartId);
    if (!cart) {
        throw new Error("Cart not found");
    }

    if (cart.status !== "ACTIVE") {
        throw new Error("Cart is not active");
    }

    const product = await Product.findOne({
        product_id: productId
    });

    if (!product) {
        throw new Error("Product not found");
    }

    const existingItemIndex = cart.items.findIndex(item => item.product_id === productId);

    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += 1;
    } else {
        cart.items.push({
            product_id: product.product_id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    recalculateTotal(cart);
    await cart.save();
    return cart;
};

const removeItem = async (cartId, productId) => {
    const cart = await Cart.findById(cartId);
    if (!cart) {
        throw new Error("Cart not found");
    }

    if (cart.status !== "ACTIVE") {
        throw new Error("Cart is not active");
    }

    const itemIndex = cart.items.findIndex(item => item.product_id === productId);

    if (itemIndex === -1) {
        throw new Error("Item not found in cart");
    }

    if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
    } else {
        cart.items.splice(itemIndex, 1);
    }

    recalculateTotal(cart);
    await cart.save();
    return cart;
};

const checkoutCart = async (cartId) => {
    const cart = await Cart.findById(cartId);
    if (!cart) {
        throw new Error("Cart not found");
    }

    if (cart.status !== "ACTIVE") {
        throw new Error("Cart cannot be checked out");
    }

    if (cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    cart.status = "PAYMENT_PENDING";
    await cart.save();
    return cart;
};

const recalculateTotal = (cart) => {
    cart.total_amount = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};

module.exports = {
    createCart,
    getCart,
    addItem,
    removeItem,
    checkoutCart,
    isDuplicateEvent
};
