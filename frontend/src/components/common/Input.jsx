import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ label, error, className, icon: Icon, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    className={cn(
                        "w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-dark-bg border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                        Icon && "pl-10",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500 animate-fadeIn">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
