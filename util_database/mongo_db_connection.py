from pymongo import MongoClient
import json

def connection(db_info_path):
    with open(db_info_path, "r", encoding="utf-8") as file:
            db_info = json.load(file)
        
    # Connect to MongoDB
    client = MongoClient(db_info["connection_uri"])
    return client[db_info["db_name"]]
    