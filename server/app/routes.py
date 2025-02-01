# routes.py
import os
# print("routes.py file loading") -> for debugging purposes

from extensions import db

from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User, Transaction, Notification, UserProfile  # Import models
from app.schemas import UserSchema, TransactionSchema, NotificationSchema
from app.cryptofortis.cryptofortis import fortis_generate_token, fortis_validate_token
from app.services import notify_user, update_balance, handle_transaction, record_transaction

from functools import wraps
from datetime import datetime  # Import datetime class
import logging

# --- setting up logging ---
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
# --- setting up logging ---

# print(f"db.metadata in routes.py before schema: {db.metadata}") -> for debugging purposes

auth_bp             = Blueprint('auth', __name__)
token_bp            = Blueprint('token', __name__)
user_schema         = UserSchema()
transaction_schema  = TransactionSchema()
notification_schema = NotificationSchema()

# print(f"db.metadata in routes.py after schema: {db.metadata}")
@auth_bp.route('/register', methods=['POST'])
def register():
    data     = request.json
    email    = data.get('email')
    password = generate_password_hash(data.get('password'))

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400
    try:
        new_user = User(email=email, password_hash=password)
        db.session.add(new_user)
        db.session.commit()
        # for this case, let's create also the user profile
        new_user_profile = UserProfile(user_id=new_user.id)
        db.session.add(new_user_profile)
        db.session.commit()
        # Record the initial deposit
        record_transaction(None, new_user.email, 500, "Initial deposit")
        serialized_user = user_schema.dump(new_user)
        return jsonify(serialized_user), 201

    except Exception as e:
        db.session.rollback()
        print(f"error creating a user: {e}")
        return jsonify({"message": "An error occurred while creating a user"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    # for login
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=email)

        return jsonify(access_token=access_token), 200

    return jsonify({"message": "Invalid credentials"}), 401

#  ---- User Deletion -----
# --- User Retrieval Decorator ---
def get_user_from_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        return func(user, *args, **kwargs)
    return wrapper

# --- End User Retrieval Decorator ---
@auth_bp.route('/user', methods=['DELETE'])
@jwt_required()
@get_user_from_token
def delete_user(user):
    if user.balance != 0:
        return jsonify({'message': 'User balance should be zero before deletion'}), 400
    try:
        # user.deleted_at = datetime.now()  # Soft delete
        db.session.delete(user) # remove the hard deletion
        db.session.commit()
        return jsonify({'message': 'User account deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"error deleting the user {e}")
        return jsonify({'message':'An error occurred while deleting the user'}), 500

@token_bp.route('/send_token', methods=['POST'])
@jwt_required()
def send_token():
    # for token transfer
    data            = request.json
    sender_email    = get_jwt_identity()
    value           = data.get('value')
    recipient_email = data.get('recipient')
    method          = data.get('method')
    expiry          = data.get('expiry', int(os.getenv('TOKEN_EXPIRY', 14400)))

    # prevent weird transactions -self transactions...
    if sender_email == recipient_email:
        return jsonify({"error": "Cannot send tokens to yourself"}), 400

    if not all([value, recipient_email, method, expiry]):
        return jsonify({"error": "Missing required fields"}), 400
    try:
        value = int(value)
    except ValueError:
        return jsonify({'error': 'Invalid transaction value'}), 400
    
    # Generate the token
    token = fortis_generate_token(sender_email, value, recipient_email, expiry=expiry)
    
    if not token:
        return jsonify({"error": "Token generation failed"}), 500
    
    try:
        # Call the handle_transaction to perform the business logic 
        handle_transaction(sender_email, recipient_email, value, method, expiry)
        return jsonify({"message": "Token sent successfully", 'token': token}), 200
    except Exception as e:
        logging.error(f"Error in send token route: {e}")
        if "Insufficient Funds" in str(e):
            return jsonify({"error": "Insufficient funds"}), 400
        return jsonify({'error': f'An error occurred during the transaction: {e}'}), 500
    
@token_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    # for notification
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    notifications = user.notifications

    serialized_notifications = notification_schema.dump(notifications, many=True)
    return jsonify(serialized_notifications), 200

# --- Main Dashboard Route ---
@auth_bp.route('/user', methods=['GET'])
@jwt_required()
@get_user_from_token
def get_user_details(user):  # Using the decorator here
    print(f"User balance (from get_user_details): {user.balance}")  # Debug print
    serialized_user = user_schema.dump(user)
    return jsonify(serialized_user), 200

@auth_bp.route('/user', methods=['PATCH'])
@jwt_required()
@get_user_from_token
def update_user_details(user):  # Using the decorator here
    data = request.json;
    print("Updating user profile with data:", data);
    name = data.get('name')
    profile = user.profile;
    if name:
        profile.name = name
    try:
        db.session.commit();
        serialized_user = user_schema.dump(user);
        return jsonify(serialized_user), 200;
    except Exception as e:
        db.session.rollback();
        print(f"Error updating user profile:{e}");        
        return jsonify({"message": f"An error occurred while updating the user:{str(e)}"}), 500

# --- Transaction History ---
@token_bp.route('/transactions', methods=['GET'])
@jwt_required()
@get_user_from_token
def get_transactions(user):  # Using the decorator here
    transactions = Transaction.query.filter(db.or_(Transaction.sender_id == user.id, Transaction.recipient_id == user.id)).all()
    serialized_transactions = transaction_schema.dump(transactions, many=True)
    return jsonify(serialized_transactions), 200

# --- ROUTES FOR DEBUGGING ---
@auth_bp.route('/', methods=['GET'])
def index():
    return render_template('home.html')

@auth_bp.route('/debug/', methods=['GET'])
def debug():
    return render_template('debug.html')

@auth_bp.route('/debug/models/', methods=['GET'])
def debug_models():
    # a check to see if database exists and create tables
    # db.create_all()
    metadata = db.metadata.tables
    return render_template('models.html', metadata=metadata)

@auth_bp.route('/debug/users/', methods=['GET'])
def debug_users():
    # retrieving all the emails:
    users  = User.query.filter(User.deleted_at == None).all() # filter out deleted users
    emails = [(index + 1, user.email) for index, user in enumerate(users)] 
    return render_template('emails.html', emails=emails)