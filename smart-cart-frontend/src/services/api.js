/**
 * Mock API Service for Smart Cart System
 * Simulates backend delay and random live detection events
 */

const PRODUCTS = [
    { id: 1, name: "Fresh Milk", price: 45, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "Whole Wheat Bread", price: 40, image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=300&q=80" },
    { id: 3, name: "Red Apple", price: 25, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80" },
    { id: 4, name: "Bananas (1kg)", price: 60, image: "https://images.unsplash.com/photo-1603833665858-e61d17a86279?auto=format&fit=crop&w=300&q=80" },
    { id: 5, name: "Orange Juice", price: 120, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=300&q=80" },
    { id: 6, name: "Potato Chips", price: 30, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=300&q=80" },
];

// Simulating database
let cart = [];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    // Get current cart
    getCart: async () => {
        await delay(500);
        return [...cart];
    },

    // Add item to cart
    addItem: async (productId) => {
        await delay(300);
        const product = PRODUCTS.find((p) => p.id === productId);
        if (!product) throw new Error("Product not found");

        const existingItem = cart.find((item) => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        return [...cart];
    },

    // Remove item from cart
    removeItem: async (productId) => {
        await delay(300);
        const index = cart.findIndex((item) => item.id === productId);
        if (index > -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
        }
        return [...cart];
    },

    // Clear cart (Checkout)
    checkout: async () => {
        await delay(1000);
        cart = [];
        return { success: true, message: "Checkout successful" };
    },

    // Get all available products (for demo/admin)
    getProducts: async () => {
        await delay(200);
        return PRODUCTS;
    },
};
