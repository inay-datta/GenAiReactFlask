from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from db import get_student_data, insert_student, update_chat
from a import build_system_prompt, get_response  # Import functions from a.py

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    phone = data['phone']
    fullName = data['fullName']
    interests = data['interests']

    # Check if student with this phone number already exists
    existing_student = get_student_data(phone)
    if existing_student:
        return jsonify({"message": "This phone number is already registered."}), 400

    student_data = {
        "phone": phone,
        "fullName": fullName,
        "interests": interests
    }

    insert_student(student_data)
    return jsonify({"phone": phone, "message": "Student registered successfully."})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    phone = data['phone']
    fullName = data.get('fullName')  # Optional, for additional verification

    # Verify if the student is registered and optionally check fullName
    student_data = get_student_data(phone)
    if not student_data:
        return jsonify({"message": "Student not registered."}), 404

    if fullName and student_data['fullName'] != fullName:
        return jsonify({"message": "Full name does not match."}), 400

    return jsonify({"message": "Login successful.", "phone": phone})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    phone = data['phone']
    user_message = data['message']

    # Retrieve student data
    student_data = get_student_data(phone)
    if not student_data:
        return jsonify({"reply": "Student not registered."})

    # Define termination keywords
    termination_keywords = ['end', 'bye', 'goodbye']
    if any(keyword in user_message.lower() for keyword in termination_keywords):
        response_message = "Chat ended. You will not be able to send further messages in this session."
        date_str = datetime.now().strftime("%Y-%m-%d")
        # Save the final chat message
        update_chat(phone, date_str, user_message, response_message)
        # Return response indicating chat has ended
        return jsonify({"reply": response_message, "status": "ended"})

    # Process chat if not terminated
    system_prompt = build_system_prompt(student_data)
    ai_response = get_response(user_message, [], system_prompt)

    # Save the conversation to the chat collection
    date_str = datetime.now().strftime("%Y-%m-%d")
    update_chat(phone, date_str, user_message, ai_response)

    return jsonify({"reply": ai_response, "status": "ongoing"})

if __name__ == '__main__':
    app.run(port=5001)
