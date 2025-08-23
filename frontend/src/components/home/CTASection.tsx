import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowRight,
  MessageCircle,
  Zap,
  Users,
  Sparkles,
} from 'lucide-react';

export const CTASection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Communication?
            </h2>
            
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who have already discovered the power of meaningful conversations. 
              Start building your community today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {isAuthenticated ? (
                <>
                  <Link to="/chat">
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="group px-8 py-6 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Start Chatting Now
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/rooms">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="px-8 py-6 text-lg border-primary-foreground/30 text-primary hover:bg-primary-foreground/10"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Explore Rooms
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth/signup">
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="group px-8 py-6 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="px-8 py-6 text-lg border-primary-foreground/30 text-primary hover:bg-primary-foreground/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold mb-2">✨ Free Forever</div>
                <div className="text-primary-foreground/80 text-sm">No hidden costs or limits</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">🚀 Instant Setup</div>
                <div className="text-primary-foreground/80 text-sm">Get started in under 2 minutes</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">🔒 Secure & Private</div>
                <div className="text-primary-foreground/80 text-sm">Your data stays protected</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};