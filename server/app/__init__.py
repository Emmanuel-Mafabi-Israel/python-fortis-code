# GLORY BE TO GOD,
# FORTIS INITIALIZATION,
# BY ISRAEL MAFABI EMMANUEL

from flask import Flask, render_template
from flask_cors import CORS  # introducing Cross-Origin-Resource-Sharing 😎

from extensions import db, jwt, migrate


def create_app(db):
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    CORS(app)
    
    # for debugging purposes...
    # print(f"Database Metadata before context:{db.metadata.tables}")
    with app.app_context():
        from . import routes
        app.register_blueprint(routes.auth_bp)
        app.register_blueprint(routes.token_bp)
        # app.add_url_rule('/debug/models', view_func = routes.debug_models) # not using this
        # for debugging purposes
        # print(f"Database Metadata in context:{db.metadata.tables}")

        # custom error handling
        app.register_error_handler(404, page_not_found)
        app.register_error_handler(500, server_error)
        
        return app

# --- ERROR PAGES ---
def page_not_found(e):
    return render_template('404.html'), 404

def server_error(e):
    return render_template('500.html'), 500