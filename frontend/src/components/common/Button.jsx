import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    disabled,
    ...props
}) => {
    const variants = {
        primary: 'bg-primary hover:bg-primary-dark text-white shadow-md focus:ring-primary/50',
        secondary: 'bg-secondary hover:bg-secondary-dark text-white shadow-md focus:ring-secondary/50',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
        ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-card hover:text-gray-900',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={cn(
                'relative flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
