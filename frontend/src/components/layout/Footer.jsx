import React from 'react';
import { Heart, Github, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-dark-card border-t border-gray-100 dark:border-gray-800 pt-12 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                CardioPrediction
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Empowering you with AI-driven insights for early heart disease detection. Your health, our priority.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Start Prediction', path: '/predict' },
                                { name: 'How It Works', path: '/#how-it-works' },
                                { name: 'Health Tips', path: '/health-info' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { name: 'Documentation', path: '#' },
                                { name: 'Privacy Policy', path: '#' },
                                { name: 'Terms of Service', path: '#' },
                                { name: 'FAQ', path: '#' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.path}
                                        className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Contact
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-sm">
                                <Mail className="h-4 w-4" />
                                <span>support@cardiopredict.com</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-sm">
                                <Phone className="h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-sm">
                                <Github className="h-4 w-4" />
                                <a href="#" className="hover:text-primary transition-colors">Github Repository</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center bg-transparent">
                    <p className="text-gray-400 text-sm text-center md:text-left">
                        © {new Date().getFullYear()} CardioPrediction. All rights reserved.
                    </p>
                    <p className="text-gray-400 text-xs mt-2 md:mt-0">
                        Not a medical diagnosis. Consult a doctor for professional advice.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
