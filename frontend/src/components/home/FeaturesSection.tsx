import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageCircle,
  Users,
  Shield,
  Globe,
  Zap,
  Heart,
  Lock,
  Smartphone,
  Search,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Real-time Messaging',
      description: 'Experience lightning-fast messaging with instant delivery and read receipts.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      icon: Users,
      title: 'Room-based Communities',
      description: 'Create or join rooms based on your interests and connect with like-minded people.',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      icon: Shield,
      title: 'End-to-End Security',
      description: 'Your conversations are protected with military-grade encryption and privacy controls.',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with people from around the world and break down geographical barriers.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance ensures smooth conversations without any lag or delays.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    },
    {
      icon: Heart,
      title: 'Community Driven',
      description: 'Built by the community, for the community. Your feedback shapes our future.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Complete control over your data with granular privacy settings and data ownership.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform',
      description: 'Seamless experience across all devices - desktop, mobile, and tablet.',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-950/20',
    },
    {
      icon: Search,
      title: 'Smart Discovery',
      description: 'Find relevant rooms and conversations with our intelligent search and recommendation system.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {' '}Modern Communication
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the tools and features that make Room Bridge the ultimate platform 
            for meaningful conversations and community building.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-background/50 backdrop-blur"
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};