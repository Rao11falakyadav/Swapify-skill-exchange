'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Users, Zap } from 'lucide-react';

export default function LandingPage() {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Connect & Match",
      description: "Find perfect skill-swapping partners based on complementary needs"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Chat",
      description: "Communicate seamlessly with instant messaging and scheduling"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Smart Recommendations",
      description: "AI-powered matching to find your ideal learning partners"
    }
  ];

  const skillCategories = [
    'Programming', 'Design', 'Language', 'Music', 'Art', 'Writing', 'Marketing', 'Business'
  ];

  if (currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
            <CardDescription>
              Continue your skill-swapping journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Swapify</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Where Skills Become
            <span className="text-blue-600 block">Currency</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with learners worldwide and swap your expertise. Teach what you know, learn what you want.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Swapping Skills
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How Swapify Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform makes skill-swapping simple, efficient, and rewarding
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Skills Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Skill Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From programming to music, discover endless learning opportunities
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {skillCategories.map((category, index) => (
            <Badge key={index} variant="secondary" className="text-lg py-2 px-4">
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of learners who are already swapping skills on Swapify
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">Swapify</span>
          </div>
          <p className="text-gray-400">
            Where Skills Become Currency - Connect, Learn, Grow
          </p>
        </div>
      </footer>
    </div>
  );
}
