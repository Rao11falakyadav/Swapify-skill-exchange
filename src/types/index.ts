import { Timestamp } from 'firebase/firestore';

// User related types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location: string;
  timezone: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  rating: number;
  totalSwaps: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isOnline: boolean;
  lastSeen: Timestamp;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description: string;
  tags: string[];
}

export type SkillCategory = 
  | 'Programming'
  | 'Design'
  | 'Marketing'
  | 'Language'
  | 'Music'
  | 'Art'
  | 'Writing'
  | 'Business'
  | 'Other';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

// Match related types
export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  user1OfferedSkill: string;
  user1WantedSkill: string;
  user2OfferedSkill: string;
  user2WantedSkill: string;
  status: MatchStatus;
  matchScore: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type MatchStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

// Message related types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  read: boolean;
  type: MessageType;
}

export type MessageType = 'text' | 'image' | 'system';

// Chat/Conversation types
export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: { [userId: string]: number };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Swap Session types
export interface SwapSession {
  id: string;
  matchId: string;
  userId1: string;
  userId2: string;
  scheduledDate: Timestamp;
  duration: number; // in minutes
  status: SwapSessionStatus;
  user1Rating?: number;
  user2Rating?: number;
  user1Feedback?: string;
  user2Feedback?: string;
  createdAt: Timestamp;
  completedAt?: Timestamp;
}

export type SwapSessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

// Search and filter types
export interface SearchFilters {
  skillCategory?: SkillCategory[];
  skillLevel?: SkillLevel[];
  location?: string;
  timezone?: string;
  rating?: number;
  searchTerm?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: Timestamp;
}

export type NotificationType = 
  | 'match_found'
  | 'match_accepted'
  | 'match_rejected'
  | 'session_scheduled'
  | 'session_reminder'
  | 'session_completed'
  | 'new_message';

// Form types
export interface SignupForm {
  email: string;
  password: string;
  displayName: string;
  location: string;
  timezone: string;
}

export interface ProfileForm {
  displayName: string;
  bio: string;
  location: string;
  timezone: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Component prop types
export interface UserCardProps {
  user: User;
  onMatch?: (userId: string) => void;
  showMatchButton?: boolean;
}

export interface MatchCardProps {
  match: Match;
  currentUserId: string;
  onAccept?: (matchId: string) => void;
  onReject?: (matchId: string) => void;
}
