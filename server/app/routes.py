# GLORY BE TO GOD,
# FORTIS ROUTES,
# BY ISRAEL MAFABI EMMANUEL

import os
# print("routes.py file loading") -> for debugging purposes

from extensions import db

from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User, Transaction, Notification, UserProfile  # Import models
from app.schemas import UserSchema, TransactionSchema, NotificationSchema
from app.services import notify_user, update_balance
from app.cryptofortis.cryptofortis import fortis_generate_token, fortis_validate_token
from app.services import update_balance, record_transaction

# print(f"db.metadata in routes.py before schema: {db.metadata}") -> for debugging purposes

auth_bp             = Blueprint('auth', __name__)
token_bp            = Blueprint('token', __name__)
user_schema         = UserSchema()
transaction_schema  = TransactionSchema()
notification_schema = NotificationSchema()

# print(f"db.metadata in routes.py after schema: {db.metadata}")

@auth_bp.route('/register', methods=['POST'])
def register():
    # for registration
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

        update_balance(None, new_user.email, 500) # depositing 500 tokens...

        # print("UserProfile created:", new_user_profile) -> for debugging purposes...

        serialized_user = user_schema.dump(new_user)  # Serialize first
        return jsonify(serialized_user), 201  # Then jsonify 😉

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
@auth_bp.route('/user', methods=['DELETE'])
@jwt_required()
def delete_user():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if user:
        try:
            #  the user profile deletion will be handled by the cascade in the model
            db.session.delete(user)
            db.session.commit()
            return jsonify({'message': 'User account deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            print(f"error deleting the user {e}")
            return jsonify({'message':'An error occurred while deleting the user'}), 500
    return jsonify({'message': 'User not found'}), 404

@token_bp.route('/send_token', methods=['POST'])
@jwt_required()
def send_token():
    # for token transfer
    data = request.json
    sender_email = get_jwt_identity()
    value = data.get('value')
    recipient_email = data.get('recipient')
    method = data.get('method')
    expiry = data.get('expiry', int(os.getenv('TOKEN_EXPIRY', 14400)))

    if not all([value, recipient_email, method, expiry]):
        return jsonify({"error": "Missing required fields"}), 400
    try:
        value = int(value)
    except ValueError:
        return jsonify({'error': 'Invalid transaction value'}), 400

    # Generate the token
    token = fortis_generate_token(sender_email, value, recipient_email, expiry=expiry)

    if not fortis_validate_token(token):
        return jsonify({"error": "Invalid token"}), 400
    
    # Use a method to handle update balance and record transaction as well as notification to be more modular
    return _handle_transaction(sender_email, recipient_email, value, method, expiry)

def _handle_transaction(sender_email, recipient_email, value, method, expiry):
    description = 'Initial deposit' if sender_email is None else 'Deposit' if method == 'deposit' else 'Token transfer'
    try:
        # update user balances
        update_balance(sender_email, recipient_email, value)
        # Record transaction
        record_transaction(sender_email, recipient_email, value, description)
        # Add user notification
        # expiry is coming from send_token
        notify_user(recipient_email, sender_email, value, expiry, method)

        return jsonify({"message": "Token sent successfully"}), 200
    except Exception as e:
        print(f"Error in _handle_transaction: {e}")
        if "Insufficient Funds" in str(e):
            return jsonify({"error": "Insufficient funds"}), 400
        return jsonify({'error': f'An error occured during the transaction: {e}'}), 500

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
def get_user_details():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if user:
        print(f"User balance (from get_user_details): {user.balance}")  # Debug print
        serialized_user = user_schema.dump(user)
        return jsonify(serialized_user), 200
    return jsonify({'message': 'User not found'}), 404

@auth_bp.route('/user', methods=['PATCH'])
@jwt_required()
def update_user_details():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

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
def get_transactions():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if user:
        transactions = Transaction.query.filter(db.or_(Transaction.sender_id == user.id, Transaction.recipient_id == user.id)).all()
        serialized_transactions = transaction_schema.dump(transactions, many=True)
        return jsonify(serialized_transactions), 200
    return jsonify({'message': 'User not found'}), 404

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
    users  = User.query.all()
    emails = [(index + 1, user.email) for index, user in enumerate(users)] 
    return render_template('emails.html', emails=emails)