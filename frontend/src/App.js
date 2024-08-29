import React, { useState } from 'react';
import Auth from './Registration';  // Ensure the filename matches your actual Auth component
import Chat from './chat';  // Ensure the filename matches your actual Chat component
import './App.css'; // You can keep this if you have additional global styles

function App() {
  const [phone, setPhone] = useState('');

  const handleAuth = (phone) => {
    setPhone(phone);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        {phone ? (
          <Chat phone={phone} />
        ) : (
          <Auth onAuth={handleAuth} />
        )}
      </div>
    </div>
  );
}

export default App;
