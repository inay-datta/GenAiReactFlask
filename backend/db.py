from pymongo import MongoClient

# Initialize MongoDB client and database
client = MongoClient('mongodb://localhost:27017/')
db = client['GenAiReactFlask']
students_collection = db['students']
chat_collection = db['chat']

def get_student_data(phone):
    return students_collection.find_one({"phone": phone})

def insert_student(student_data):
    students_collection.insert_one(student_data)

def update_chat(phone, date_str, user_message, ai_response):
    chat_collection.update_one(
        {"phone": phone},
        {"$push": {f"chat.{date_str}": {"Student": user_message, "Bot": ai_response}}},
        upsert=True
    )
