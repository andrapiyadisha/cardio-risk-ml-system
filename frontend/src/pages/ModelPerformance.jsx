import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Brain, Activity, BarChart2 } from 'lucide-react';
import Card from '../components/common/Card';
import { getModelMetrics } from '../services/api';

const ModelPerformance = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getModelMetrics();
                setMetrics(data);
            } catch (error) {
                console.error("Failed to load metrics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return <div className="text-center p-10">Loading model analysis...</div>;

    const performanceData = [
        { name: 'Accuracy', value: metrics?.accuracy * 100 },
        { name: 'Precision', value: metrics?.precision * 100 },
        { name: 'Recall', value: metrics?.recall * 100 },
        { name: 'F1 Score', value: metrics?.f1 * 100 },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Brain className="h-8 w-8 text-primary" />
                    Model Performance & Analysis
                </h1>
                <p className="text-gray-500 mt-2">Transparency report for our Heart Disease Prediction Logic</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Key Metrics */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Overall Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Score (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Feature Importance */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Feature Importance (Top 5)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics?.featureImportance} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 1]} />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} name="Importance Weight" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Model Architecture Transparency */}
            <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-blue-900/10 border-none">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="md:w-1/3 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">Model Architecture</h3>
                        <p className="text-blue-700 dark:text-blue-400 opacity-80">Technical transparency and academic peer-review data.</p>
                    </div>
                    <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { label: "Algorithm", value: "Manual Decision Tree" },
                            { label: "Implementation", value: "CART (Gini Index)" },
                            { label: "Dataset", value: "70,000 Medical Records" },
                            { label: "Validation", value: "80/20 Stratified Split" },
                            { label: "Features", value: "13 Medical Parameters" },
                            { label: "Library", value: "Pure NumPy / Python" }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg backdrop-blur-sm">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">{item.label}</p>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Training History */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Training Progress (Illustrative)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics?.trainingHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="epoch" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#10b981" name="Accuracy" />
                                <Line yAxisId="right" type="monotone" dataKey="loss" stroke="#ef4444" name="Loss" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Confusion Matrix Visualization */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Confusion Matrix</h3>
                    <div className="flex items-center justify-center h-64">
                        <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase">True Positive</p>
                                <p className="text-2xl font-bold text-green-600">{metrics?.confusionMatrix[0].TP}</p>
                            </div>
                            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase">False Negative</p>
                                <p className="text-2xl font-bold text-red-600">{metrics?.confusionMatrix[0].FN}</p>
                            </div>
                            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase">False Positive</p>
                                <p className="text-2xl font-bold text-red-600">{metrics?.confusionMatrix[1].FP}</p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase">True Negative</p>
                                <p className="text-2xl font-bold text-green-600">{metrics?.confusionMatrix[1].TN}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ModelPerformance;
