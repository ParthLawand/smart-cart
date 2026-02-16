import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Wallet, Smartphone, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import VirtualPhone from '../components/simulation/VirtualPhone';

const CheckoutPage = () => {
    const { cartItems, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // WhatsApp / Virtual Phone State
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPhoneOpen, setIsPhoneOpen] = useState(false);
    const [phoneMessages, setPhoneMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);


    const taxRate = 0.05;
    const taxAmount = Math.round(totalAmount * taxRate);
    const finalAmount = totalAmount + taxAmount;

    const handlePayment = async () => {
        if (paymentMethod === 'whatsapp') {
            if (phoneNumber.length < 10) {
                alert("Please enter a valid 10-digit number");
                return;
            }
            startWhatsAppFlow();
            return;
        }

        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        await clearCart();
        setIsProcessing(false);
        setIsSuccess(true);
    };

    const startWhatsAppFlow = async () => {
        setIsProcessing(true);
        setIsPhoneOpen(true);

        // 1. Send Payment Request to Virtual Phone
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setPhoneMessages(prev => [
                    ...prev,
                    {
                        type: 'payment_request',
                        amount: finalAmount,
                        text: `Namaste! payment request for your order at Smart Cart.`,
                        sender: 'system',
                        status: 'pending'
                    }
                ]);
                setIsProcessing(false);
            }, 1500);
        }, 500);
    };

    const handleVirtualPaymentConfirm = async (amount) => {
        // Update message status to paid
        setPhoneMessages(prev => prev.map(msg =>
            msg.type === 'payment_request' ? { ...msg, status: 'paid' } : msg
        ));

        // Simulate processing
        setIsTyping(true);

        setTimeout(async () => {
            setIsTyping(false);

            // Send Bill
            setPhoneMessages(prev => [
                ...prev,
                {
                    type: 'bill',
                    items: cartItems,
                    total: finalAmount,
                    sender: 'system'
                }
            ]);

            // Complete actual checkout
            await clearCart();
            setIsSuccess(true);
        }, 2000);
    };


    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[100px] animate-float" />
                </div>

                <div className="max-w-md w-full glass p-8 rounded-3xl relative z-10 animate-in zoom-in duration-500">
                    <div className="mx-auto bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Payment Successful!</h1>
                    <p className="text-gray-500 mb-8 font-medium">Thank you for shopping with Smart Cart.<br /> Your receipt has been sent to WhatsApp.</p>
                    <Button onClick={() => navigate('/')} size="lg" className="w-full shadow-emerald-200">
                        Back to Home
                    </Button>
                </div>

                {/* Keep Phone Open to show Receipt */}
                <VirtualPhone
                    isOpen={isPhoneOpen}
                    onClose={() => setIsPhoneOpen(false)}
                    messages={phoneMessages}
                    onPaymentConfirm={handleVirtualPaymentConfirm}
                    isTyping={isTyping}
                />
            </div>
        );

    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-semibold text-lg mb-4">No items to checkout.</p>
                    <Button onClick={() => navigate('/cart')}>Return to Cart</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="glass sticky top-0 z-20 px-6 py-4 flex items-center gap-4 border-b border-gray-100/50">
                <Button
                    variant="ghost"
                    className="pl-0 hover:bg-transparent hover:text-emerald-600 transition-colors"
                    onClick={() => navigate('/cart')}
                >
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back
                </Button>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Checkout</h1>
            </header>

            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <Card className="p-8">
                            <h2 className="font-bold text-xl mb-6 text-gray-900">Select Payment Method</h2>
                            <div className="space-y-4">
                                {[
                                    { id: 'upi', label: 'UPI / QR Code', icon: Smartphone, color: 'text-blue-500 bg-blue-50' },
                                    { id: 'whatsapp', label: 'WhatsApp Pay', icon: Smartphone, color: 'text-green-500 bg-green-50' },
                                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, color: 'text-purple-500 bg-purple-50' },
                                    { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'text-orange-500 bg-orange-50' },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all duration-300 group ${paymentMethod === method.id
                                            ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-1 ring-emerald-500/20'
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-transform group-hover:scale-110 ${method.color}`}>
                                            <method.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <span className="font-bold text-gray-900 block">{method.label}</span>
                                            {method.id === 'whatsapp' && <span className="text-xs text-green-600 font-medium">Recommended</span>}
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === method.id ? 'border-emerald-600' : 'border-gray-300'
                                            }`}>
                                            {paymentMethod === method.id && <div className="w-3 h-3 rounded-full bg-emerald-600 animate-in zoom-in duration-300" />}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Phone Input for WhatsApp */}
                            {paymentMethod === 'whatsapp' && (
                                <div className="mt-6 p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        WhatsApp Number
                                    </label>
                                    <div className="flex gap-3">
                                        <div className="flex items-center justify-center w-14 bg-white border border-gray-200 rounded-xl text-gray-500 font-medium shadow-sm">
                                            +91
                                        </div>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            placeholder="Enter 10-digit number"
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white shadow-sm font-medium tracking-wide placeholder:text-gray-300 transition-shadow"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                                        <Smartphone className="w-3 h-3" /> We'll send a payment request to this number.
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-8 bg-white h-fit sticky top-24">
                            <h2 className="font-bold text-xl mb-6 text-gray-900">Order Summary</h2>
                            <div className="space-y-3 mb-6 max-h-[16rem] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm py-3 border-b border-gray-50 last:border-0 group">
                                        <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">{item.quantity} x {item.name}</span>
                                        <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-dashed border-gray-200">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Taxes (5%)</span>
                                    <span>₹{taxAmount}</span>
                                </div>
                                <div className="flex justify-between text-xl font-extrabold text-gray-900 mt-4 pt-4 border-t border-gray-100">
                                    <span>Total</span>
                                    <span className="text-emerald-600">₹{finalAmount}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full mt-8 shadow-xl shadow-emerald-100 hover:shadow-emerald-200"
                                size="lg"
                                onClick={handlePayment}
                                isLoading={isProcessing}
                            >
                                Pay ₹{finalAmount}
                            </Button>

                            <div className="mt-4 flex justify-center gap-4 text-gray-300">
                                <CreditCard className="w-5 h-5" />
                                <Smartphone className="w-5 h-5" />
                                <Wallet className="w-5 h-5" />
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <VirtualPhone
                isOpen={isPhoneOpen}
                onClose={() => setIsPhoneOpen(false)}
                messages={phoneMessages}
                onPaymentConfirm={handleVirtualPaymentConfirm}
                isTyping={isTyping}
            />
        </div >
    );
};

export default CheckoutPage;
