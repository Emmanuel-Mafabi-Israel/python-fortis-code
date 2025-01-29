# GLORY BE TO GOD,
# FORTIS MODEL FILE,
# BY ISRAEL MAFABI EMMANUEL

# MODELS

from server import db
# import datetime

# our association table...
user_notifications = db.Table('user_notifications',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('notification_id', db.Integer, db.ForeignKey('notifications.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id            = db.Column(db.Integer, primary_key=True)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    balance       = db.Column(db.Integer, default=0)
    # table relationships
    transactions  = db.relationship('Transaction', backref='owner', lazy=True, foreign_keys='[Transaction.sender_id]')
    notifications = db.relationship('Notification', secondary=user_notifications, backref='users')
    audit_logs    = db.relationship('AuditLog', backref='user', lazy=True)
    activities    = db.relationship('Activity', backref='user', lazy=True)
    profile       = db.relationship('UserProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    roles         = db.relationship('Role', secondary='user_roles', backref='users')
    
    # for debugging...
    def __repr__(self):
        return f"<User id:{self.id}, email:{self.email}>"
    
class Transaction(db.Model):
    __tablename__ = 'transactions'
    id               = db.Column(db.Integer, primary_key=True)
    sender_id        = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipient_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    value            = db.Column(db.Integer, nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)  # e.g., 'deposit', 'withdrawal'
    description      = db.Column(db.String(255), nullable=True) # Description of the transaction
    timestamp        = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Transaction id:{self.id}, type:{self.transaction_type}, time:{self.timestamp}>"

class Notification(db.Model):
    __tablename__ = 'notifications'
    id          = db.Column(db.Integer, primary_key=True)
    message     = db.Column(db.String(255), nullable=False)
    expiry_time = db.Column(db.DateTime, nullable=False)

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    id        = db.Column(db.Integer, primary_key=True)
    user_id   = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action    = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

class UserProfile(db.Model):
    __tablename__ = 'user_profiles'
    id              = db.Column(db.Integer, primary_key=True)
    user_id         = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name            = db.Column(db.String(120), nullable=True)

class Role(db.Model):
    __tablename__ = 'roles'
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    permissions = db.Column(db.JSON, nullable=True)

# user_roles association table
user_roles = db.Table('user_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True)              
)

class Activity(db.Model):
    __tablename__ = 'activities'
    id            = db.Column(db.Integer, primary_key=True)
    user_id       = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    activity_type = db.Column(db.String(255), nullable=False)
    timestamp     = db.Column(db.DateTime, server_default=db.func.now())