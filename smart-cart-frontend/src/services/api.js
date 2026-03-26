import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE
});

// Attach JWT token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses (expired/invalid token)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('cartId');
            localStorage.removeItem('userPhone');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

// -------- CART ID MANAGEMENT --------
const getCartId = () => localStorage.getItem('cartId');

// -------- REAL API --------
export const api = {

    // -------- AUTH --------
    register: async (phone, password, name) => {
        const { data } = await axiosInstance.post('/auth/register', { phone, password, name });
        localStorage.setItem('token', data.token);
        localStorage.setItem('userPhone', data.user.phone);
        return data;
    },

    login: async (phone, password) => {
        const { data } = await axiosInstance.post('/auth/login', { phone, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('userPhone', data.user.phone);
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cartId');
        localStorage.removeItem('userPhone');
    },

    isLoggedIn: () => {
        return !!localStorage.getItem('token');
    },

    // -------- CART --------
    getCart: async () => {
        try {
            const cartId = getCartId();
            if (!cartId) return [];
            const { data } = await axiosInstance.get(`/cart/${cartId}`);
            if (!data || !data.items) return [];
            return data.items.map(item => ({
                ...item,
                id: item.product_id,
            }));
        } catch (error) {
            console.error("Failed to fetch cart", error);
            return [];
        }
    },

    addItem: async (productId) => {
        const cartId = getCartId();
        const { data } = await axiosInstance.post(`/cart/${cartId}/detection-event`, {
            event: "ADD",
            product_id: String(productId),
            confidence: 0.95
        });
        const cart = data.cart || data;
        if (!cart || !cart.items) return [];
        return cart.items.map(item => ({
            ...item,
            id: item.product_id,
        }));
    },

    removeItem: async (productId) => {
        const cartId = getCartId();
        const { data } = await axiosInstance.post(`/cart/${cartId}/detection-event`, {
            event: "REMOVE",
            product_id: String(productId),
            confidence: 0.95
        });
        const cart = data.cart || data;
        if (!cart || !cart.items) return [];
        return cart.items.map(item => ({
            ...item,
            id: item.product_id,
        }));
    },

    checkout: async () => {
        const cartId = getCartId();
        await axiosInstance.post(`/cart/${cartId}/checkout`);
        localStorage.removeItem('cartId');
        return { success: true, message: "Checkout successful" };
    },

    createCart: async () => {
        const { data } = await axiosInstance.post('/cart');
        const cartId = data._id;
        if (cartId) localStorage.setItem('cartId', cartId);
        return data;
    },

    // -------- SCAN --------
    startScan: async () => {
        const cartId = getCartId();
        const { data } = await axiosInstance.post('/scan/start', { cartId });
        return data;
    },

    stopScan: async () => {
        const { data } = await axiosInstance.post('/scan/stop');
        return data;
    },
};
