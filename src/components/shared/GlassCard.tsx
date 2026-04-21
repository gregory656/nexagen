import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
    return (
        <div className={cn(
            "glass rounded-2xl p-6 transition-all duration-300 hover:shadow-xl",
            className
        )}>
            {children}
        </div>
    );
};
