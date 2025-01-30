# GLORY BE TO GOD,
# FORTIS STARTING POINT,
# BY ISRAEL MAFABI EMMANUEL

# import os
# import sys
from dotenv import load_dotenv

load_dotenv()

# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import create_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata) # database initialization

app = create_app(db)

if __name__ == "__main__":
    app.run(debug=True)