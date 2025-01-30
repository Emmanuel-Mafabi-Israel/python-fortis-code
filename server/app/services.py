# GLORY BE TO GOD,
# FORTIS SERVICES,
# BY ISRAEL MAFABI EMMANUEL

# services.py
import os
from datetime import datetime, timezone, timedelta
from app.models import db, User, Notification, Transaction

def notify_user(recipient, sender, value, expiry, method):
    expiry_time = datetime.now(timezone.utc) + timedelta(minutes=expiry)
    if method == 'deposit':
        message = f"You've received a deposit of {value} tokens."
    else:
        message = f"You've received a token from {sender}. You have {expiry} minutes to redeem or use the token."
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
    sender_id    = User.query.filter_by(email=sender_email).first().id if sender_email else None
    recipient_id = User.query.filter_by(email=recipient_email).first().id
    transaction_type = "deposit" if "deposit" in description.lower() else "transfer" # Derive from the description.

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