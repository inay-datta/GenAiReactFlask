import requests
import json
from datetime import datetime
from db import get_student_data, insert_student, update_chat

# Build system prompt for Udemy bot
def build_system_prompt(student_data):
    system_prompt = f"""
    You are a customer support assistant for Udemy, a leading online learning platform. Your role is to help students with questions about their Udemy accounts, including course enrollment, course details, fees, schedules, and more.

    Student's full name: {student_data['fullName']}
    Interests: {', '.join(student_data['interests'])}

    Instructions for assistance:
    - Greet the student by their full name only at the beginning of the chat, not with every response.
    - Provide Udemy-related assistance only. If the student asks about non-Udemy topics, politely redirect them to Udemy-related inquiries.
    - If the student requests information about courses, provide details based on their interests and guide them to find courses on Udemy.
    - If the student asks for information not related to courses or their account, guide them to the appropriate resources on Udemy.
    - If the student's query indicates ending the chat (e.g., saying goodbye), respond with "bye bye!" after asking if they want to end the chat.

    Scenarios:
    1. If a student asks about course enrollment, provide a step-by-step guide on how to enroll in courses.
    2. If asked about personal information, only state the student's name and explain that no other information can be accessed due to privacy policies.
    3. If the student asks for general information about courses, provide details based on their interests or guide them on how to find relevant courses.
    4. If the student repeatedly asks for information on specific interests, provide varied details from the same interest area.
    5. If the student asks about areas not in their interests, guide them on how to search for courses in those areas on Udemy.
    """
    return system_prompt

# Get response from the language model
def get_response(user_input, conversation_history, system_prompt):
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={{API_KEY}}" #API_KEY_Required
    conversation_history.append({"role": "user", "content": user_input})
    payload = json.dumps({
        "contents": [
            {
                "parts": [
                    {
                        "text": f"""{system_prompt}\n\n{' '.join([f"{entry['role']}: {entry['content']}" for entry in conversation_history])}"""
                    }
                ]
            }
        ]
    })
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.post(url, headers=headers, data=payload)

    try:
        response_json = response.json()
        ai_response = response_json['candidates'][0]['content']['parts'][0]['text']
    except (KeyError, IndexError):
        ai_response = "I'm sorry, there seems to be an issue with processing your request. Please try again later."

    conversation_history.append({"role": "assistant", "content": ai_response})

    print(f"\nStudent: {user_input}")
    print(f"Bot: {ai_response}\n")
    return ai_response
