import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detectionStatus, setDetectionStatus] = useState("idle"); // idle, detecting, added, removed
    const [lastDetectedItem, setLastDetectedItem] = useState(null);

    // Calculate total
    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Initial load
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const items = await api.getCart();
            setCartItems(items);
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (productId) => {
        setDetectionStatus("detecting");
        try {
            const updatedCart = await api.addItem(productId);
            setCartItems(updatedCart);

            // Simulate detection feedback
            const addedItem = updatedCart.find(item => item.id === productId);
            if (addedItem) {
                setLastDetectedItem(addedItem);
                setDetectionStatus("added");
                setTimeout(() => setDetectionStatus("idle"), 2000);
            }
        } catch (error) {
            console.error("Failed to add item", error);
            setDetectionStatus("error");
        }
    };

    const removeItem = async (productId) => {
        setDetectionStatus("detecting");
        try {
            const itemToRemove = cartItems.find(item => item.id === productId);
            const updatedCart = await api.removeItem(productId);
            setCartItems(updatedCart);

            if (itemToRemove) {
                setLastDetectedItem(itemToRemove);
                setDetectionStatus("removed");
                setTimeout(() => setDetectionStatus("idle"), 2000);
            }
        } catch (error) {
            console.error("Failed to remove item", error);
            setDetectionStatus("error");
        }
    };

    const clearCart = async () => {
        try {
            await api.checkout();
            setCartItems([]);
        } catch (error) {
            console.error("Checkout failed", error);
        }
    }

    // Live Detection Simulation (Optional Demo Mode)
    // This can be toggled to simulate items being added automatically
    const simulateLiveDetection = async () => {
        // Randomly add a product
        const products = await api.getProducts();
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        await addItem(randomProduct.id);
    };

    const value = {
        cartItems,
        totalAmount,
        loading,
        detectionStatus,
        lastDetectedItem,
        addItem,
        removeItem,
        clearCart,
        simulateLiveDetection
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
