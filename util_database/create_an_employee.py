import argparse
import bcrypt
from pymongo import MongoClient
from datetime import datetime
import json
from sys import argv

def create_employee(db_info_path, branch_code, name, password):
    # Read database connection info
    with open(db_info_path, "r", encoding="utf-8") as file:
        db_info = json.load(file)
    
    # Connect to MongoDB
    client = MongoClient(db_info["connection_uri"])
    db = client[db_info["db_name"]]
    
    try:
        # Find branch
        branch = db.branches.find_one({"code": branch_code})
        if not branch:
            print(f"Error: Branch with code {branch_code} not found")
            return
        
        # Hash password
        password_bytes = password.encode('utf-8')
        hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        
        # Create employee document
        current_time = datetime.utcnow()
        employee = {
            "branch_id": str(branch["_id"]),
            "name": name,
            "password": hashed.decode('utf-8'),
            "created_at": current_time,
            "updated_at": current_time
        }

        # Insert into database
        result = db.employees.insert_one(employee)
        print(f"Successfully created employee with ID: {result.inserted_id}")
        
    except Exception as e:
        print(f"Error creating employee: {str(e)}")
    finally:
        client.close()

def main():
    example = '''
    Example:
        python create_an_employee.py --db-info-json=db_info.json --branch-code=A001 --name=Alice --password=123456
    '''
    
    parser = argparse.ArgumentParser(
        description='Create new employee',
        epilog=example,
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument('--db-info-json', required=True, help='MongoDB info file')
    parser.add_argument('--branch-code', required=True, help='Branch code')
    parser.add_argument('--name', required=True, help='Employee name')
    parser.add_argument('--password', required=True, help='Employee password')

    # If the arguments are insufficient, print help and exit
    if len(argv) < 2:
        parser.print_help()
        return

    args = parser.parse_args()
    create_employee(args.db_info_json, args.branch_code, args.name, args.password)

if __name__ == "__main__":
    main()
