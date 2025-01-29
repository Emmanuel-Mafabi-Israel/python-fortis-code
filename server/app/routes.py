# GLORY BE TO GOD,
# FORTIS ROUTES,
# BY ISRAEL MAFABI EMMANUEL

import os

# print("routes.py file loading") -> for debugging purposes

from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import db, User, Transaction, Notification  # Import models
from app.schemas import UserSchema, TransactionSchema, NotificationSchema
from app.services import notify_user, update_balance
from app.cryptofortis.cryptofortis import fortis_generate_token, fortis_validate_token

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
    data = request.json
    email = data.get('email')
    password = generate_password_hash(data.get('password'))
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400
    try:
        new_user = User(email=email, password_hash=password)
        db.session.add(new_user)
        db.session.commit()
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
    value = data['value']
    recipient_email = data['recipient']
    method = data['method']
    token = fortis_generate_token(sender_email, value, recipient_email, expiry=int(os.getenv('TOKEN_EXPIRY', 14400)))  # default expiry in minutes, from env vars

    if method == 'direct':
        notify_user(recipient_email, sender_email, token, expiry=int(os.getenv('TOKEN_EXPIRY', 14400)))

        return jsonify({"token": token}), 200

    elif method == 'deposit':
        if fortis_validate_token(token):
            update_balance(sender_email, recipient_email, value)
            notify_user(recipient_email, sender_email, token, expiry=int(os.getenv('TOKEN_EXPIRY', 14400)))

            return jsonify({"message": "Token deposited successfully"}), 200

    return jsonify({"error": "Invalid method"}), 400

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
        serialized_user = user_schema.dump(user) # serialize the data
        return jsonify(serialized_user), 200  # then jsonify the response
    return jsonify({'message': 'User not found'}), 404

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