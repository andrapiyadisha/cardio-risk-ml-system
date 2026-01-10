import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({ children, className }) => {
    return (
        <div className={cn(
            "bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300 overflow-hidden",
            className
        )}>
            {children}
        </div>
    );
};

export default Card;
