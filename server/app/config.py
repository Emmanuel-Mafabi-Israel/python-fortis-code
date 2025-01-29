# GLORY BE TO GOD,
# FORTIS CONFIGURATION,
# BY ISRAEL MAFABI EMMANUEL

import os
from dotenv import load_dotenv

load_dotenv() # load the environment variables from .env
class Config:
    SECRET_KEY                     = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI        = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', False)
    JWT_SECRET_KEY                 = os.getenv('JWT_SECRET_KEY')