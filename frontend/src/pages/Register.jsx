import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        try {
            const data = await registerUser(formData);
            login(data.user, data.token); // Auto login
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
            <Card className="w-full max-w-md p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Join us to monitor your heart health</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Full Name"
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        icon={User}
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        icon={Mail}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        icon={Lock}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        icon={Lock}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <Button type="submit" className="w-full py-2.5 text-lg" isLoading={loading}>
                        Sign Up
                    </Button>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-medium hover:underline">
                            Sign In
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Register;
