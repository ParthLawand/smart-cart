import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const CartItemCard = ({ item }) => {
    const { addItem, removeItem } = useCart();

    return (
        <Card hover className="flex flex-row p-4 gap-5 items-center group">
            <div className="w-24 h-24 flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-2 overflow-hidden relative">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <div className="flex-1 flex flex-col justify-between h-24 py-1">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Groceries &bull; 500g</p>
                </div>

                <div className="flex items-end justify-between">
                    <div className="font-extrabold text-xl text-emerald-600">
                        ₹{item.price * item.quantity}
                        <span className="text-gray-300 text-xs font-normal ml-2 line-through">₹{item.price * 1.2}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-500 hover:text-red-500 shadow-sm transition-all active:scale-95"
                        >
                            {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                        </button>
                        <span className="font-bold text-gray-900 w-8 text-center text-sm">{item.quantity}</span>
                        <button
                            onClick={() => addItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:bg-black transition-all active:scale-95"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CartItemCard;
