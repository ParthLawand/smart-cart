import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    isLoading,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-2xl font-bold tracking-wide transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
        primary: "bg-gray-900 text-white shadow-lg shadow-gray-900/20 hover:bg-black hover:shadow-xl hover:shadow-gray-900/30 focus:ring-gray-200",
        secondary: "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 focus:ring-gray-100 shadow-sm",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-100 border border-red-100",
        ghost: "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-100"
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "p-2"
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
