# GLORY BE TO GOD,
# FORTIS STARTING POINT,
# BY ISRAEL MAFABI EMMANUEL

import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Adjust the sys.path to include the server directory
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)