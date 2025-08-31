'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, Star, MapPin } from 'lucide-react';
import { User, SkillCategory, SearchFilters } from '@/types';
import { createConversation } from '@/hooks/useMessages';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const skillCategories: SkillCategory[] = [
  'Programming', 'Design', 'Marketing', 'Language', 'Music', 'Art', 'Writing', 'Business', 'Other'
];

export default function SearchPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    skillCategory: [],
    location: '',
  });

  const searchUsers = async () => {
    if (!userData) return;
    
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      let q = query(
        usersRef,
        orderBy('displayName'),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const user = { id: doc.id, ...doc.data() } as User;
        
        // Skip current user
        if (user.id === userData.id) return;
        
        // Basic filtering logic
        let includeUser = true;
        
        // Filter by search term
        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          const matchesName = user.displayName.toLowerCase().includes(searchTerm);
          const matchesBio = user.bio?.toLowerCase().includes(searchTerm) || false;
          const matchesSkills = user.skillsOffered.some(skill => 
            skill.name.toLowerCase().includes(searchTerm) ||
            skill.description.toLowerCase().includes(searchTerm)
          );
          
          if (!matchesName && !matchesBio && !matchesSkills) {
            includeUser = false;
          }
        }
        
        // Filter by location
        if (filters.location && !user.location.toLowerCase().includes(filters.location.toLowerCase())) {
          includeUser = false;
        }
        
        // Filter by skill category
        if (filters.skillCategory && filters.skillCategory.length > 0) {
          const hasMatchingCategory = user.skillsOffered.some(skill => 
            filters.skillCategory!.includes(skill.category)
          );
          if (!hasMatchingCategory) {
            includeUser = false;
          }
        }
        
        if (includeUser) {
          users.push(user);
        }
      });
      
      setSearchResults(users);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial results
  useEffect(() => {
    searchUsers();
  }, [userData]);

  const getMatchingSkills = (user: User) => {
    if (!userData) return [];
    
    const matches = [];
    
    // Find skills where current user wants what the other user offers
    for (const wantedSkill of userData.skillsWanted) {
      for (const offeredSkill of user.skillsOffered) {
        if (wantedSkill.category === offeredSkill.category || 
            wantedSkill.name.toLowerCase().includes(offeredSkill.name.toLowerCase())) {
          matches.push({ type: 'learn', skill: offeredSkill });
        }
      }
    }
    
    // Find skills where current user offers what the other user wants
    for (const offeredSkill of userData.skillsOffered) {
      for (const wantedSkill of user.skillsWanted) {
        if (offeredSkill.category === wantedSkill.category || 
            offeredSkill.name.toLowerCase().includes(wantedSkill.name.toLowerCase())) {
          matches.push({ type: 'teach', skill: offeredSkill });
        }
      }
    }
    
    return matches;
  };

  const handleConnect = async (userId: string) => {
    if (!userData || connecting) return;
    
    setConnecting(userId);
    try {
      const conversationId = await createConversation(userData.id, userId);
      toast.success('Connected! Conversation started.');
      router.push('/messages');
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to start conversation');
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Skill Partners</h1>
          <p className="text-gray-600 mt-2">Discover people who can teach you new skills or learn from yours</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search by name, skills, or bio"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.skillCategory?.[0] || 'all'}
                  onValueChange={(value: string) => 
                    setFilters({...filters, skillCategory: value === 'all' ? [] : [value as SkillCategory]})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {skillCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="City or country"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">&nbsp;</label>
                <Button onClick={searchUsers} className="w-full" disabled={loading}>
                  <Search className="mr-2 h-4 w-4" />
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {searchResults.length} users found
            </h2>
          </div>
          
          {searchResults.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No users found matching your criteria</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your search filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((user) => {
                const matchingSkills = getMatchingSkills(user);
                
                return (
                  <Card key={user.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.photoURL || undefined} />
                          <AvatarFallback>
                            {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{user.displayName}</CardTitle>
                          <CardDescription className="flex items-center text-sm">
                            {user.location && (
                              <span className="flex items-center mr-3">
                                <MapPin className="h-3 w-3 mr-1" />
                                {user.location}
                              </span>
                            )}
                            {user.rating > 0 && (
                              <span className="flex items-center">
                                <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                                {user.rating}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      {user.bio && (
                        <p className="text-sm text-gray-600 mt-2">{user.bio}</p>
                      )}
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Skills Offered */}
                      {user.skillsOffered.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Can teach:</h4>
                          <div className="flex flex-wrap gap-1">
                            {user.skillsOffered.slice(0, 3).map((skill) => (
                              <Badge key={skill.id} variant="secondary" className="text-xs">
                                {skill.name}
                              </Badge>
                            ))}
                            {user.skillsOffered.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.skillsOffered.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Skills Wanted */}
                      {user.skillsWanted.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Wants to learn:</h4>
                          <div className="flex flex-wrap gap-1">
                            {user.skillsWanted.slice(0, 3).map((skill) => (
                              <Badge key={skill.id} variant="outline" className="text-xs">
                                {skill.name}
                              </Badge>
                            ))}
                            {user.skillsWanted.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.skillsWanted.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Matching Skills */}
                      {matchingSkills.length > 0 && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium text-sm text-green-800 mb-2">
                            🎯 Potential Skills Match!
                          </h4>
                          <div className="text-xs text-green-700">
                            {matchingSkills.length} matching skill{matchingSkills.length !== 1 ? 's' : ''} found
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        onClick={() => handleConnect(user.id)}
                        disabled={connecting === user.id}
                      >
                        {connecting === user.id ? 'Connecting...' : 'Connect'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
