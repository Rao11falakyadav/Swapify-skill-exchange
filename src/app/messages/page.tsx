'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages, useConversationMessages } from '@/hooks/useMessages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types';

export default function MessagesPage() {
  const { userData } = useAuth();
  const { conversations, loading: conversationsLoading } = useMessages(userData?.id || null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<{ [userId: string]: User }>({});
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, loading: messagesLoading, sendMessage } = useConversationMessages(selectedConversationId);

  // Fetch participant details
  useEffect(() => {
    const fetchParticipants = async () => {
      const participantIds = new Set<string>();
      conversations.forEach(conv => {
        conv.participants.forEach(id => {
          if (id !== userData?.id) {
            participantIds.add(id);
          }
        });
      });

      const participantData: { [userId: string]: User } = {};
      await Promise.all(
        Array.from(participantIds).map(async (id) => {
          if (!participants[id]) {
            try {
              const userDoc = await getDoc(doc(db, 'users', id));
              if (userDoc.exists()) {
                participantData[id] = { id, ...userDoc.data() } as User;
              }
            } catch (error) {
              console.error('Error fetching user:', error);
            }
          }
        })
      );

      setParticipants(prev => ({ ...prev, ...participantData }));
    };

    if (conversations.length > 0 && userData) {
      fetchParticipants();
    }
  }, [conversations, userData]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userData || !selectedConversationId || sending) return;

    const selectedConv = conversations.find(c => c.id === selectedConversationId);
    if (!selectedConv) return;

    const receiverId = selectedConv.participants.find(id => id !== userData.id);
    if (!receiverId) return;

    setSending(true);
    try {
      await sendMessage(newMessage.trim(), userData.id, receiverId);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conversation: any) => {
    const otherId = conversation.participants.find((id: string) => id !== userData?.id);
    return participants[otherId] || null;
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Please log in to view messages.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            {selectedConversationId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversationId(null)}
                className="md:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <Badge variant="secondary">{conversations.length}</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <div className={`${selectedConversationId ? 'hidden md:block' : ''} space-y-4`}>
            <h2 className="text-xl font-semibold text-gray-900">Conversations</h2>
            
            {conversationsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-400 mt-2">Start a conversation by messaging someone!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2 overflow-y-auto">
                {conversations.map((conversation) => {
                  const otherUser = getOtherParticipant(conversation);
                  const unreadCount = conversation.unreadCount?.[userData.id] || 0;
                  
                  return (
                    <Card
                      key={conversation.id}
                      className={`cursor-pointer transition-colors ${
                        selectedConversationId === conversation.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedConversationId(conversation.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={otherUser?.photoURL || undefined} />
                            <AvatarFallback>
                              {otherUser?.displayName?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {otherUser?.displayName || 'Loading...'}
                            </p>
                            {conversation.lastMessage && (
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                            <p className="text-xs text-gray-400">
                              {conversation.updatedAt && format(conversation.updatedAt.toDate(), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chat Interface */}
          <div className={`md:col-span-2 ${!selectedConversationId ? 'hidden md:flex' : 'flex'} flex-col`}>
            {selectedConversationId ? (
              <>
                {/* Chat Header */}
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      {(() => {
                        const conv = conversations.find(c => c.id === selectedConversationId);
                        const otherUser = conv ? getOtherParticipant(conv) : null;
                        return (
                          <>
                            <Avatar>
                              <AvatarImage src={otherUser?.photoURL || undefined} />
                              <AvatarFallback>
                                {otherUser?.displayName?.charAt(0) || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {otherUser?.displayName || 'Loading...'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {otherUser?.isOnline ? 'Online' : 'Offline'}
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {/* Messages */}
                <Card className="flex-1 flex flex-col">
                  <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messagesLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-10 bg-gray-200 rounded-lg max-w-xs"></div>
                          </div>
                        ))}
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <p>No messages yet</p>
                        <p className="text-sm text-gray-400">Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === userData.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === userData.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === userData.id
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {format(message.timestamp.toDate(), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sending}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={sending || !newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="flex-1 flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
