import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await loginUser(formData.email, formData.password);
            login(data.user, data.token); // Save both to context
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
            <Card className="w-full max-w-md p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to access your health dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div className="space-y-1">
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
                        <div className="flex justify-end">
                            <Link to="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-2.5 text-lg" isLoading={loading}>
                        Sign In
                    </Button>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-medium hover:underline">
                            Create Account
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Login;
