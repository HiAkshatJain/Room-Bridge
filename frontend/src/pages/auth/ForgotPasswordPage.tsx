import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateOtp = (otp: string) => /^\d{6}$/.test(otp);
  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Za-z]/.test(pwd) || !/\d/.test(pwd)) return 'Password must include letters and numbers';
    return '';
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  setError(null);
  setOtpError(null);
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword(formData.email);
      setStep('otp');
      setOtpDigits(['', '', '', '', '', '']);
      setResendCountdown(30);
      toast.success('OTP sent to your email');
    } catch (err: any) {
      setError(err?.response?.data || err?.message || 'Failed to send reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otpDigits];
    next[idx] = val;
    setOtpDigits(next);
  // clear inline OTP error as user types
  if (otpError) setOtpError(null);
    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      const prev = idx - 1;
      inputsRef.current[prev]?.focus();
    }
  };

  useEffect(() => {
    if (!resendCountdown) return;
    const t = setInterval(() => setResendCountdown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendCountdown]);

  const handleResend = async () => {
    setError(null);
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email first to resend code.');
      return;
    }
    try {
      await forgotPassword(formData.email);
      toast.success('Verification code resent');
      setResendCountdown(30);
    } catch (err: any) {
      setError(err?.response?.data || err?.message || 'Failed to resend code.');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOtpError(null);
    const otp = otpDigits.join('');
    if (!validateOtp(otp)) {
      setOtpError('Please enter a valid 6-digit OTP.');
      return;
    }

  setFormData({ ...formData, otp });
  setStep('reset');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const pwdErr = validatePassword(formData.newPassword);
    if (pwdErr) {
      setError(pwdErr);
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      
      const otpToSend = formData.otp && formData.otp.length ? formData.otp : otpDigits.join('');
      if (!validateOtp(otpToSend)) {
        setError('Please enter a valid 6-digit OTP before resetting password.');
        setIsLoading(false);
        return;
      }

      await resetPassword(formData.email, otpToSend, formData.newPassword);
     
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data || err?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Building className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{step === 'email' ? 'Forgot password?' : step === 'otp' ? 'Verify your email' : 'Reset password'}</h2>
          {step === 'email' && <p className="mt-2 text-gray-600">No worries, we'll help you reset it.</p>}
          {step === 'otp' && (
            <p className="mt-2 text-gray-600">We sent a code to <span className="font-medium text-gray-800">{formData.email}</span></p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Code'}
              </button>

              <div className="mt-4 text-center text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">Sign in</Link>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter the 6-digit verification code</label>
                  <div className="flex justify-center space-x-2">
                    {otpDigits.map((d, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (inputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e as any, idx)}
                        className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Back
                  </button>

                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendCountdown > 0}
                      className="text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50"
                    >
                      {resendCountdown > 0 ? `Resend (${resendCountdown}s)` : 'Resend'}
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {step === 'reset' && (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;