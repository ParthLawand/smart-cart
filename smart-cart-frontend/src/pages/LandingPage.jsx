import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Zap, Smartphone, ScanLine } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden font-sans">
            {/* Background Mesh Gradient */}
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
                <div className="flex gap-4">
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Login</button>
                    <Button size="sm" onClick={() => navigate('/cart')}>Get Started</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 md:px-4 pt-10 pb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Live Beta</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    Retail checkout, <br />
                    <span className="text-gradient">reimagined.</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    Skip the line with our AI-powered smart cart system. Scan items, track your total in real-time, and pay instantly via WhatsApp.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <button
                        onClick={() => navigate('/cart')}
                        className="group flex-1 bg-gray-900 hover:bg-gray-800 text-white text-lg font-semibold py-4 px-8 rounded-full shadow-xl shadow-gray-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        Start Shopping
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 text-lg font-semibold py-4 px-8 rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                    >
                        View Demo
                    </button>
                </div>

                {/* Feature Cards Floating */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full px-4">
                    {[
                        { icon: ScanLine, title: "Instant Scan", desc: "AI detection adds items instantly." },
                        { icon: Smartphone, title: "WhatsApp Pay", desc: "Checkout directly from your phone." },
                        { icon: Zap, title: "Real-time Sync", desc: "Your cart updates in milliseconds." },
                    ].map((feature, idx) => (
                        <div key={idx} className="glass p-6 rounded-3xl text-left hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
                                <feature.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                            <p className="text-sm text-gray-500">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
