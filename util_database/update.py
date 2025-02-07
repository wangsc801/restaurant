import json
from sys import argv
import datetime
from pymongo import MongoClient
from pathlib import Path

def update_collection(db_info_path, collection_file):
    # Read database connection info
    with open(db_info_path, "r", encoding="utf-8") as file:
        db_info = json.load(file)
    
    # Connect to MongoDB
    client = MongoClient(db_info["connection_uri"])
    db = client[db_info["db_name"]]
    
    try:
        # Get collection name from file path
        collection_file_path = Path(collection_file)
        collection_name = collection_file_path.stem
        collection = db[collection_name]

        # Load local data and database data
        with open(collection_file, "r", encoding="utf-8") as file:
            local_data = json.load(file)
        db_data = list(collection.find({}, {"_id": 0}))

        # Convert to sets for faster comparison
        local_set = {json.dumps(doc, sort_keys=True) for doc in local_data}
        db_set = {json.dumps(doc, sort_keys=True) for doc in db_data}

        # Find differences
        docs_to_add = [json.loads(doc) for doc in local_set - db_set]
        extra_docs = [json.loads(doc) for doc in db_set - local_set]

        # Handle new documents
        if docs_to_add:
            print("\nNew documents to add to database:")
            for doc in docs_to_add:
                print(json.dumps(doc, indent=2))
            
            if input("\nAdd these documents? (y/N): ").lower() == 'y':
                current_time = datetime.datetime.now(datetime.timezone.utc)
                for doc in docs_to_add:
                    doc.update({
                        "created_at": current_time,
                        "updated_at": current_time
                    })
                collection.insert_many(docs_to_add)
                print(f"Added {len(docs_to_add)} documents")

        # Handle extra documents
        if extra_docs:
            print("\nDocuments in database but not in local file:")
            for doc in extra_docs:
                print(json.dumps(doc, indent=2))
            
            if input("\nAdd to local file? (y/N): ").lower() == 'y':
                current_time = datetime.datetime.now(datetime.timezone.utc)
                all_docs = local_data + extra_docs
                for doc in all_docs:
                    doc["updated_at"] = current_time
                
                with open(collection_file, "w", encoding="utf-8") as file:
                    json.dump(all_docs, file, indent=4)
                print(f"Updated local file with {len(extra_docs)} documents")

        if not docs_to_add and not extra_docs:
            print("No differences found")

    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        client.close()
def main():
    if len(argv) != 3 or argv[1] in ['-h', '--help']:
        print('''
        Usage: python update.py <db_info.json> <collection_name.json>
        Example: python update.py db_info.json ./data/menu_items.json
        ''')
        return

    update_collection(argv[1], argv[2])

if __name__ == "__main__":
    main()