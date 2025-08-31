import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message, Conversation } from '@/types';

export function useMessages(userId: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Listen to conversations where user is a participant
    const conversationsQuery = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
      const convs: Conversation[] = [];
      snapshot.forEach((doc) => {
        convs.push({ id: doc.id, ...doc.data() } as Conversation);
      });
      setConversations(convs);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { conversations, loading };
}

export function useConversationMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const messagesQuery = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      setLoading(false);
    });

    return unsubscribe;
  }, [conversationId]);

  const sendMessage = async (
    content: string,
    senderId: string,
    receiverId: string
  ) => {
    if (!conversationId) throw new Error('No conversation ID');

    try {
      // Add message to messages collection
      const messageData = {
        conversationId,
        senderId,
        receiverId,
        content,
        timestamp: Timestamp.now(),
        read: false,
        type: 'text' as const,
      };

      await addDoc(collection(db, 'messages'), messageData);

      // Update conversation with last message
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: messageData,
        updatedAt: Timestamp.now(),
        [`unreadCount.${receiverId}`]: 0, // Reset sender's unread count
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = async (messageIds: string[], userId: string) => {
    try {
      const updates = messageIds.map(async (messageId) => {
        const messageRef = doc(db, 'messages', messageId);
        await updateDoc(messageRef, { read: true });
      });

      await Promise.all(updates);

      // Reset unread count for this user
      if (conversationId) {
        const conversationRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationRef, {
          [`unreadCount.${userId}`]: 0,
        });
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return { messages, loading, sendMessage, markAsRead };
}

// Helper function to create a new conversation
export async function createConversation(
  participant1Id: string,
  participant2Id: string
): Promise<string> {
  try {
    // Check if conversation already exists
    const existingQuery = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', participant1Id)
    );

    const existingSnapshot = await getDocs(existingQuery);
    const existingConv = existingSnapshot.docs.find((doc) => {
      const data = doc.data();
      return data.participants.includes(participant2Id);
    });

    if (existingConv) {
      return existingConv.id;
    }

    // Create new conversation
    const conversationData = {
      participants: [participant1Id, participant2Id],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      unreadCount: {
        [participant1Id]: 0,
        [participant2Id]: 0,
      },
    };

    const docRef = await addDoc(collection(db, 'conversations'), conversationData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}
