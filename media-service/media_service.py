# media_service.py

import os
import time
import logging
import requests
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from pymongo.errors import ConnectionFailure, OperationFailure
from bson.objectid import ObjectId

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = Flask(__name__)
CORS(app)

# User service is still available at the same address
USER_SERVICE_URL = "http://user-service:5001"

# --- API Endpoints ---
@app.route('/media', methods=['POST'])
def create_media_item():
    data = request.json
    title = data.get('title')
    media_type = data.get('type')
    status = data.get('status')
    rating = data.get('rating')
    review = data.get('review')
    author_id = data.get('author_id')

    if not title or not media_type or not status or not author_id:
        return jsonify({"error": "Title, type, status, and author_id are required"}), 400

    author_username = 'Unknown'
    try:
        user_response = requests.get(f"{USER_SERVICE_URL}/users/{author_id}")
        if user_response.status_code == 200:
            author_username = user_response.json().get('username', 'Unknown')
    except requests.exceptions.ConnectionError:
        logging.warning(f"Could not connect to user service to get username for author {author_id}")

    media_data = {
        'title': title,
        'type': media_type,
        'status': status,
        'rating': rating,
        'review': review,
        'author_id': author_id,
        'author_username': author_username
    }
    
    # Insert the data into the database
    result = media_collection.insert_one(media_data)

    # **FIX:** Manually construct the response to avoid ObjectId serialization errors.
    # The insert_one operation can mutate the original dictionary.
    response_data = {
        '_id': str(result.inserted_id),
        'title': title,
        'type': media_type,
        'status': status,
        'rating': rating,
        'review': review,
        'author_id': author_id,
        'author_username': author_username
    }
    
    return jsonify(response_data), 201


@app.route('/media', methods=['GET'])
def get_all_media_items():
    """
    Gets all media items. If an author_id is provided in the query string,
    it filters by that author.
    """
    query = {}
    author_id = request.args.get('author_id')
    if author_id:
        query['author_id'] = author_id

    items = []
    for item in media_collection.find(query).sort('_id', -1): # Sort by newest first
        item['_id'] = str(item['_id'])
        items.append(item)
    return jsonify(items)

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
                
    db = client.media_db # Use a new database name
    media_collection = db.media # Use a new collection name
    logging.info("Starting Flask application on port 5000...")
    app.run(host='0.0.0.0', port=5000)

