import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Calendar, FileText } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { getUserHistory } from '../services/api';

const History = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (user?.id) {
                try {
                    const data = await getUserHistory(user.id);
                    setHistory(data);
                } catch (error) {
                    console.error("Failed to fetch history", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchHistory();
    }, [user]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading history...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
                <Button variant="ghost" className="mr-4" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prediction History</h1>
                    <p className="text-gray-500 dark:text-gray-400">Complete record of your health assessments</p>
                </div>
            </div>

            <Card className="p-6">
                {history.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {history.map((item) => (
                            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start md:items-center space-x-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Heart Risk Assessment</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium 
                                                ${item.result.includes('High') ? 'bg-red-100 text-red-700' :
                                                    item.result.includes('Medium') ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'}`}>
                                                {item.result}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Calendar className="h-3.5 w-3.5 mr-1" />
                                            {item.date}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Risk Score</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{item.score}%</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No history found</h3>
                        <p className="text-gray-500 mt-2">You haven't made any predictions yet.</p>
                        <Button className="mt-6" onClick={() => navigate('/predict')}>
                            Make First Prediction
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default History;
