from flask import Flask, request, jsonify
import random
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
import sys
import jwt
from functools import wraps

# Ensure src module can be found
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}) # Allow all origins for development

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cardio.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'dev-secret-key' # Change for production

db = SQLAlchemy(app)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        
        try:
            # For simplicity with the existing "mock-token-ID", we accept that 
            # Or use real JWT. Let's support both for transition.
            if token.startswith('mock-token-'):
                user_id = token.split('-')[-1]
                current_user = User.query.get(int(user_id))
            else:
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
                current_user = User.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({'error': 'Invalid user token!'}), 401
                
        except Exception as e:
            return jsonify({'error': f'Token is invalid: {str(e)}'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

# --- ROUTES ---
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "online",
        "message": "Heart Attack Prediction API is running",
        "endpoints": [
            "/api/auth/login", 
            "/api/auth/register", 
            "/api/predict", 
            "/api/user/history",
            "/api/user/stats"
        ]
    })

# --- MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False) # In real app, use hashing
    predictions = db.relationship('Prediction', backref='user', lazy=True)

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Inputs (Updated for Cardio Dataset)
    age = db.Column(db.Integer)
    gender = db.Column(db.Integer)
    height = db.Column(db.Integer)
    weight = db.Column(db.Float)
    ap_hi = db.Column(db.Integer)
    ap_lo = db.Column(db.Integer)
    cholesterol = db.Column(db.Integer)
    gluc = db.Column(db.Integer)
    smoke = db.Column(db.Integer)
    alco = db.Column(db.Integer)
    active = db.Column(db.Integer)
    
    # Result
    risk_score = db.Column(db.Float)
    risk_category = db.Column(db.String(20)) # Low, Medium, High

# --- LOAD MODEL ---
import pickle
from src.model import predict as model_predict # Import manual predict function

