from flask import Flask, request, send_from_directory
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS
from flask_restx import Api, Resource, fields 
import os
from models.model import User, db
from config import Config
from utils.token_util import token_required
import joblib
import numpy as np

app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Authorization parser for protected routes
authorizations = {
    'Bearer Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token"
    },
}

# Single Api instance with all configurations
api = Api(app,
         version='1.0',
         title='Email Spam Detection API',
         description='A simple Email Spam Detection API',
         doc='/docs',
         authorizations=authorizations,
         security='Bearer Auth')

# Define namespaces
auth_ns = api.namespace('auth', description='Authentication operations')
user_ns = api.namespace('user', description='User operations')
admin_ns = api.namespace('admin', description='Admin operations')
spam_ns = api.namespace('spam', description='Spam Detection operations')

# Define models
login_model = api.model('Login', {
    'username': fields.String(required=True, description='Username'),
    'password': fields.String(required=True, description='Password')
})

register_model = api.model('Register', {
    'username': fields.String(required=True, description='Username'),
    'password': fields.String(required=True, description='Password'),
    'role': fields.String(description='User role')
})

prediction_model = api.model('Prediction', {
    'data': fields.List(fields.Float, required=True, description='Input features')
})

app.config.from_object(Config)
jwt = JWTManager(app)

db.init_app(app)

MODEL_PATH = os.path.join(app.config['UPLOAD_FOLDER'], 'model.joblib')

@auth_ns.route('/login')
class Login(Resource):
    @api.doc('login')
    @api.expect(login_model)
    @api.response(200, 'Login successful')
    @api.response(401, 'Authentication failed')
    def post(self):
        """Login and get access token"""
        data = request.get_json()
        user = User.validate_user(data.get('username'), data.get('password'))
        if not user:
            api.abort(401, "Invalid credentials!")
        
        access_token = create_access_token(
            identity=user['username'],
            additional_claims={'role': user['role'], 'sub': user['username']}
        )
        return {
            "access_token": access_token,
            "role": user['role'],
            "username": user['username']
        }

@auth_ns.route('/register')
class Register(Resource):
    @api.doc('register')
    @api.expect(register_model)
    @api.response(201, 'User created successfully')
    @api.response(400, 'Username already exists')
    def post(self):
        """Register a new user"""
        data = request.get_json()
        if User.query.filter_by(username=data['username']).first():
            api.abort(400, "Username already exists")
        
        user = User(username=data['username'], role=data.get('role', 'user'))
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return {"message": "User created successfully"}, 201

@spam_ns.route('/check')
class SpamDetection(Resource):
    @api.doc('predict_spam')
    @api.expect(prediction_model)
    @api.response(200, 'Prediction successful')
    @api.response(404, 'Model not found')
    @api.response(500, 'Prediction error')
    def post(self):
        """Make spam prediction"""
        try:
            if not os.path.exists(MODEL_PATH):
                api.abort(404, "Model not found")

            model = joblib.load(MODEL_PATH)
            data = request.get_json()
            input_data = np.array(data.get('data'))
            prediction = model.predict(input_data)
            
            return {
                "success": True,
                "prediction": prediction.tolist()
            }
        except Exception as e:
            api.abort(500, f"Prediction error: {str(e)}")

@admin_ns.route('/download-model')
class ModelDownload(Resource):
    @api.doc('download_model')
    @api.response(200, 'Model downloaded successfully')
    @api.response(403, 'Unauthorized')
    @api.response(404, 'Model not found')
    @token_required
    def get(self, current_user=None):
        """Download model file"""
        # if current_user['role'] != 'admin':
        #     api.abort(403, "Unauthorized")

        model_filename = 'model.joblib'
        return send_from_directory(app.config['UPLOAD_FOLDER'], model_filename)

@admin_ns.route('/upload-model')
class ModelUpload(Resource):
    @api.doc('upload_model')
    @api.response(200, 'Model uploaded successfully')
    @api.response(400, 'No file provided')
    @api.response(403, 'Unauthorized')
    @token_required
    def post(self, current_user=None):
        """Upload model file"""
        # if current_user['role'] != 'admin':
        #     api.abort(403, "Unauthorized")
            
        if 'file' not in request.files:
            api.abort(400, "No file part")

        file = request.files['file']
        if file.filename == '':
            api.abort(400, "No selected file")

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'model.joblib')
        file.save(file_path)
        return {"message": f"File {file.filename} uploaded successfully!"}

@user_ns.route('/profile/<string:target_username>')
class UserProfile(Resource):
    @api.doc('get_user_profile')
    @api.response(200, 'Profile retrieved successfully')
    @api.response(404, 'User not found')
    @token_required
    def get(self, target_username, current_user=None):
        """Get user profile"""
        user = User.query.filter_by(username=target_username).first()
        if not user:
            api.abort(404, "User not found")
        return user.to_dict()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create default admin if not exists
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', role='admin')
            admin.set_password('admin123')
            admin.email = 'admin@example.com'
            admin.phone = '0123456789'
            admin.full_name = 'Admin User'
            db.session.add(admin)
            db.session.commit()
            print('Default admin created - username: admin, password: admin123')
        
        # Create default regular user if not exists
        if not User.query.filter_by(username='user').first():
            user = User(username='user', role='user')
            user.set_password('user123')
            user.email = 'user@example.com'
            user.phone = '9876543210'
            user.full_name = 'Regular User'
            db.session.add(user)
            db.session.commit()
            print('Default user created - username: user, password: user123')
    
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(host='0.0.0.0', debug=True)
