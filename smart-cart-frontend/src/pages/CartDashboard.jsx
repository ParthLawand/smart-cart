import React from 'react';
import { useCart } from '../context/CartContext';
import CartItemCard from '../components/cart/CartItemCard';
import BillSummary from '../components/cart/BillSummary';
import DetectionStatus from '../components/cart/DetectionStatus';
import { ShoppingBag, ScanLine, StopCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const CartDashboard = () => {
    const { cartItems, isScanning, startScan, stopScan } = useCart();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-24 md:pb-0">
            {/* Header */}
            <header className="glass sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b border-gray-100/50">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-green-400 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-200">
                        <ShoppingBag className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">My Smart Cart</h1>
                </div>

                {isScanning ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={stopScan}
                        className="text-xs text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-full px-4"
                    >
                        <StopCircle className="w-4 h-4 mr-2" />
                        Stop Scan
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={startScan}
                        className="text-xs text-gray-400 hover:text-emerald-600 bg-gray-100/50 hover:bg-emerald-50 rounded-full px-4"
                    >
                        <ScanLine className="w-4 h-4 mr-2" />
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                        Scan Item
                    </Button>
                )}
            </header>

            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Scanning Status Banner */}
                    {isScanning && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <ScanLine className="w-5 h-5 text-emerald-600 animate-pulse" />
                            </div>
                            <div>
                                <p className="font-bold text-emerald-800 text-sm">Camera Active</p>
                                <p className="text-xs text-emerald-600">Point a product at the camera to scan it into your cart</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Cart Items <span className="text-gray-400 text-lg font-medium ml-1">({cartItems.length})</span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 hover:border-emerald-200 transition-colors duration-500 group">
                                <div className="bg-gray-50 group-hover:bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-500">
                                    <ShoppingBag className="w-10 h-10 text-gray-300 group-hover:text-emerald-500 transition-colors duration-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Your cart is empty</h3>
                                <p className="text-gray-500 mt-2 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
                                <div className="mt-8">
                                    <Button variant="primary" onClick={startScan} className="rounded-full shadow-emerald-200">
                                        <ScanLine className="w-4 h-4 mr-2" />
                                        Scan First Item
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <CartItemCard key={item.id} item={item} />
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Bill Summary */}
                <div className="relative">
                    <BillSummary />
                </div>
            </main>

            {/* Live Detection Overlay */}
            <DetectionStatus />
        </div>
    );
};

export default CartDashboard;
