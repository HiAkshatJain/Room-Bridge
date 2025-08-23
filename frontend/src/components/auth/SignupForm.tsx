import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/common/Spinner';

type FieldErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
};

type Touched = {
  username?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  otp?: boolean;
};

export const SignupForm: React.FC = () => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Touched>({});
  const { signup, verifyOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Validation helpers
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Example password policy: min 8 chars, at least 1 number and 1 letter
  const passwordPolicy = (pwd: string) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Za-z]/.test(pwd) || !/\d/.test(pwd)) return 'Password must include letters and numbers';
    return '';
  };

  const validateField = (name: keyof typeof formData, value: string, all = formData): string => {
    switch (name) {
      case 'username': {
        if (!value.trim()) return 'Username is required';
        if (value.trim().length < 3) return 'Username must be at least 3 characters';
        return '';
      }
      case 'email': {
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Enter a valid email address';
        return '';
      }
      case 'password': {
        if (!value) return 'Password is required';
        const msg = passwordPolicy(value);
        return msg || '';
      }
      case 'confirmPassword': {
        if (!value) return 'Please confirm your password';
        if (value !== all.password) return 'Passwords do not match';
        return '';
      }
      default:
        return '';
    }
  };

  const runFormValidation = (data = formData): FieldErrors => {
    const errors: FieldErrors = {};
    (Object.keys(data) as (keyof typeof formData)[]).forEach((key) => {
      const msg = validateField(key, data[key], data);
      if (msg) errors[key] = msg;
    });
    return errors;
  };

  const validateOtp = (code: string): string => {
    if (!code) return 'OTP is required';
    if (!/^\d{6}$/.test(code)) return 'OTP must be a 6-digit number';
    return '';
  };

  // Derived validity for disabling button
  const isFormValid = useMemo(() => {
    const errs = runFormValidation();
    return Object.keys(errs).length === 0;
  }, [formData]);

  const isOtpValid = useMemo(() => validateOtp(otp) === '', [otp]);

  // Handlers
  const handleBlur = (name: keyof typeof formData) => {
    setTouched((t) => ({ ...t, [name]: true }));
    const msg = validateField(name, formData[name]);
    setFieldErrors((fe) => ({ ...fe, [name]: msg || undefined }));
  };

  const handleChange = (name: keyof typeof formData, value: string) => {
    const next = { ...formData, [name]: value };
    setFormData(next);

    // Live-validate the changed field, and also confirmPassword if password changed
    const mainMsg = validateField(name, value, next);
    setFieldErrors((fe) => ({ ...fe, [name]: mainMsg || undefined }));

    if (name === 'password' && touched.confirmPassword) {
      const confirmMsg = validateField('confirmPassword', next.confirmPassword, next);
      setFieldErrors((fe) => ({ ...fe, confirmPassword: confirmMsg || undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Mark all fields touched and validate
    setTouched({ username: true, email: true, password: true, confirmPassword: true });
    const errs = runFormValidation();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      const success = await signup(formData.username.trim(), formData.email.trim(), formData.password);
      if (success) {
        setStep('otp');
        toast({
          title: 'OTP Sent',
          description: 'Please check your email for the verification code.',
        });
      } else {
        setSubmitError('Signup failed. The email might already be in use.');
      }
    } catch (err) {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const otpMsg = validateOtp(otp);
    setTouched((t) => ({ ...t, otp: true }));
    setFieldErrors((fe) => ({ ...fe, otp: otpMsg || undefined }));
    if (otpMsg) return;

    setIsLoading(true);
    try {
      const otpValid = await verifyOtp(formData.email.trim(), otp);
      if (otpValid) {
        toast({
          title: 'Account Created',
          description: 'Welcome to Roomy! Please log in to continue.',
        });
        navigate('/auth/login');
      } else {
        setSubmitError('Invalid OTP. Please enter a valid 6-digit code.');
      }
    } catch (err) {
      setSubmitError('Could not verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {formData.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleOtpVerification} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="otp"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, otp: true }));
                    const msg = validateOtp(otp);
                    setFieldErrors((fe) => ({ ...fe, otp: msg || undefined }));
                  }}
                  aria-invalid={!!fieldErrors.otp}
                  aria-describedby={fieldErrors.otp ? 'otp-error' : undefined}
                  required
                  className={`pl-10 ${fieldErrors.otp ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
              </div>
              {fieldErrors.otp && (
                <p id="otp-error" className="text-sm text-red-500">{fieldErrors.otp}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !isOtpValid}>
              {isLoading ? <Spinner /> : 'Verify Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>
          Join Roomy and start connecting. Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="John Doe"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                aria-invalid={!!fieldErrors.username}
                aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                required
                className={`pl-10 ${fieldErrors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
            </div>
            {fieldErrors.username && (
              <p id="username-error" className="text-sm text-red-500">{fieldErrors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                required
                className={`pl-10 ${fieldErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
            </div>
            {fieldErrors.email && (
              <p id="email-error" className="text-sm text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : 'password-hint'}
                required
                className={`pl-10 pr-10 ${fieldErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password ? (
              <p id="password-error" className="text-sm text-red-500">{fieldErrors.password}</p>
            ) : (
              <p id="password-hint" className="text-xs text-muted-foreground">
                Use at least 8 characters with letters and numbers.
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="********"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                aria-invalid={!!fieldErrors.confirmPassword}
                aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
                required
                className={`pl-10 pr-10 ${fieldErrors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p id="confirm-password-error" className="text-sm text-red-500">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
            {isLoading ? <Spinner /> : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
