import React, { useState } from 'react';

const LoginModal = ({ isOpen, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate credentials
    if (username === 'test' && password === 'test') {
      onLogin();
    } else {
      setError('Invalid username or password. Please use "test" for both username and password.');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
          <h3 className="text-xl font-bold">
            <strong>Login</strong>
          </h3>
          <hr style={{ borderColor: 'rgba(255,255,255,0.2)', marginTop: '10px' }} />
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">
                <strong>Username :</strong>
              </h4>
              <input
                type="text"
                id="userName"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                autoFocus
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">
                <strong>Password :</strong>
              </h4>
              <input
                type="password"
                id="passwd"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold flex items-center justify-center gap-2"
            >
              <i className="fa fa-sign-in-alt"></i>
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

