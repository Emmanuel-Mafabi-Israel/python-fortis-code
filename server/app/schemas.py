# GLORY BE TO GOD,
# FORTIS MODEL FILE,
# BY ISRAEL MAFABI EMMANUEL

# MODELS - SCHEMA, SERIALIZATION

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
    sender_email = fields.Method("get_sender_email", dump_only=True)
    recipient_email = fields.Method("get_recipient_email", dump_only=True)
    class Meta:
        model = Transaction
        load_instance = True

    def get_sender_email(self, obj):
        return obj.sender.email if obj.sender else "System"

    def get_recipient_email(self, obj):
        return obj.recipient.email

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