import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Message } from '@/types';

interface ChatContextType {
  rooms: Room[];
  messages: Message[];
  currentRoom: Room | null;
  isLoadingRooms: boolean;
  isLoadingMessages: boolean;
  setCurrentRoom: (room: Room | null) => void;
  sendMessage: (content: string, roomId: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  searchRooms: (query: string) => Room[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock data
const mockRooms: Room[] = [
  {
    id: '1',
    name: 'General Discussion',
    description: 'Open discussion for all members',
    avatar: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=150',
    memberCount: 245,
    isPrivate: false,
    tags: ['general', 'discussion', 'community'],
    createdAt: '2024-01-01',
    lastMessage: {
      id: '1',
      content: 'Welcome to the community!',
      senderId: '1',
      senderName: 'John Doe',
      roomId: '1',
      timestamp: new Date().toISOString(),
      type: 'text',
    },
  },
  {
    id: '2',
    name: 'Tech Talk',
    description: 'Discuss the latest in technology',
    avatar: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=150',
    memberCount: 128,
    isPrivate: false,
    tags: ['tech', 'programming', 'innovation'],
    createdAt: '2024-01-05',
    lastMessage: {
      id: '2',
      content: 'What do you think about AI?',
      senderId: '2',
      senderName: 'Jane Smith',
      roomId: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'text',
    },
  },
  {
    id: '3',
    name: 'Gaming Hub',
    description: 'For all gaming enthusiasts',
    avatar: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=150',
    memberCount: 89,
    isPrivate: false,
    tags: ['gaming', 'entertainment', 'multiplayer'],
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    name: 'VIP Lounge',
    description: 'Exclusive room for premium members',
    avatar: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=150',
    memberCount: 12,
    isPrivate: true,
    tags: ['vip', 'exclusive', 'premium'],
    createdAt: '2024-01-20',
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Welcome to the community! Feel free to introduce yourself.',
    senderId: '1',
    senderName: 'John Doe',
    senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50',
    roomId: '1',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'text',
  },
  {
    id: '2',
    content: 'Thanks for the warm welcome! Excited to be here.',
    senderId: '2',
    senderName: 'Jane Smith',
    senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50',
    roomId: '1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'text',
  },
  {
    id: '3',
    content: 'What do you think about the latest AI developments?',
    senderId: '2',
    senderName: 'Jane Smith',
    senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50',
    roomId: '2',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: 'text',
  },
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    // Simulate fetching rooms
    setIsLoadingRooms(true);
    setTimeout(() => {
      setRooms(mockRooms);
      setIsLoadingRooms(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (currentRoom) {
      // Simulate fetching messages for the current room
      setIsLoadingMessages(true);
      setTimeout(() => {
        setMessages(mockMessages.filter(m => m.roomId === currentRoom.id));
        setIsLoadingMessages(false);
      }, 1000);
    } else {
      setMessages([]);
    }
  }, [currentRoom]);

  const sendMessage = (content: string, roomId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: '1', // Current user ID
      senderName: 'Current User',
      senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50',
      roomId,
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const joinRoom = (roomId: string) => {
    console.log(`Joining room ${roomId}`);
  };

  const leaveRoom = (roomId: string) => {
    console.log(`Leaving room ${roomId}`);
  };

  const searchRooms = (query: string): Room[] => {
    return rooms.filter(room =>
      room.name.toLowerCase().includes(query.toLowerCase()) ||
      room.description.toLowerCase().includes(query.toLowerCase()) ||
      room.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const value: ChatContextType = {
    rooms,
    messages,
    currentRoom,
    isLoadingRooms,
    isLoadingMessages,
    setCurrentRoom,
    sendMessage,
    joinRoom,
    leaveRoom,
    searchRooms,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};