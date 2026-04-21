import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}) => {
    const variants = {
        primary: "bg-nexagen-green text-white hover:bg-nexagen-dark",
        secondary: "bg-nexagen-blue text-white hover:bg-blue-900",
        outline: "border-2 border-nexagen-green text-nexagen-green hover:bg-nexagen-green hover:text-white",
        ghost: "text-nexagen-green hover:bg-nexagen-green/10",
        gold: "bg-nexagen-gold text-nexagen-dark hover:brightness-110",
    };

    const sizes = {
        sm: "px-4 py-1.5 text-sm",
        md: "px-6 py-2.5",
        lg: "px-8 py-3.5 text-lg font-semibold",
    };

    return (
        <button
            className={cn(
                "interactive-button rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-nexagen-accent/50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
