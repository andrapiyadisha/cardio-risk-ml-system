import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, TrendingUp, Users, ArrowRight, HeartPulse, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden items-center flex bg-gradient-to-b from-blue-50 to-white dark:from-dark-bg dark:to-dark-card transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6 tracking-tight">
                                Predict Your <br /> Heart Risk Today
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                                Advanced machine learning algorithms to assess your cardiovascular health instantly.
                                Early detection saves lives.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/predict">
                                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                                    Check Your Risk <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                                    Login to Save Results
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 dark:opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>
            </section>

            {/* About Section */}
            <section className="py-24 bg-white dark:bg-dark-bg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="md:w-1/2"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
                                <Card className="p-8 relative z-10 border-0 shadow-2xl">
                                    <Brain className="w-16 h-16 text-primary mb-6" />
                                    <h3 className="text-2xl font-bold mb-4 dark:text-white">AI-Powered Analysis</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-0">
                                        Our system utilizes state-of-the-art Random Forest and Logistic Regression models trained on over 70,000 medical records to provide highly accurate risk assessments. We analyze key factors including age, blood pressure, cholesterol levels, and lifestyle choices.
                                    </p>
                                </Card>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="md:w-1/2"
                        >
                            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Why Choose Our System?</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                Heart disease is the leading cause of death globally. Our tool empowers you with knowledge to take control of your heart health before it's too late.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Instant Results with High Accuracy",
                                    "Secure & Private Data Handling",
                                    "Personalized Health Recommendations",
                                    "Easy-to-Understand Visual Reports"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-24 bg-gray-50 dark:bg-dark-card/50" id="how-it-works">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">How It Works</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Three simple steps to understand your heart health risk.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Activity,
                                title: "1. Enter Data",
                                desc: "Input your basic medical parameters like age, blood pressure, and cholesterol levels into our secure form."
                            },
                            {
                                icon: Brain,
                                title: "2. AI Analysis",
                                desc: "Our machine learning model processes your data against thousands of patterns to calculate your risk score."
                            },
                            {
                                icon: TrendingUp,
                                title: "3. Get Results",
                                desc: "Receive an instant report with your risk level and actionable lifestyle recommendations."
                            }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2, duration: 0.5 }}
                            >
                                <Card className="h-full p-8 hover:shadow-xl transition-shadow border-t-4 border-t-primary">
                                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-primary">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 dark:text-white">{step.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                        Take the First Step Towards a Healthy Heart
                    </h2>
                    <Link to="/predict">
                        <Button size="lg" className="bg-white text-primary hover:bg-gray-100 border-none">
                            Start Your Assessment Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
