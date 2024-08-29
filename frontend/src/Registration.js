import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onAuth }) => {
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [interests, setInterests] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistering, setIsRegistering] = useState(true); // Toggle between registration and login

  const handleAuth = async () => {
    try {
      setError(''); // Clear previous errors
      setSuccess(''); // Clear previous success message

      const url = isRegistering ? 'http://localhost:5000/register' : 'http://localhost:5000/login';
      const data = isRegistering
        ? {
            phone,
            fullName,
            interests: interests.split(',').map(i => i.trim())
          }
        : { phone, fullName };

      const response = await axios.post(url, data);

      // Handle successful registration or login
      onAuth(response.data.phone);
      setSuccess(response.data.message || 'Login successful.');
    } catch (error) {
      // Handle error from server
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 404) {
          setError(error.response.data.message);
        } else {
          setError('Operation failed. Please try again.');
        }
      } else {
        setError('Operation failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{isRegistering ? 'Register' : 'Login'}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Interests (comma-separated)"
              value={interests}
              onChange={e => setInterests(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
          </>
        )}
        {!isRegistering && (
          <input
            type="text"
            placeholder="Full name (optional)"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
          />
        )}
        <button
          onClick={handleAuth}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded hover:bg-gray-300"
        >
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
