import React from 'react';
import { useCart } from '../../context/CartContext';
import { Scan, CheckCircle, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Card from '../ui/Card';

const DetectionStatus = ({ className }) => {
    const { detectionStatus, lastDetectedItem } = useCart();

    if (detectionStatus === 'idle') return null;

    const getStatusConfig = () => {
        switch (detectionStatus) {
            case 'detecting':
                return {
                    icon: Loader2,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50 border-blue-100',
                    text: 'Detecting item...',
                    animate: 'animate-spin'
                };
            case 'added':
                return {
                    icon: CheckCircle,
                    color: 'text-green-600',
                    bg: 'bg-green-50 border-green-100',
                    text: `Added: ${lastDetectedItem?.name}`,
                    animate: 'animate-bounce'
                };
            case 'removed':
                return {
                    icon: Trash2,
                    color: 'text-orange-600',
                    bg: 'bg-orange-50 border-orange-100',
                    text: `Removed: ${lastDetectedItem?.name}`,
                    animate: 'animate-pulse'
                };
            case 'error':
                return {
                    icon: AlertCircle,
                    color: 'text-red-600',
                    bg: 'bg-red-50 border-red-100',
                    text: 'Detection failed. Please try again.',
                    animate: ''
                };
            default:
                return null;
        }
    };

    const config = getStatusConfig();
    if (!config) return null;

    const Icon = config.icon;

    return (
        <div className={twMerge(clsx("fixed bottom-24 left-1/2 transform -translate-x-1/2 md:bottom-8 z-50 transition-all duration-300", className))}>
            <Card className={clsx("flex items-center gap-3 px-6 py-4 shadow-lg border-2", config.bg)}>
                <Icon className={clsx("w-6 h-6", config.color, config.animate)} />
                <span className={clsx("font-semibold text-lg", config.color)}>
                    {config.text}
                </span>
            </Card>
        </div>
    );
};

export default DetectionStatus;
