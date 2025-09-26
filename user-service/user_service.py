# user_service.py

import os
import time
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from bson.objectid import ObjectId

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = Flask(__name__)
CORS(app)

# --- API Endpoints ---
@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    if not username or not email:
        return jsonify({"error": "Username and email are required"}), 400
    if users_collection.find_one({'username': username}):
        return jsonify({"error": "Username already exists"}), 409
        
    result = users_collection.insert_one({'username': username, 'email': email})
    return jsonify({
        'id': str(result.inserted_id),
        'username': username,
        'email': email
    }), 201

@app.route('/users', methods=['GET'])
def get_all_users():
    """Gets all users from the database."""
    users = []
    for user in users_collection.find():
        user['_id'] = str(user['_id'])
        users.append(user)
    return jsonify(users)

@app.route('/users/<user_id>', methods=['GET'])
def get_user_by_id(user_id):
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if user:
            user['_id'] = str(user['_id'])
            return jsonify(user)
        return jsonify({"error": "User not found"}), 404
    except Exception:
        return jsonify({"error": "Invalid user ID format"}), 400

@app.route('/users/username/<username>', methods=['GET'])
def get_user_by_username(username):
    """Finds a user by their username."""
    user = users_collection.find_one({'username': username})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user)
    return jsonify({"error": f"User '{username}' not found"}), 404

# --- Main Execution Block ---
if __name__ == '__main__':
    mongo_url = os.environ.get('MONGO_URL')
    if not mongo_url:
        logging.critical("FATAL ERROR: MONGO_URL environment variable is not set.")
        exit(1)
    
    logging.info(f"Connecting to MongoDB at: {mongo_url.split('@')[-1]}")
    client = None
    for i in range(5):
        try:
            client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
            client.admin.command('ping')
            logging.info("Successfully connected and authenticated to MongoDB!")
            break
        except (ConnectionFailure, OperationFailure) as e:
            logging.error(f"Connection attempt {i+1} failed: {e}")
            if i < 4:
                time.sleep(5)
            else:
                logging.critical("Could not connect to MongoDB after retries. Exiting.")
                exit(1)

    db = client.recipe_db
    users_collection = db.users
    logging.info("Starting Flask application on port 5001...")
    app.run(host='0.0.0.0', port=5001)
