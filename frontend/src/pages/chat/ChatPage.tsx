import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatMessage } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import { Send, MessageCircle, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatUser {
  userId: number;
  name: string;
  profileImageUrl: null | string;
  lastMessage?: string;
  lastMessageTime: string;
}

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');
  
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    targetUserId ? parseInt(targetUserId) : null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function timeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (isNaN(seconds)) return "Invalid date";

    const intervals: { label: string; seconds: number }[] = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }


  useEffect(() => {
    // Mock chat users - in real app, this would come from an API
    // setChatUsers([
    //   { id: 1, name: 'John Doe', lastMessage: 'Is the room still available?', timestamp: '2 hours ago' },
    //   { id: 2, name: 'Jane Smith', lastMessage: 'Thank you for the information', timestamp: '1 day ago' },
    //   { id: 3, name: 'Mike Johnson', lastMessage: 'When can I visit?', timestamp: '3 days ago' },
    // ]);

    const fetchChatUser = async () => {
        try {
          const response = await ApiService.getChatUser();
          setChatUsers(response?.data)
          console.log(response.data)
        } catch (error) {
          console.error('Failed to fetch Chat Users:', error);
        } finally {
          setIsLoading(false);
        }
      };

    fetchChatUser()
    

    if (targetUserId) {
      setSelectedUserId(parseInt(targetUserId));
    }
  }, [targetUserId]);

  useEffect(() => {
    if (selectedUserId && user) {
      fetchConversation();
    }
  }, [selectedUserId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    if (!selectedUserId || !user) return;

    setIsLoading(true);
    try {
      const response = await ApiService.getConversation(user.id, selectedUserId);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
      // Don't show error toast for empty conversations
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || !user || isSending) return;

    setIsSending(true);
    try {
      const messageData = {
        senderId: user.id,
        receiverId: selectedUserId,
        content: newMessage.trim(),
      };

      const response = await ApiService.sendMessage(messageData);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectedUser = chatUsers.find(u => u.userId === selectedUserId);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Connect with room owners and potential tenants</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Chat List */}
          <div className="w-1/3 border-r bg-gray-50">
            <div className="p-4 border-b bg-white">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {chatUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No conversations yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start chatting with room owners
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {chatUsers.map((chatUser) => (
                    <button
                      key={chatUser.userId}
                      onClick={() => setSelectedUserId(chatUser.userId)}
                      className={`w-full p-4 text-left hover:bg-white transition-colors ${
                        selectedUserId === chatUser.userId ? 'bg-white border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                          {/* Optional: You can switch back to the icon if needed */}
                          {/* <User className="h-5 w-5 text-white" /> */}
                          
                          <img
                            src={chatUser.profileImageUrl || `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(chatUser.name || 'User')}`}
                            alt="profile image"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{chatUser.name}</p>
                          <p className="text-sm text-gray-500 truncate">{chatUser.lastMessage}</p>
                        </div>
                        <span className="text-xs text-gray-400">{ timeAgo(chatUser.lastMessageTime)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
          {selectedUserId ? (
            <>
              {/* Chat Header (Sticky) */}
              <div className="sticky top-0 z-10 bg-white border-b p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                    {/* <User className="h-5 w-5 text-white" />
                    OR use image version instead of icon: */}
                    <img
                      src={`https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(selectedUser?.name || 'User')}`}
                      alt="profile image"
                      className="w-full h-full object-cover rounded-full"
                    />
                   
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedUser?.name}</h3>
                    {/* <p className="text-sm text-gray-500">Online</p> */}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 pt-20 space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No messages yet</p>
                    <p className="text-sm text-gray-500 mt-2">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.senderId === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>















          
        </div>
      </div>
    </div>
  );
};

export default ChatPage;