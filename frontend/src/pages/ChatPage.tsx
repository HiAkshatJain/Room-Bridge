import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/common/Spinner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Send,
  Users,
  Hash,
  Smile,
  Paperclip,
  MoreVertical,
  Search,
  MessageCircle,
} from 'lucide-react';

const RoomListItemSkeleton = () => (
  <div className="flex items-center space-x-3 p-3">
    <Skeleton className="w-10 h-10 rounded-lg" />
    <div className="flex-1 space-y-1">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

const ChatHeaderSkeleton = () => (
  <div className="flex items-center space-x-3">
    <Skeleton className="w-10 h-10 rounded-lg" />
    <div className="space-y-1">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

const MessageBubbleSkeleton = ({ isCurrentUser = false }) => (
  <div className={cn('flex items-start space-x-3', isCurrentUser && 'justify-end')}>
    {!isCurrentUser && <Skeleton className="w-8 h-8 rounded-full" />}
    <div className="space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
    {isCurrentUser && <Skeleton className="w-8 h-8 rounded-full" />}
  </div>
);

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  const [message, setMessage] = useState('');
  const {
    rooms,
    messages,
    currentRoom,
    setCurrentRoom,
    sendMessage,
    isLoadingRooms,
    isLoadingMessages
  } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomId) {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        setCurrentRoom(room);
      }
    } else if (rooms.length > 0 && !currentRoom) {
      setCurrentRoom(rooms[0]);
    }
  }, [roomId, rooms, currentRoom, setCurrentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentRoom) {
      sendMessage(message.trim(), currentRoom.id);
      setMessage('');
    }
  };

  const roomMessages = currentRoom ? messages.filter(m => m.roomId === currentRoom.id) : [];

  return (
    <div className="h-screen flex">
      {/* Room List Sidebar */}
      <div className="w-80 border-r bg-muted/30 hidden md:flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2 mb-4">
            <Hash className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold">Rooms</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search rooms..." className="pl-10" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoadingRooms ? (
              [...Array(8)].map((_, i) => <RoomListItemSkeleton key={i} />)
            ) : (
              rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setCurrentRoom(room)}
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-background transition-colors',
                    currentRoom?.id === room.id && 'bg-background shadow-sm border'
                  )}
                >
                  <img
                    src={room.avatar}
                    alt={room.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">{room.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {room.memberCount}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {room.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoom || isLoadingRooms ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-background/50 backdrop-blur">
              {currentRoom ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={currentRoom.avatar}
                      alt={currentRoom.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="font-semibold">{currentRoom.name}</h2>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {currentRoom.memberCount} members
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <ChatHeaderSkeleton />
              )}
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {isLoadingMessages ? (
                <div className="space-y-6">
                  <MessageBubbleSkeleton />
                  <MessageBubbleSkeleton isCurrentUser />
                  <MessageBubbleSkeleton />
                  <MessageBubbleSkeleton isCurrentUser />
                </div>
              ) : (
                <div className="space-y-4">
                  {roomMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <Hash className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-2">Welcome to #{currentRoom?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        This is the beginning of your conversation in this room.
                      </p>
                    </div>
                  ) : (
                    roomMessages.map((msg, index) => {
                      const isCurrentUser = msg.senderId === user?.id;
                      const showAvatar = index === 0 || roomMessages[index - 1].senderId !== msg.senderId;

                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            'flex items-start space-x-3',
                            isCurrentUser && 'justify-end'
                          )}
                        >
                          {!isCurrentUser && (
                            <Avatar className={cn('w-8 h-8', !showAvatar && 'invisible')}>
                              <AvatarImage src={msg.senderAvatar} />
                              <AvatarFallback>{msg.senderName[0]}</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              'max-w-lg',
                              isCurrentUser && 'order-first'
                            )}
                          >
                            {showAvatar && !isCurrentUser && (
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium">{msg.senderName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            )}
                            <div
                              className={cn(
                                'rounded-lg p-3 text-sm',
                                isCurrentUser
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              )}
                            >
                              {msg.content}
                            </div>
                            {showAvatar && isCurrentUser && (
                              <div className="text-xs text-muted-foreground text-right mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            )}
                          </div>
                          {isCurrentUser && (
                            <Avatar className={cn('w-8 h-8', !showAvatar && 'invisible')}>
                              <AvatarImage src={user?.avatar} />
                              <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-background/50 backdrop-blur">
              <form onSubmit={handleSendMessage} className="relative">
                <Input
                  placeholder={`Message #${currentRoom?.name || '...'}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pr-24"
                  disabled={!currentRoom || isLoadingMessages}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                  <Button variant="ghost" size="icon" type="button">
                    <Smile className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" type="button">
                    <Paperclip className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <Button type="submit" size="icon" disabled={!message.trim()}>
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Select a Room</h2>
            <p className="text-muted-foreground max-w-xs">
              Choose a room from the sidebar to start chatting, or discover new rooms to join.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};