const API_URL = 'https://cardio-risk-ml-system.onrender.com/';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        throw error;
    }
};

export const predictRisk = async (data, userId) => {
    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...data, userId }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        return result;
    } catch (error) {
        throw error;
    }
};

export const getUserHistory = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/user/history?userId=${userId}`, {
            headers: getAuthHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
};

export const getUserStats = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/user/stats?userId=${userId}`, {
            headers: getAuthHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null; // Return null to handle graceful fallback
    }
}

export const getModelMetrics = async () => {
    try {
        const response = await fetch(`${API_URL}/model/metrics`);
        const data = await response.json();
        if (!response.ok) throw new Error('Failed to fetch metrics');
        return data;
    } catch (error) {
        throw error;
    }
};
