# GLORY BE TO GOD,
# FORTISCODE MODELS SCHEMA,
# BY ISRAEL MAFABI EMMANUEL

from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models import User, Transaction, Notification, AuditLog, UserProfile, Role, Activity

class UserSchema(SQLAlchemyAutoSchema):
    profile = fields.Nested('UserProfileSchema')
    class Meta:
        model = User
        load_instance = True
        include_relationships = True

class TransactionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Transaction
        load_instance = True

class NotificationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Notification
        load_instance = True

class AuditLogSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = AuditLog
        load_instance = True

class UserProfileSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = UserProfile
        load_instance = True

class RoleSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Role
        load_instance = True

class ActivitySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Activity
        load_instance = True