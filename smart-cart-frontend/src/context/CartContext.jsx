import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
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
    const [isScanning, setIsScanning] = useState(false);
    const [detectionStatus, setDetectionStatus] = useState("idle");
    const [lastDetectedItem, setLastDetectedItem] = useState(null);
    const pollingRef = useRef(null);
    const prevItemsRef = useRef("[]");

    const cartId = localStorage.getItem("cartId");

    // Calculate total from cart items
    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Fetch cart from backend
    const fetchCart = useCallback(async () => {
        try {
            const items = await api.getCart();
            const itemsStr = JSON.stringify(items);

            // Only update state if items actually changed
            if (itemsStr !== prevItemsRef.current) {
                const oldItems = JSON.parse(prevItemsRef.current);
                prevItemsRef.current = itemsStr;
                setCartItems(items);

                // Detect newly added item for UI feedback
                if (oldItems.length < items.length) {
                    const newItem = items.find(
                        (item) => !oldItems.some((old) => old.id === item.id)
                    );
                    if (newItem) {
                        setLastDetectedItem(newItem);
                        setDetectionStatus("added");
                        setTimeout(() => setDetectionStatus("idle"), 2000);
                    }
                } else if (oldItems.length > items.length) {
                    const removedItem = oldItems.find(
                        (old) => !items.some((item) => item.id === old.id)
                    );
                    if (removedItem) {
                        setLastDetectedItem(removedItem);
                        setDetectionStatus("removed");
                        setTimeout(() => setDetectionStatus("idle"), 2000);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        if (cartId) {
            setLoading(true);
            fetchCart().finally(() => setLoading(false));
        }
    }, [cartId, fetchCart]);

    // Polling — fetch cart every 2 seconds
    useEffect(() => {
        if (cartId) {
            pollingRef.current = setInterval(fetchCart, 2000);
        }
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [cartId, fetchCart]);

    // Add item manually
    const addItem = async (productId) => {
        setDetectionStatus("detecting");
        try {
            const updatedCart = await api.addItem(productId);
            setCartItems(updatedCart);
            prevItemsRef.current = JSON.stringify(updatedCart);

            const addedItem = updatedCart.find((item) => item.id === productId);
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

    // Remove item manually
    const removeItem = async (productId) => {
        setDetectionStatus("detecting");
        try {
            const itemToRemove = cartItems.find((item) => item.id === productId);
            const updatedCart = await api.removeItem(productId);
            setCartItems(updatedCart);
            prevItemsRef.current = JSON.stringify(updatedCart);

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

    // Checkout
    const clearCart = async () => {
        try {
            await api.checkout();
            setCartItems([]);
            prevItemsRef.current = "[]";
        } catch (error) {
            console.error("Checkout failed", error);
        }
    };

    // Start YOLO scan
    const startScan = async () => {
        try {
            await api.startScan();
            setIsScanning(true);
        } catch (error) {
            console.error("Failed to start scan", error);
        }
    };

    // Stop YOLO scan
    const stopScan = async () => {
        try {
            await api.stopScan();
            setIsScanning(false);
        } catch (error) {
            console.error("Failed to stop scan", error);
        }
    };

    const value = {
        cartItems,
        totalAmount,
        loading,
        cartId,
        isScanning,
        detectionStatus,
        lastDetectedItem,
        addItem,
        removeItem,
        clearCart,
        startScan,
        stopScan,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
