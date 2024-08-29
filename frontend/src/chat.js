import React, { useState } from 'react';
import axios from 'axios';

const Chat = ({ phone }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatEnded, setChatEnded] = useState(false);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post('http://localhost:5000/chat', {
        phone,
        message
      });

      const { reply, status } = response.data;

      setChatHistory([...chatHistory, { user: message, bot: reply }]);
      setMessage('');

      if (status === 'ended') {
        setChatEnded(true);
      }
    } catch (error) {
      console.error('Chat failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Chat</h2>
        {chatEnded ? (
          <div className="text-center text-red-500">Your chat has ended. You cannot send further messages.</div>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-col space-y-4 mb-4 overflow-y-auto h-64 border border-gray-300 p-4 rounded-lg bg-gray-50">
              {chatHistory.map((chat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-gray-700"><strong>User:</strong> {chat.user}</div>
                  <div className="text-gray-600"><strong>Bot:</strong> {chat.bot}</div>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-l-lg"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
