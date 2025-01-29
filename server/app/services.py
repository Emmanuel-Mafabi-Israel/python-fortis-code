# GLORY BE TO GOD,
# FORTIS SERVICES,
# BY ISRAEL MAFABI EMMANUEL

import os
from datetime import datetime, timezone, timedelta
from app.models import db, User, Notification

def notify_user(recipient, sender, token, expiry):
    expiry_time = (datetime.now(timezone.utc) + timedelta(minutes=expiry)).isoformat()
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
    sender = User.query.filter_by(email=sender_email).first()
    recipient = User.query.filter_by(email=recipient_email).first()
    if sender and recipient:
        try:
           sender.balance -= int(value)
           recipient.balance += int(value)
           db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"error updating balance: {e}")