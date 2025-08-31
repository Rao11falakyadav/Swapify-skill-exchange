'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, MessageSquare, Users, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { userData, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Loading your profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">Swapify Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={userData.photoURL || undefined} />
                <AvatarFallback>
                  {userData.displayName?.charAt(0) || userData.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Summary */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.photoURL || undefined} />
                <AvatarFallback className="text-2xl">
                  {userData.displayName?.charAt(0) || userData.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{userData.displayName}</CardTitle>
                <CardDescription className="text-base">
                  {userData.location && `${userData.location} • `}
                  {userData.totalSwaps} swaps completed • Rating: {userData.rating || 'New user'}
                </CardDescription>
                {userData.bio && <p className="mt-2 text-gray-600">{userData.bio}</p>}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Offered */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Skills I Offer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userData.skillsOffered?.length > 0 ? (
                <div className="space-y-2">
                  {userData.skillsOffered.map((skill) => (
                    <div key={skill.id} className="flex justify-between items-center">
                      <span className="font-medium">{skill.name}</span>
                      <Badge variant="secondary">{skill.level}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No skills added yet</p>
                  <Button className="mt-4" onClick={() => router.push('/profile/setup')}>
                    Add Skills
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Wanted */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Skills I Want to Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userData.skillsWanted?.length > 0 ? (
                <div className="space-y-2">
                  {userData.skillsWanted.map((skill) => (
                    <div key={skill.id} className="flex justify-between items-center">
                      <span className="font-medium">{skill.name}</span>
                      <Badge variant="outline">{skill.level}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No learning goals set</p>
                  <Button className="mt-4" onClick={() => router.push('/profile/setup')}>
                    Add Learning Goals
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/search')}>
                <Users className="mr-2 h-4 w-4" />
                Find Matches
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/messages')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/profile/setup')}>
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm">Start by finding skill-swap partners!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
