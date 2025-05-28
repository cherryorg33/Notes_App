from flask import Flask, request, jsonify
import mysql.connector
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configurations
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret')  # Use environment variable in production
jwt = JWTManager(app)

# MySQL Database Configuration
db_config = {
    'host': os.environ.get('MYSQL_HOST', 'localhost'),
    'user': os.environ.get('MYSQL_USER', 'root'),
    'password': os.environ.get('MYSQL_PASSWORD', 'root'),
    'database': os.environ.get('MYSQL_DATABASE', 'notesdb')
}

# Helper function to connect to DB
def get_db():
    return mysql.connector.connect(**db_config)

# -----------------------------
# User Registration
# -----------------------------
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = generate_password_hash(data['password'])
    now = datetime.datetime.now()

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO user (user_name, user_email, password, last_update, create_on)
        VALUES (%s, %s, %s, %s, %s)
    """, (data['user_name'], data['user_email'], hashed_password, now, now))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'msg': 'User registered successfully'}), 201

# -----------------------------
# User Login
# -----------------------------
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM user WHERE user_email = %s", (data['user_email'],))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and check_password_hash(user['password'], data['password']):
        token = create_access_token(identity=str(user['user_id'])) 
        return jsonify(access_token=token), 200

    return jsonify({'msg': 'Invalid credentials'}), 401

# -----------------------------
# Get Logged-In User Profile
# -----------------------------
@app.route('/user/me', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id, user_name, user_email, last_update, create_on FROM user WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(user)

# -----------------------------
# Get All Notes (of logged-in user)
# -----------------------------
@app.route('/notes', methods=['GET'])
@jwt_required()
def get_notes():
    user_id = int(get_jwt_identity())
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM notes WHERE user_id = %s", (user_id,))
    notes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(notes)

# -----------------------------
# Create a New Note
# -----------------------------
@app.route('/notes', methods=['POST'])
@jwt_required()
def create_note():
    data = request.json
    user_id = int(get_jwt_identity())
    now = datetime.datetime.now()

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO notes (note_title, note_content, user_id, last_update, created_on)
        VALUES (%s, %s, %s, %s, %s)
    """, (data['note_title'], data['note_content'], user_id, now, now))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'msg': 'Note created'}), 201

# -----------------------------
# Update an Existing Note
# -----------------------------
@app.route('/notes/<int:note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    data = request.json
    user_id = int(get_jwt_identity())
    now = datetime.datetime.now()

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE notes
        SET note_title = %s, note_content = %s, last_update = %s
        WHERE note_id = %s AND user_id = %s
    """, (data['note_title'], data['note_content'], now, note_id, user_id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'msg': 'Note updated'})

# -----------------------------
# Delete a Note
# -----------------------------
@app.route('/notes/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    user_id = int(get_jwt_identity())

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM notes WHERE note_id = %s AND user_id = %s", (note_id, user_id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'msg': 'Note deleted'})

# -----------------------------
# Error Handler (optional)
# -----------------------------
@app.errorhandler(500)
def internal_error(error):
    return jsonify({'msg': 'Internal server error'}), 500

# -----------------------------
# Run the App
# -----------------------------
if __name__ == '__main__':
    app.run(debug=True)
