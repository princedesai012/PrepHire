from flask_jwt_extended import JWTManager

# In-memory token blocklist for demonstration purposes. Use a database for production!
TOKEN_BLOCKLIST = set()

# Initialize JWTManager but don't bind it to the app yet
jwt = JWTManager()

def jwt_blocklist(jwt_manager):
    """
    Configures the token blocklist loader for the JWT manager.
    """
    @jwt_manager.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return jti in TOKEN_BLOCKLIST