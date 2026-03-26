import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CartDashboard from './pages/CartDashboard';
import CheckoutPage from './pages/CheckoutPage';
import { api } from './services/api';

// Route guard component
const ProtectedRoute = ({ children }) => {
    if (!api.isLoggedIn()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/cart" element={
                <ProtectedRoute>
                    <CartDashboard />
                </ProtectedRoute>
            } />
            <Route path="/checkout" element={
                <ProtectedRoute>
                    <CheckoutPage />
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default App;