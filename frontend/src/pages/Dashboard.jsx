import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Activity, Calendar, Heart, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.id) {
                try {
                    const data = await getUserStats(user.id);
                    setStats(data);
                } catch (error) {
                    console.error("Failed to fetch stats", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchStats();
    }, [user]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    const riskHistory = stats?.riskHistory?.length > 0 ? stats.riskHistory : [
        { date: 'No Data', score: 0 }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name || 'Guest'}</p>
                </div>
                <Link to="/predict">
                    <Button>
                        <Activity className="mr-2 h-4 w-4" />
                        New Prediction
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <Card className={`p-4 flex items-center space-x-3 hover:shadow-lg transition-all duration-300 border-l-4 ${parseFloat(stats?.lastRisk) >= 50 ? 'border-red-500 bg-red-50/30' :
                    parseFloat(stats?.lastRisk) >= 25 ? 'border-yellow-500 bg-yellow-50/30' :
                        'border-green-500 bg-green-50/30'
                    }`}>
                    <div className={`p-2 rounded-full ${parseFloat(stats?.lastRisk) >= 50 ? 'bg-red-100 text-red-500' :
                        parseFloat(stats?.lastRisk) >= 25 ? 'bg-yellow-100 text-yellow-500' :
                            'bg-green-100 text-green-500'
                        }`}>
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Current Risk</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stats?.lastRisk || 'N/A'}</h3>
                    </div>
                </Card>

                <Card className="p-4 flex items-center space-x-3 hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500 bg-blue-50/30">
                    <div className={`p-2 rounded-full bg-blue-100 text-blue-500`}>
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Systolic BP</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stats?.lastSystolic || 'N/A'}</h3>
                    </div>
                </Card>

                <Card className="p-4 flex items-center space-x-3 hover:shadow-lg transition-all duration-300 border-l-4 border-cyan-500 bg-cyan-50/30">
                    <div className={`p-2 rounded-full bg-cyan-100 text-cyan-500`}>
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Diastolic BP</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stats?.lastDiastolic || 'N/A'}</h3>
                    </div>
                </Card>

                <Card className="p-4 flex items-center space-x-3 hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500 bg-purple-50/30">
                    <div className={`p-2 rounded-full bg-purple-100 text-purple-500`}>
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Assessments</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stats?.totalPredictions || 0}</h3>
                    </div>
                </Card>

                <Card className="p-4 flex items-center space-x-3 hover:shadow-lg transition-all duration-300 border-l-4 border-indigo-500 bg-indigo-50/30">
                    <div className={`p-2 rounded-full bg-indigo-100 text-indigo-500`}>
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            {parseFloat(stats?.lastRisk) >= 50 ? 'Action Needed' :
                                parseFloat(stats?.lastRisk) >= 25 ? 'Monitor' : 'Stable'}
                        </h3>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2">
                    <Card className="p-6 h-full">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Risk Score History</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={riskHistory}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Recent Activity & Tips */}
                <div className="space-y-8">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                        {/* Displaying simple list from charts data for consistency until we add full history list */}
                        <div className="space-y-4">
                            {[...riskHistory].reverse().slice(0, 3).map((item, index) => (
                                <div key={index} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 last:border-0 pb-3 last:pb-0">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                            <Activity className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Risk Assessment</p>
                                            <p className="text-xs text-gray-500">{item.date}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-500">
                                        {item.score}% Risk
                                    </span>
                                </div>
                            ))}
                            {riskHistory.length === 0 && <p className="text-sm text-gray-500">No recent activity.</p>}
                        </div>
                        <div className="mt-6 text-center">
                            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/history')}>View All History</Button>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-primary to-primary-dark text-white border-none">
                        <h3 className="text-lg font-bold mb-2">Daily Health Tip</h3>
                        <p className="text-blue-50 mb-4 opacity-90">
                            "{stats?.dailyTip || "Loading tip..."}"
                        </p>
                        <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-gray-100 w-full" onClick={() => navigate('/health-info')}>
                            Read More Tips
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
