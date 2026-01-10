import React from 'react';
import { Heart, Activity, AlertCircle, Apple } from 'lucide-react';
import Card from '../components/common/Card';

const HealthInfo = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Heart Health Information</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Understanding heart disease is the first step towards prevention. Learn about symptoms, causes, and how to maintain a healthy heart.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* What is a Heart Attack */}
                <Card className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600">
                            <Heart className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What is a Heart Attack?</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        A heart attack, or myocardial infarction, happens when the flow of blood to the heart is severely reduced or blocked. The blockage is usually due to a buildup of fat, cholesterol and other substances in the heart (coronary) arteries. The fatty, cholesterol-containing deposits are called plaques. The process of plaque buildup is called atherosclerosis.
                    </p>
                </Card>

                {/* Symptoms */}
                <Card className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Warning Signs</h2>
                    </div>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">•</span> Chest pain or discomfort (pressure, squeezing, fullness)
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">•</span> Pain spreading to the shoulder, arm, back, neck, jaw, or teeth
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">•</span> Cold sweat, fatigue, heartburn or indigestion
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">•</span> Lightheadedness or sudden dizziness
                        </li>
                    </ul>
                </Card>
            </div>

            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Prevention & Lifestyle</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: "Eat a Healthy Diet",
                        icon: Apple,
                        desc: "Choose a diet that emphasizes fruits, vegetables, whole grains, and low-fat dairy products.",
                        color: "text-green-600",
                        bg: "bg-green-100 dark:bg-green-900/30"
                    },
                    {
                        title: "Get Active",
                        icon: Activity,
                        desc: "Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity a week.",
                        color: "text-blue-600",
                        bg: "bg-blue-100 dark:bg-blue-900/30"
                    },
                    {
                        title: "Quit Smoking",
                        icon: AlertCircle,
                        desc: "Smoking is a major risk factor. Quitting drastically reduces your risk of heart disease within a year.",
                        color: "text-gray-600",
                        bg: "bg-gray-100 dark:bg-gray-800"
                    }
                ].map((item, idx) => (
                    <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                        <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                            <item.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {item.desc}
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default HealthInfo;
