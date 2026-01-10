import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Result = () => {
    const location = useLocation();
    const { result } = location.state || {}; // { riskScore: "45.0", riskCategory: "Medium", probability: 0.45 }

    if (!result) {
        return <Navigate to="/predict" replace />;
    }

    const getRiskColor = (category) => {
        switch (category) {
            case 'Low': return 'text-green-500';
            case 'Medium': return 'text-yellow-500';
            case 'High': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getRiskBg = (category) => {
        switch (category) {
            case 'Low': return 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            case 'High': return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            default: return 'bg-gray-100';
        }
    };

    const getRiskIcon = (category) => {
        switch (category) {
            case 'Low': return <CheckCircle className="w-16 h-16 text-green-500" />;
            case 'Medium': return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
            case 'High': return <XCircle className="w-16 h-16 text-red-500" />;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Emergency Alert for High Risk */}
                    {result.riskCategory === 'High' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4 bg-red-600 text-white rounded-lg shadow-lg flex items-center gap-4"
                        >
                            <div className="bg-white/20 p-2 rounded-full">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">URGENT MEDICAL NOTICE</h4>
                                <p className="text-sm opacity-90">
                                    If you are experiencing chest pain, shortness of breath, or sudden weakness,
                                    please call emergency services immediately. This tool is not a substitute for clinical diagnosis.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Result Card */}
                        <Card className={`p-8 flex flex-col items-center justify-center text-center border-2 ${getRiskBg(result.riskCategory)}`}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                                className="mb-6"
                            >
                                {getRiskIcon(result.riskCategory)}
                            </motion.div>

                            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Estimated Risk Level</h2>
                            <div className={`text-5xl font-extrabold mb-4 ${getRiskColor(result.riskCategory)}`}>
                                {result.riskCategory} Risk
                            </div>

                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4 overflow-hidden relative">
                                <motion.div
                                    className={`h-full ${result.riskCategory === 'High' ? 'bg-red-500' : result.riskCategory === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.probability * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                Probability Score: <span className="font-bold">{result.riskScore}%</span>
                            </p>

                            {/* NEW: Top Contributing Factors */}
                            {result.factors && (
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 w-full">
                                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Top Risk Factors</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {result.factors.map((f, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Recommendations Card */}
                        <Card className="p-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recommendations</h3>
                            <ul className="space-y-4">
                                {result.riskCategory === 'High' ? (
                                    <>
                                        <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-red-500" />
                                            Consult a cardiologist immediately for a detailed checkup.
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-red-500" />
                                            Monitor your blood pressure and ECG regularly.
                                        </li>
                                    </>
                                ) : result.riskCategory === 'Medium' ? (
                                    <>
                                        <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-yellow-500" />
                                            Schedule a routine checkup with your doctor.
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-yellow-500" />
                                            Review your diet and increase physical activity.
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-green-500" />
                                            Maintain your current healthy lifestyle.
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-green-500" />
                                            Keep exercising regularly.
                                        </li>
                                    </>
                                )}
                            </ul>

                            {/* Guest Auth Prompt */}
                            {!localStorage.getItem('user') && (
                                <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20 text-center">
                                    <p className="text-sm font-medium text-primary mb-3">Want to track your heart health over time?</p>
                                    <Link to="/register">
                                        <Button size="sm" className="w-full">Create Account to Save History</Button>
                                    </Link>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <Link to="/health-info" className="text-primary font-medium hover:underline flex items-center justify-end">
                                    View Detailed Health Tips <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </Card>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                        <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
                            <strong>Disclaimer:</strong> This application is an academic project developed for educational purposes as part of a Machine Learning and Deep Learning (MLDL) course. The heart disease risk predictions are generated using machine learning models and are not clinically validated.

The results provided by this application should not be considered medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns, diagnosis, or treatment decisions.
                        </p>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Link to="/predict">
                            <Button variant="outline" className="flex items-center">
                                <RefreshCw className="mr-2 h-4 w-4" /> Assess Another Patient
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Result;
