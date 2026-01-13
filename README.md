# 🫀 Cardio Risk ML System

A **full-stack machine learning web application** that predicts the risk of cardiovascular disease based on patient health metrics.  
The system combines **custom ML model training**, **Flask backend APIs**, **JWT authentication**, and a **React (Vite) frontend dashboard**, all deployed on **free cloud platforms**.

---

## 🚀 Live Demo

- **Frontend (Vercel):**  
  👉 https://your-frontend-url.vercel.app

- **Backend API (Render):**  
  👉 https://cardio-risk-ml-system.onrender.com

---

## 📌 Features

### 🔐 Authentication
- User registration & login
- JWT-based secure authentication
- Persistent user sessions

### 🧠 Machine Learning
- Custom Decision Tree implementation
- Feature engineering (BMI, pulse pressure, health index)
- Train–Test Split + Stratified K-Fold Cross Validation
- Best model selection based on accuracy
- Model saved and reused for real-time prediction

### 📊 Dashboard
- Individual user prediction history
- Risk score trend visualization
- Latest health stats summary
- Daily health tips

### ⚙️ Backend APIs
- `/api/auth/login`
- `/api/auth/register`
- `/api/predict`
- `/api/user/history`
- `/api/user/stats`

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Fetch API

### Backend
- Python
- Flask
- Flask SQLAlchemy
- JWT Authentication
- SQLite

### Machine Learning
- NumPy
- Pandas
- scikit-learn (CV & data splitting)
- Custom Decision Tree (no sklearn model)

### Deployment
- Frontend: Vercel
- Backend: Render
- Version Control: Git & GitHub

---
