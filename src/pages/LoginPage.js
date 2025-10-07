import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../features/api/apiSlice';

const LoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      // Assuming the login mutation returns user data upon success
      // You might want to store a token or user info in localStorage/sessionStorage
      // For now, we'll just navigate to the home page
      navigate('/');
    }
  }, [isSuccess, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ identifier: emailOrPhone, password }).unwrap();

      // Save all user data (including password) to localStorage
      localStorage.setItem('user', JSON.stringify(result));

      console.log('Login successful:', result);
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-app-primary-700 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="emailOrPhone" className="block text-gray-700 text-sm font-bold mb-2">
              Email or Phone Number:
            </label>
            <input
              type="text"
              id="emailOrPhone"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-app-primary-500"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-app-primary-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isError && <p className="text-red-500 text-xs italic mb-4">Login failed: {error?.data?.message || 'An unknown error occurred'}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-app-primary-600 hover:bg-app-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
