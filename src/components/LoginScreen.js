import React, { useState } from 'react';

const LoginScreen = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email, password);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        {/* Logo and heading */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌸</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">YouMatter</h1>
          <p className="text-gray-600">Your mental health companion</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-600 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-500">Email: demo@youmatter.com</p>
          <p className="text-xs text-blue-500">Password: demo123</p>
        </div>

        {/* Switch to signup */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-purple-500 font-semibold hover:text-purple-600 transition duration-200"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;