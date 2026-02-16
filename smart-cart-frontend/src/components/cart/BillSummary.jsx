import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const BillSummary = () => {
    const { totalAmount, cartItems } = useCart();
    const navigate = useNavigate();

    // Configurable taxes (dummy logic)
    const taxRate = 0.05; // 5%
    const taxAmount = Math.round(totalAmount * taxRate);
    const finalAmount = totalAmount + taxAmount;

    return (
        <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Bill Summary</h2>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span>₹{taxAmount}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-₹0</span>
                </div>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Payable</span>
                    <span className="text-2xl font-bold text-green-700">₹{finalAmount}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
            </div>

            <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/checkout')}
                disabled={cartItems.length === 0}
            >
                Confirm & Checkout
            </Button>
        </Card>
    );
};

export default BillSummary;
