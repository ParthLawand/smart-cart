import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, User, Lock, Phone, UserPlus } from 'lucide-react';
import { api } from '../services/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (phone.length < 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        if (password.length < 4) {
            setError('Password must be at least 4 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isRegister) {
                await api.register(phone, password, name);
            } else {
                await api.login(phone, password);
            }

            // Create a new cart for this session
            await api.createCart();

            navigate('/cart');
        } catch (err) {
            const serverMsg = err.response?.data?.error;
            setError(serverMsg || 'Something went wrong. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden font-sans">
            {/* Background Mesh */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-300/20 rounded-full blur-[120px] animation-delay-2000 animate-float" />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-6 md:px-12 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900">Smart Cart</span>
                </div>
            </nav>

            {/* Login/Register Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 md:px-4 pb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Smart Cart System</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-4 tracking-tight max-w-3xl">
                    Welcome to <span className="text-gradient">Smart Cart</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
                    {isRegister
                        ? 'Create your account to start shopping with AI-powered checkout.'
                        : 'Login to your account and start shopping instantly.'}
                </p>

                <div className="glass p-8 rounded-3xl max-w-md w-full text-left">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            {isRegister ? <UserPlus className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{isRegister ? 'Create Account' : 'Login'}</h3>
                            <p className="text-sm text-gray-500">
                                {isRegister ? 'Enter your details to register' : 'Enter your credentials to continue'}
                            </p>
                        </div>
                    </div>

                    {/* Name field (register only) */}
                    {isRegister && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl text-gray-400 shadow-sm">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setError(''); }}
                                    placeholder="Your name (optional)"
                                    className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white shadow-sm font-medium placeholder:text-gray-300 transition-shadow"
                                />
                            </div>
                        </div>
                    )}

                    {/* Phone field */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <div className="flex gap-3">
                            <div className="flex items-center justify-center w-14 bg-white border border-gray-200 rounded-xl text-gray-500 font-medium shadow-sm">
                                +91
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                                placeholder="Enter 10-digit number"
                                className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white shadow-sm font-medium tracking-wide placeholder:text-gray-300 transition-shadow"
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl text-gray-400 shadow-sm">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                placeholder="Enter password"
                                className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white shadow-sm font-medium placeholder:text-gray-300 transition-shadow"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="group w-full bg-gray-900 hover:bg-gray-800 text-white text-lg font-semibold py-4 px-8 rounded-full shadow-xl shadow-gray-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {isRegister ? 'Creating Account...' : 'Logging in...'}
                            </span>
                        ) : (
                            <>
                                {isRegister ? 'Create Account' : 'Start Shopping'}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {/* Toggle between Login / Register */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                                className="ml-2 font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                {isRegister ? 'Login' : 'Register'}
                            </button>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
