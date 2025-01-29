# GLORY BE TO GOD,
# FORTIS SEED FILE,
# BY ISRAEL MAFABI EMMANUEL
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server import app, db  # Importing the app and db from server.py
from app.models import User, Transaction, Notification, AuditLog, UserProfile, Role, Activity
from werkzeug.security import generate_password_hash
from datetime import datetime, timezone

def seed_database():
    with app.app_context():  # Use the app context from server.py

        # --- First, delete all current records in the tables we will seed ---
        db.session.query(Transaction).delete()
        db.session.query(Notification).delete()
        db.session.query(AuditLog).delete()
        db.session.query(UserProfile).delete()
        db.session.query(Role).delete()
        db.session.query(Activity).delete()
        db.session.query(User).delete()
        db.session.commit()

        # --- Users ----
        user1 = User(email='emmanuel@fortis.com', password_hash=generate_password_hash('password123'), balance=10000)
        user2 = User(email='wendy@fortis.com', password_hash=generate_password_hash('securepass'), balance=5000)
        user3 = User(email='test@fortis.com', password_hash=generate_password_hash('anotherpass'), balance=100)
        db.session.add_all([user1, user2, user3])
        db.session.commit()

        # -- Transaction ---
        transaction1 = Transaction(sender_id=user1.id, recipient_id=user2.id, value=100, transaction_type='transfer', timestamp=datetime.now(timezone.utc))
        transaction2 = Transaction(sender_id=user2.id, recipient_id=user3.id, value=50, transaction_type='deposit', timestamp=datetime.now(timezone.utc))
        db.session.add_all([transaction1, transaction2])
        db.session.commit()

        # --- Notifications ---
        notification1 = Notification(message='You received a transaction', expiry_time=datetime.now(timezone.utc))
        notification2 = Notification(message='Account update', expiry_time=datetime.now(timezone.utc))
        
        user1.notifications.append(notification1)
        user2.notifications.append(notification2)
        
        db.session.add_all([notification1, notification2])

        db.session.commit()

        # --- AuditLogs ----
        auditlog1 = AuditLog(user_id=user1.id, action='User Registered', timestamp=datetime.now(timezone.utc))
        auditlog2 = AuditLog(user_id=user2.id, action='User Logged In', timestamp=datetime.now(timezone.utc))
        db.session.add_all([auditlog1, auditlog2])
        db.session.commit()

        # --- UserProfiles -----
        profile1 = UserProfile(user_id=user1.id, name='Emmanuel Mafabi', profile_picture='emmanuel.jpg')
        profile2 = UserProfile(user_id=user2.id, name='Wendy Mafabi', profile_picture='wendy.jpg')
        db.session.add_all([profile1, profile2])
        db.session.commit()

        # ---- Roles -------
        role1 = Role(name='admin', description='Administrator role')
        role2 = Role(name='user', description='Standard user role')
        db.session.add_all([role1, role2])
        db.session.commit()

        # associating a role with a given user by appending
        user1.roles.append(role1)
        user2.roles.append(role2)
        user3.roles.append(role2)
        db.session.commit()

        # ---- Activities -----
        activity1 = Activity(user_id = user1.id, activity_type = 'Login', timestamp = datetime.now(timezone.utc))
        activity2 = Activity(user_id = user2.id, activity_type = 'LogOut', timestamp = datetime.now(timezone.utc))
        db.session.add_all([activity1, activity2])
        db.session.commit()
        
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()