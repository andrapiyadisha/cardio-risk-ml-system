import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Predict', path: '/predict' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Model Analysis', path: '/model-performance' },
        { name: 'Health Info', path: '/health-info' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Heart className="h-8 w-8 text-primary animate-pulse" fill="currentColor" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            CardioPrediction
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                                    ? 'text-primary'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-600" />
                            )}
                        </button>

                        {/* User Menu / Login Button */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:inline-block">
                                    {user.name}
                                </span>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 rounded-md border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shadow-md flex items-center space-x-2"
                            >
                                <User className="h-4 w-4" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-600" />
                            )}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-dark-card border-t dark:border-gray-800 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="block w-full text-center mt-4 px-4 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center mt-4 px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