model = None
try:
    with open('models/cardio_model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

# --- AUTH ROUTES ---
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    new_user = User(
        name=data['fullName'],
        email=data['email'],
        password=data['password'] # Note: Hash this in production!
    )
    db.session.add(new_user)
    db.session.commit()
    
    # Generate a real JWT token for consistency
    token = jwt.encode({
        'user_id': new_user.id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({
        'user': {'id': new_user.id, 'name': new_user.name, 'email': new_user.email},
        'token': token
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    print(f"Login attempt for email: {data.get('email')}")
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        print("User not found")
    elif user.password != data['password']:
        print(f"Password mismatch. Expected: {user.password}, Got: {data['password']}")

    if not user:
        return jsonify({'error': 'User not found. Please Register first.'}), 404
    elif user.password != data['password']:
        return jsonify({'error': 'Invalid password.'}), 401
    
    # Successful login
    # Generate a real JWT token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({
        'user': {'id': user.id, 'name': user.name, 'email': user.email},
        'token': token
    })

# --- MODEL METRICS ROUTES ---
@app.route('/api/model/metrics', methods=['GET'])
def get_model_metrics():
    # Mock data for visualization (would ideally come from src/train.py results)
    return jsonify({
        "accuracy": 0.72,
        "precision": 0.75,
        "recall": 0.67,
        "f1": 0.71,
        "confusionMatrix": [
            {"actual": "Positive", "TP": 120, "FN": 15},
            {"actual": "Negative", "FP": 10, "TN": 155}
        ],
        "trainingHistory": [
            {"epoch": 1, "loss": 0.5, "accuracy": 0.60},
            {"epoch": 2, "loss": 0.4, "accuracy": 0.70},
            {"epoch": 3, "loss": 0.35, "accuracy": 0.75},
        ],
        "featureImportance": [
            {"name": "Systolic BP", "value": 0.35},
            {"name": "Age", "value": 0.25},
            {"name": "Cholesterol", "value": 0.15},
            {"name": "Weight", "value": 0.10},
            {"name": "Glucose", "value": 0.08}
        ]
    })

# --- PREDICTION ROUTES ---
@app.route('/api/predict', methods=['POST'])
def predict_route():
    data = request.json
    user_id = data.get('userId') # Optional for guests
    
    try:
        def safe_int(val, default=0):
            if val is None or val == '':
                return default
            try:
                return int(val)
            except:
                return default

        def safe_float(val, default=0.0):
            if val is None or val == '':
                return default
            try:
                return float(val)
            except:
                return default

        # Order from CardioPreprocessing.csv (excluding index and target):
        # gender, weight, ap_hi, ap_lo, cholesterol, gluc, smoke, alco, active, 
        # age_years, bmi, pulse_pressure, health_index, cholesterol_gluc_interaction, bmi_category

        # Extract base inputs
        age_years = safe_int(data.get('age'))
        gender = safe_int(data.get('gender'), 1)
        height_cm = safe_int(data.get('height'), 160)
        weight_kg = safe_float(data.get('weight'), 70.0)
        ap_hi = safe_int(data.get('ap_hi'), 120)
        ap_lo = safe_int(data.get('ap_lo'), 80)
        cholesterol = safe_int(data.get('cholesterol'), 1)
        gluc = safe_int(data.get('gluc'), 1)
        smoke = safe_int(data.get('smoke'), 0)
        alco = safe_int(data.get('alco'), 0)
        active = safe_int(data.get('active'), 1)

        # Calculate Derived Features
        # BMI
        height_m = height_cm / 100
        bmi = weight_kg / (height_m ** 2) if height_m > 0 else 0
        
        # Pulse Pressure
        pulse_pressure = ap_hi - ap_lo
        
        # Health Index (Average of binary lifestyle factors)
        # smoke (1=bad, 0=good), alco (1=bad, 0=good), active (0=bad, 1=good)
        # Note: Dataset labels might vary, but train.py logic suggests lifestyle flags.
        # Simple health index used in preprocessing: active - smoke - alco
        health_index = float(active - smoke - alco)
        
        # Interaction
        chol_gluc_int = cholesterol * gluc
        
        # BMI Category (approximate mapping)
        if bmi < 18.5: bmi_cat = 0
        elif bmi < 25: bmi_cat = 1
        elif bmi < 30: bmi_cat = 2
        else: bmi_cat = 3

        # Construct final feature vector in EXACT order
        features = [
            gender, 
            weight_kg, 
            ap_hi, 
            ap_lo, 
            cholesterol, 
            gluc, 
            smoke, 
            alco, 
            active, 
            age_years, 
            bmi, 
            pulse_pressure, 
            health_index, 
            chol_gluc_int, 
            bmi_cat
        ]
        
        print(f"Prediction requested. Input features: {features}")
        
        # Make prediction using the loaded model
        # Now returns a probability (0.0 to 1.0)
        risk_score = model_predict(model, features)
        
        # Refined categorization
        if risk_score >= 0.5:
            category = 'High'
        elif risk_score >= 0.25:
            category = 'Medium'
        else:
            category = 'Low'
        
        # Save to DB if user is logged in
        if user_id:
            prediction = Prediction(
                user_id=user_id,
                age=age_years,
                gender=gender,
                height=height_cm,
                weight=weight_kg,
                ap_hi=ap_hi,
                ap_lo=ap_lo,
                cholesterol=cholesterol,
                gluc=gluc,
                smoke=smoke,
                alco=alco,
                active=active,
                risk_score=round(float(risk_score) * 100, 1),
                risk_category=category
            )
            db.session.add(prediction)
            db.session.commit()
        
        # Calculate key factors for UI (top 3 highest impacting variables)
        impact_factors = []
        if ap_hi > 140: impact_factors.append("High Systolic BP")
        if cholesterol > 1: impact_factors.append("Elevated Cholesterol")
        if smoke == 1: impact_factors.append("Smoking")
        if age_years > 55: impact_factors.append("Age Factor")
        
        if not impact_factors: impact_factors = ["General Health Markers"]

        return jsonify({
            'riskScore': f"{risk_score * 100:.1f}",
            'riskCategory': category,
            'probability': risk_score,
            'factors': impact_factors[:3]
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/history', methods=['GET'])
@token_required
def get_history(current_user):
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({'error': 'User ID required'}), 400
        
    predictions = Prediction.query.filter_by(user_id=current_user.id).order_by(Prediction.date.desc()).all()
    
    result = []
    for p in predictions:
        result.append({
            'id': p.id,
            'date': p.date.strftime('%Y-%m-%d'),
            'type': 'Prediction',
            'result': f"{p.risk_category} Risk",
            'score': p.risk_score
        })
        
    return jsonify(result)

@app.route('/api/user/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({'error': 'User ID required'}), 400
    
    predictions = Prediction.query.filter_by(user_id=current_user.id).order_by(Prediction.date.desc()).all()
    
    if not predictions:
        return jsonify({
            'lastRisk': 'N/A',
            'lastHr': 'N/A',
            'totalPredictions': 0,
            'riskHistory': [],
            'dailyTip': "Walking for just 30 minutes a day can reduce your risk of heart disease by 30%."
        })
        
    last_pred = predictions[0]
    
    # Calculate monthly averages for chart (simplified)
    chart_data = [{'date': p.date.strftime('%b %d'), 'score': p.risk_score} for p in predictions[:6]][::-1]

    return jsonify({
        'lastRisk': f"{last_pred.risk_score}%",
        'lastSystolic': f"{last_pred.ap_hi} mmHg",
        'lastDiastolic': f"{last_pred.ap_lo} mmHg",
        'totalPredictions': len(predictions),
        'riskHistory': chart_data,
        'dailyTip': random.choice([
            "Walking for just 30 minutes a day can reduce your risk of heart disease by 30%.",
            "Replacing saturated fats with unsaturated fats can lower your cholesterol.",
            "Chronic stress releases cortisol, which can raise blood pressure.",
            "Sleep deprivation (<6 hours) increases the risk of heart attack by 20%.",
            "Quitting smoking reduces your heart disease risk by 50% within one year.",
            "Yoga and meditation can significantly lower systolic blood pressure."
        ])
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
