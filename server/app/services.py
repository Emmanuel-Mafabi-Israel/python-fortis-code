# GLORY BE TO GOD,
# FORTIS SERVICES,
# BY ISRAEL MAFABI EMMANUEL

# services.py
import os

from extensions import db

from datetime import datetime, timezone, timedelta
from app.models import User, Notification, Transaction
# from sqlalchemy import exc

def notify_user(recipient, sender, value, expiry, method):
    expiry_time = datetime.now(timezone.utc) + timedelta(minutes=expiry)
    if method == 'deposit':
        message = f"You have received a deposit of {value} tokens, from {sender}."
    else:
        message = f"You have received a token from {sender}. You have {expiry} minutes to redeem or use the token."
    try:
        notification = Notification(message=message, expiry_time=expiry_time)
        recipient_user = User.query.filter_by(email=recipient).first()
        recipient_user.notifications.append(notification)
        db.session.add(notification)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error adding notification:{e}")

def update_balance(sender_email, recipient_email, value):
    sender    = User.query.filter_by(email=sender_email).first() if sender_email else None
    recipient = User.query.filter_by(email=recipient_email).first()
    
    if not recipient:
        raise Exception("Recipient not found")

    try:
        # Convert value to integer before the try block
        int_value = int(value)

        print(f"update_balance: sender={sender_email}, recipient={recipient_email}, value={int_value}")  # Debug print

        if sender:
            print(f"update_balance: sender balance (before): {sender.balance}")  # Debug print
            if sender.balance < int_value:
                raise Exception("Insufficient Funds")
            sender.balance -= int_value

        print(f"update_balance: recipient balance (before): {recipient.balance}")  # Debug print
        recipient.balance += int_value

        db.session.commit()
        print(f"update_balance: sender balance (after): {sender.balance if sender else 'N/A'}")  # Debug print
        print(f"update_balance: recipient balance (after): {recipient.balance}")  # Debug print

    except ValueError:
        db.session.rollback()
        raise Exception(f"Invalid value for transaction: {value}")
    except Exception as e:
        db.session.rollback()
        raise e

def record_transaction(sender_email, recipient_email, value, description=None):
    sender = User.query.filter_by(email=sender_email).first() if sender_email else None
    recipient = User.query.filter_by(email=recipient_email).first()
    sender_id = sender.id if sender else None
    recipient_id = recipient.id if recipient else None
    transaction_type = "Direct Deposit" if "deposit" in description.lower() else "Token Share" # Derive from the description.
    
    try:
        int_value = int(value)  # Ensure the value is an integer
        transaction = Transaction(
            sender_id=sender_id,
            recipient_id=recipient_id,
            value=int_value,
            transaction_type=transaction_type,
            description=description
        )
        db.session.add(transaction)
        db.session.commit()
    
    except Exception as e:
        db.session.rollback()
        print(f"Error recording transaction: {e}")
        raise e 
    
# Transaction handler!!!
def handle_transaction(sender_email, recipient_email, value, method, expiry):
    description = 'Initial deposit' if sender_email is None else 'Deposit' if method == 'deposit' else 'Token transfer'
    try:
        if sender_email is None:
            recipient = User.query.filter_by(email=recipient_email).first()
            if recipient:
                update_balance(sender_email, recipient_email, value)
                record_transaction(None, recipient_email, value, description) # set sender_email to NULL in the transaction
                notify_user(recipient_email, None, value, expiry, method) # set sender to null when notifying the user
            else:
                raise Exception(f'Error recipient not found {recipient_email}')
        else:
            update_balance(sender_email, recipient_email, value)
            record_transaction(sender_email, recipient_email, value, description)
            notify_user(recipient_email, sender_email, value, expiry, method)
    except Exception as e:
        print(f"Error in handle_transaction: {e}")
        raise e