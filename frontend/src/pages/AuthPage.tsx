import React from 'react';
import { useParams } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { MessageCircle } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  const renderForm = () => {
    switch (type) {
      case 'login':
        return <LoginForm />;
      case 'signup':
        return <SignupForm />;
      case 'forgot-password':
        return <ForgotPasswordForm />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Room Bridge
            </span>
          </div>
        </div>
        {renderForm()}
      </div>
    </div>
  );
};