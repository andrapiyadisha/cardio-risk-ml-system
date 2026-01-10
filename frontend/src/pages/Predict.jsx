import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Heart, HelpCircle, Lock } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { predictRisk } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Predict = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        age: '',
        gender: '1',
        height: '',
        weight: '',
        ap_hi: '',
        ap_lo: '',
        cholesterol: '1',
        gluc: '1',
        smoke: '0',
        alco: '0',
        active: '1'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            // Pass userId if logged in (always true now due to ProtectedRoute)
            const userId = user?.id;
            const result = await predictRisk(formData, userId);

            navigate('/result', { state: { result, inputData: formData } });
        } catch (error) {
            console.error("Prediction failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Heart Disease Risk Assessment</h1>
                    <p className="text-gray-600 dark:text-gray-400">Please provide accurate medical details for the most precise prediction.</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Age */}
                            <Input
                                label="Age (years)"
                                name="age"
                                type="number"
                                placeholder="e.g., 50"
                                value={formData.age}
                                onChange={handleChange}
                                min="1"
                                max="110"
                                required
                            />

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-dark-bg border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="1">Female</option>
                                    <option value="2">Male</option>
                                </select>
                            </div>

                            {/* Height */}
                            <Input
                                label="Height (cm)"
                                name="height"
                                type="number"
                                placeholder="e.g., 165"
                                value={formData.height}
                                onChange={handleChange}
                                min="50"
                                max="250"
                                required
                            />

                            {/* Weight */}
                            <Input
                                label="Weight (kg)"
                                name="weight"
                                type="number"
                                placeholder="e.g., 70"
                                value={formData.weight}
                                onChange={handleChange}
                                min="10"
                                max="300"
                                required
                            />

                            {/* Systolic BP */}
                            <Input
                                label="Systolic BP (Upper Value)"
                                name="ap_hi"
                                type="number"
                                placeholder="e.g., 120"
                                value={formData.ap_hi}
                                onChange={handleChange}
                                min="60"
                                max="250"
                                required
                            />

                            {/* Diastolic BP */}
                            <Input
                                label="Diastolic BP (Lower Value)"
                                name="ap_lo"
                                type="number"
                                placeholder="e.g., 80"
                                value={formData.ap_lo}
                                onChange={handleChange}
                                min="40"
                                max="150"
                                required
                            />

                            {/* Cholesterol */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Cholesterol Level
                                </label>
                                <select
                                    name="cholesterol"
                                    value={formData.cholesterol}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-dark-bg border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="1">Normal</option>
                                    <option value="2">Above Normal</option>
                                    <option value="3">Well Above Normal</option>
                                </select>
                            </div>

                            {/* Glucose */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Glucose Level
                                </label>
                                <select
                                    name="gluc"
                                    value={formData.gluc}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-dark-bg border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="1">Normal</option>
                                    <option value="2">Above Normal</option>
                                    <option value="3">Well Above Normal</option>
                                </select>
                            </div>

                            {/* Lifestyle Factors (Smoke, Alcohol, Active) */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Smoker?
                                    </label>
                                    <select
                                        name="smoke"
                                        value={formData.smoke}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-dark-bg border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Alcohol Intake?
                                    </label>
                                    <select
                                        name="alco"
                                        value={formData.alco}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-dark-bg border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Physical Activity?
                                    </label>
                                    <select
                                        name="active"
                                        value={formData.active}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-dark-bg border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button type="submit" size="lg" className="w-full text-lg shadow-xl" isLoading={loading}>
                                <Activity className="mr-2 h-5 w-5" />
                                Analyze Risk
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>

        </div>
    );
};

export default Predict;
