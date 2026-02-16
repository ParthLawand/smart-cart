import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, CheckCheck, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

const VirtualPhone = ({ isOpen, onClose, messages, onPaymentConfirm, isTyping }) => {
    const messagesEndRef = useRef(null);
    const [newMessage, setNewMessage] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-8 right-8 w-[340px] h-[680px] bg-black rounded-[3rem] shadow-2xl overflow-hidden z-50 flex flex-col font-sans border-[6px] border-gray-800 ring-2 ring-gray-900/5 transition-all duration-300 transform hover:scale-[1.01] origin-bottom-right animate-in slide-in-from-bottom-20 zoom-in-95 duration-500">
            {/* Dynamic Island / Notch Area */}
            <div className="bg-white h-12 flex items-center justify-between px-7 pt-3 pb-1 text-black text-xs relative z-20">
                <span className="font-semibold ml-1">9:41</span>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full flex items-center justify-center gap-2 px-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                </div>
                <div className="flex gap-1.5 text-black">
                    <span className="font-bold">5G</span>
                    <div className="flex gap-0.5 items-end h-2.5">
                        <div className="w-0.5 h-1 bg-black rounded-full"></div>
                        <div className="w-0.5 h-1.5 bg-black rounded-full"></div>
                        <div className="w-0.5 h-2.5 bg-black rounded-full"></div>
                        <div className="w-0.5 h-2 bg-black rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* WhatsApp Header */}
            <div className="bg-[#008069] p-3 flex items-center gap-3 text-white shadow-md z-10">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center overflow-hidden border border-white/20">
                    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=smartcart" alt="Bot" className="w-8 h-8" />
                </div>
                <div className="flex-1">
                    <div className="font-bold text-sm tracking-wide">Smart Cart Official</div>
                    <div className="text-[10px] opacity-90 leading-none mt-0.5">Business Account</div>
                </div>
                <div className="flex gap-5 opacity-90 pr-2">
                    <Video className="w-5 h-5" />
                    <Phone className="w-5 h-5" />
                    <MoreVertical className="w-5 h-5" />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-[#efeae2] p-4 overflow-y-auto relative custom-scrollbar flex flex-col gap-3">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-multiply"
                    style={{
                        backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                        backgroundSize: '400px'
                    }}
                />

                {/* Date Divider */}
                <div className="flex justify-center my-3 relative z-10">
                    <span className="bg-[#eef0f1] text-[#54656f] text-[10px] font-medium px-2 py-1 rounded-lg shadow-sm uppercase tracking-wide">
                        Today
                    </span>
                </div>

                {/* Encryption Message */}
                <div className="text-[10px] text-center text-[#54656f] bg-[#ffeecd] px-3 py-2 rounded-lg mx-2 mb-4 shadow-sm relative z-10 leading-relaxed">
                    <span className="mr-1">🔒</span> Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
                </div>

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`max-w-[85%] self-${msg.sender === 'user' ? 'end' : 'start'} relative z-10 flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`p-2 px-3 rounded-lg shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-sm leading-snug ${msg.sender === 'user'
                                ? 'bg-[#d9fdd3] rounded-tr-none'
                                : 'bg-white rounded-tl-none'
                                }`}
                        >
                            {msg.type === 'payment_request' ? (
                                <div className="min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/50">
                                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <span className="text-[8px]">₹</span>
                                        </div>
                                        <span className="font-semibold text-emerald-800 text-xs uppercase tracking-wider">Payment Request</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">₹{msg.amount}</div>
                                    <p className="text-gray-500 text-[11px] mb-3">{msg.text}</p>
                                    <button
                                        onClick={() => onPaymentConfirm(msg.amount)}
                                        className="w-full bg-[#00a884] hover:bg-[#008f6f] text-white py-2.5 rounded-full font-semibold text-sm transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                                        disabled={msg.status === 'paid'}
                                    >
                                        {msg.status === 'paid' ? (
                                            <>
                                                <CheckCheck className="w-4 h-4" /> Paid
                                            </>
                                        ) : (
                                            'Pay Now'
                                        )}
                                    </button>
                                </div>
                            ) : msg.type === 'bill' ? (
                                <div className="space-y-2 min-w-[200px]">
                                    <div className="flex items-center justify-between border-b pb-2 mb-1 border-dashed border-gray-300">
                                        <span className="font-bold text-gray-900 text-xs">SMART CART RECEIPT</span>
                                        <span className="text-[10px] text-gray-400">#{Math.floor(Math.random() * 10000)}</span>
                                    </div>
                                    <div className="space-y-1.5 text-xs text-gray-700">
                                        {msg.items.map((item, i) => (
                                            <div key={i} className="flex justify-between">
                                                <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                                <span className="font-medium">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold text-base text-gray-900">
                                            <span>Total</span>
                                            <span>₹{msg.total}</span>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-50 text-emerald-700 text-[10px] p-1.5 rounded text-center font-medium mt-1">
                                        <CheckCheck className="w-3 h-3 inline mr-1" /> Paid via WhatsApp Pay
                                    </div>
                                </div>
                            ) : (
                                <div>{msg.text}</div>
                            )}

                            <div className="flex justify-end items-center gap-1 mt-1 -mb-1 select-none">
                                <span className="text-[10px] text-gray-500/80">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="self-start bg-white p-3 rounded-xl rounded-tl-none shadow-sm w-16 flex justify-center items-center relative z-10">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] px-2 py-2 flex items-center gap-2 pb-6">
                <div className="bg-white flex-1 rounded-full px-4 py-2.5 text-sm text-gray-600 shadow-sm flex items-center justify-between cursor-text">
                    <span className="text-gray-400">Message...</span>
                </div>
                <div className="w-11 h-11 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#008f6f] transition-colors cursor-pointer">
                    <Send className="w-5 h-5 ml-0.5" />
                </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[35%] h-1.5 bg-black/20 rounded-full backdrop-blur-3xl z-50 pointer-events-none" />
        </div>
    );
};

export default VirtualPhone;
