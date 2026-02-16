import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, glass = false, hover = false, ...props }) => {
    return (
        <div
            className={twMerge(clsx(
                "rounded-3xl border transition-all duration-300",
                glass
                    ? "glass"
                    : "bg-white border-gray-100 shadow-sm",
                hover && "hover:shadow-xl hover:-translate-y-1",
                className
            ))}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
