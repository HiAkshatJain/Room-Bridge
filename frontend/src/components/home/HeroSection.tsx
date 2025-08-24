import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowRight,
  Play,
  Star,
  Users,
  MessageCircle,
  Zap,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Trusted by 10,000+ users worldwide
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Connect
            </span>{' '}
            <span className="text-foreground">Beyond</span>
            <br />
            <span className="text-foreground">Boundaries with</span>{' '}
            <span className="bg-gradient-to-r from-secondary via-primary to-primary bg-clip-text text-transparent">
              Room Bridge
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the future of communication with our revolutionary chat platform. 
            Create rooms, build communities, and connect with people who share your passions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {isAuthenticated ? (
              <>
                <Link to="/chat">
                  <Button size="lg" className="group px-8 py-6 text-lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Chatting
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/rooms">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                    <Users className="w-5 h-5 mr-2" />
                    Explore Rooms
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth/signup">
                  <Button size="lg" className="group px-8 py-6 text-lg">
                    <Zap className="w-5 h-5 mr-2" />
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="group px-8 py-6 text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Chat Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">Messages Sent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};