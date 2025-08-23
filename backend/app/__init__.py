from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config
from .utils.jwt_utils import jwt, jwt_blocklist
from .services import db
from flask_mail import Mail # Import Flask-Mail

mail = Mail() # Initialize the mail extension

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app, supports_credentials=True)
    jwt.init_app(app)
    mail.init_app(app) # Initialize mail with the app
    # Set the token blocklist loader
    jwt_blocklist(jwt)

    # Initialize the database connection
    # db.init_db()

    # Register blueprints
    from .routes.interview import interview_bp
    from .routes.auth import auth_bp
    from .routes.resume import resume_bp
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(resume_bp, url_prefix='/api')
    app.register_blueprint(interview_bp, url_prefix='/api/interview')

    @app.route("/")
    def home():
        return "AI Resume Analyzer Backend is Running"

    return app