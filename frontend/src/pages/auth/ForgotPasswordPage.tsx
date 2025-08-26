import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Check your email</h2>
            <p className="mt-2 text-gray-600">
              We sent password reset instructions to <br />
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Didn't receive the email? Check your spam folder or{' '}
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  try another email address
                </button>
              </p>
              
              <Link
                to="/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Building className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Forgot password?</h2>
          <p className="mt-2 text-gray-600">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-gray-600 hover:text-blue-600 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;