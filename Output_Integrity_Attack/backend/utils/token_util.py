from flask_jwt_extended import JWTManager, get_jwt_identity, verify_jwt_in_request, get_jwt
from functools import wraps


jwt = JWTManager()

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request()
            claims = get_jwt()  # Get all claims from token
            username = get_jwt_identity()
            
            current_user = {
                'username': username,
                'role': claims.get('role', 'admin'),
                'sub': claims.get('sub', username)
            }
            
            # Pass current_user as a keyword argument
            kwargs['current_user'] = current_user
            return f(*args, **kwargs)
            
        except Exception as e:
            return {"message": f"Token is invalid: {str(e)}"}, 403

    return decorated_function
