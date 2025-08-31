'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, X, ArrowRight } from 'lucide-react';
import { Skill, SkillCategory, SkillLevel } from '@/types';

const skillCategories: SkillCategory[] = [
  'Programming', 'Design', 'Marketing', 'Language', 'Music', 'Art', 'Writing', 'Business', 'Other'
];

const skillLevels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function ProfileSetupPage() {
  const { userData, updateUserProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    bio: userData?.bio || '',
    location: userData?.location || '',
    timezone: userData?.timezone || '',
  });

  const [skillsOffered, setSkillsOffered] = useState<Skill[]>(userData?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState<Skill[]>(userData?.skillsWanted || []);
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '' as SkillCategory,
    level: '' as SkillLevel,
    description: '',
    tags: [] as string[],
    type: 'offered' as 'offered' | 'wanted'
  });

  const addSkill = () => {
    if (!newSkill.name || !newSkill.category || !newSkill.level) {
      toast.error('Please fill in all skill fields');
      return;
    }

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name,
      category: newSkill.category,
      level: newSkill.level,
      description: newSkill.description,
      tags: newSkill.tags,
    };

    if (newSkill.type === 'offered') {
      setSkillsOffered([...skillsOffered, skill]);
    } else {
      setSkillsWanted([...skillsWanted, skill]);
    }

    setNewSkill({
      name: '',
      category: '' as SkillCategory,
      level: '' as SkillLevel,
      description: '',
      tags: [],
      type: 'offered'
    });
  };

  const removeSkill = (skillId: string, type: 'offered' | 'wanted') => {
    if (type === 'offered') {
      setSkillsOffered(skillsOffered.filter(skill => skill.id !== skillId));
    } else {
      setSkillsWanted(skillsWanted.filter(skill => skill.id !== skillId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (skillsOffered.length === 0 || skillsWanted.length === 0) {
      toast.error('Please add at least one skill you can offer and one you want to learn');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({
        ...profileData,
        skillsOffered,
        skillsWanted,
      });
      
      toast.success('Profile setup complete!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription>
              Tell us about yourself and the skills you'd like to swap
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Profile Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About You</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell others about yourself and your interests..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={loading}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      placeholder="e.g., America/New_York"
                      value={profileData.timezone}
                      onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              
              {/* Skills Offered */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skills You Can Offer</h3>
                
                {skillsOffered.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skillsOffered.map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="flex items-center gap-2">
                        {skill.name} ({skill.level})
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeSkill(skill.id, 'offered')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <Input
                    placeholder="Skill name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  />
                  
                  <Select
                    value={newSkill.category}
                    onValueChange={(value: SkillCategory) => setNewSkill({...newSkill, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={newSkill.level}
                    onValueChange={(value: SkillLevel) => setNewSkill({...newSkill, level: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    type="button"
                    onClick={() => {
                      setNewSkill({...newSkill, type: 'offered'});
                      addSkill();
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              
              {/* Skills Wanted */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skills You Want to Learn</h3>
                
                {skillsWanted.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skillsWanted.map((skill) => (
                      <Badge key={skill.id} variant="outline" className="flex items-center gap-2">
                        {skill.name} ({skill.level})
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeSkill(skill.id, 'wanted')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <Input
                    placeholder="Skill name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  />
                  
                  <Select
                    value={newSkill.category}
                    onValueChange={(value: SkillCategory) => setNewSkill({...newSkill, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={newSkill.level}
                    onValueChange={(value: SkillLevel) => setNewSkill({...newSkill, level: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    type="button"
                    onClick={() => {
                      setNewSkill({...newSkill, type: 'wanted'});
                      addSkill();
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Saving Profile...' : 'Complete Setup'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
