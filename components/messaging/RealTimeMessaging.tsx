'use client';

import React, { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  PhoneIcon,
  VideoCameraIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  FaceSmileIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'system';
  isRead: boolean;
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
}

interface ChatConversation {
  id: string;
  name: string;
  avatar: string;
  type: 'direct' | 'group';
  participants: {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'away' | 'offline';
  }[];
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  unreadCount: number;
  isActive: boolean;
}

interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
  lastSeen?: string;
}

export default function RealTimeMessaging() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState<string[]>([]);

  useEffect(() => {
    loadMessagingData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      simulateTyping();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation);
    }
  }, [activeConversation]);

  const loadMessagingData = async () => {
    setLoading(true);
    try {
      const [conversationsRes, usersRes] = await Promise.all([
        fetch('/api/social/messaging/conversations'),
        fetch('/api/social/messaging/online-users'),
      ]);

      const conversationsData = await conversationsRes.json();
      const usersData = await usersRes.json();

      setConversations(conversationsData.conversations || mockConversations);
      setOnlineUsers(usersData.users || mockOnlineUsers);

      if (conversationsData.conversations?.length > 0) {
        setActiveConversation(conversationsData.conversations[0].id);
      }
    } catch (error) {
      console.error('Error loading messaging data:', error);
      setConversations(mockConversations);
      setOnlineUsers(mockOnlineUsers);
      if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(
        `/api/social/messaging/conversations/${conversationId}/messages`
      );
      const data = await response.json();
      setMessages(data.messages || mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages(mockMessages);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: '/api/placeholder/32/32',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false,
    };

    try {
      await fetch('/api/social/messaging/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation,
          message: newMessage,
        }),
      });

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Update conversation last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation
            ? {
                ...conv,
                lastMessage: {
                  content: newMessage,
                  timestamp: new Date().toISOString(),
                  senderId: 'current-user',
                },
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Still add to UI for demo
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const simulateTyping = () => {
    const randomUser =
      mockOnlineUsers[Math.floor(Math.random() * mockOnlineUsers.length)];
    setTyping([randomUser.name]);

    setTimeout(() => {
      setTyping([]);

      // Add a mock message after typing
      const mockMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: randomUser.id,
        senderName: randomUser.name,
        senderAvatar: randomUser.avatar,
        content: 'This is a simulated real-time message! 👋',
        timestamp: new Date().toISOString(),
        type: 'text',
        isRead: false,
      };

      if (activeConversation) {
        setMessages(prev => [...prev, mockMessage]);
      }
    }, 2000);
  };

  const startNewConversation = (userId: string) => {
    const user = onlineUsers.find(u => u.id === userId);
    if (!user) return;

    const newConversation: ChatConversation = {
      id: `conv-${Date.now()}`,
      name: user.name,
      avatar: user.avatar,
      type: 'direct',
      participants: [
        {
          id: 'current-user',
          name: 'You',
          avatar: '/api/placeholder/32/32',
          status: 'online',
        },
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          status: user.status,
        },
      ],
      lastMessage: {
        content: '',
        timestamp: new Date().toISOString(),
        senderId: '',
      },
      unreadCount: 0,
      isActive: false,
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
    setMessages([]);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatLastSeen = (timestamp: string) => {
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Mock data
  const mockConversations: ChatConversation[] = [
    {
      id: '1',
      name: 'Alex Rodriguez',
      avatar: '/api/placeholder/40/40',
      type: 'direct',
      participants: [
        {
          id: 'current-user',
          name: 'You',
          avatar: '/api/placeholder/32/32',
          status: 'online',
        },
        {
          id: 'alex',
          name: 'Alex Rodriguez',
          avatar: '/api/placeholder/32/32',
          status: 'online',
        },
      ],
      lastMessage: {
        content: "That sounds like a great idea! Let's discuss it further.",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        senderId: 'alex',
      },
      unreadCount: 2,
      isActive: true,
    },
    {
      id: '2',
      name: 'AI Developers Group',
      avatar: '/api/placeholder/40/40',
      type: 'group',
      participants: [
        {
          id: 'current-user',
          name: 'You',
          avatar: '/api/placeholder/32/32',
          status: 'online',
        },
        {
          id: 'alex',
          name: 'Alex Rodriguez',
          avatar: '/api/placeholder/32/32',
          status: 'online',
        },
        {
          id: 'sarah',
          name: 'Sarah Chen',
          avatar: '/api/placeholder/32/32',
          status: 'away',
        },
        {
          id: 'mike',
          name: 'Mike Johnson',
          avatar: '/api/placeholder/32/32',
          status: 'offline',
        },
      ],
      lastMessage: {
        content: 'Sarah: The new AI model is performing really well!',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        senderId: 'sarah',
      },
      unreadCount: 0,
      isActive: false,
    },
  ];

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      senderId: 'alex',
      senderName: 'Alex Rodriguez',
      senderAvatar: '/api/placeholder/32/32',
      content:
        'Hey! I saw your latest post about the AI social platform. Really impressive work!',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: 'text',
      isRead: true,
    },
    {
      id: '2',
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: '/api/placeholder/32/32',
      content:
        "Thanks! It's been quite a journey. The analytics features are my favorite part.",
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      type: 'text',
      isRead: true,
    },
    {
      id: '3',
      senderId: 'alex',
      senderName: 'Alex Rodriguez',
      senderAvatar: '/api/placeholder/32/32',
      content:
        "I'd love to collaborate on something similar. Are you open to discussing a potential partnership?",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      type: 'text',
      isRead: true,
    },
    {
      id: '4',
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: '/api/placeholder/32/32',
      content:
        "Absolutely! I'm always interested in collaborating with talented developers. What did you have in mind?",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'text',
      isRead: true,
    },
  ];

  const mockOnlineUsers: OnlineUser[] = [
    {
      id: 'alex',
      name: 'Alex Rodriguez',
      avatar: '/api/placeholder/32/32',
      status: 'online',
    },
    {
      id: 'sarah',
      name: 'Sarah Chen',
      avatar: '/api/placeholder/32/32',
      status: 'away',
    },
    {
      id: 'mike',
      name: 'Mike Johnson',
      avatar: '/api/placeholder/32/32',
      status: 'busy',
    },
    {
      id: 'emma',
      name: 'Emma Wilson',
      avatar: '/api/placeholder/32/32',
      status: 'online',
    },
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversations.find(conv => conv.id === activeConversation);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Messaging</h2>
        <p className="text-gray-600">Connect and communicate in real-time</p>
      </div>

      <div
        className="bg-white rounded-lg shadow-sm border overflow-hidden"
        style={{ height: '600px' }}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Online Users */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Online Now
              </h3>
              <div className="flex space-x-2 overflow-x-auto">
                {onlineUsers
                  .filter(user => user.status === 'online')
                  .map(user => (
                    <button
                      key={user.id}
                      onClick={() => startNewConversation(user.id)}
                      className="flex flex-col items-center space-y-1 min-w-0 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <span className="text-xs text-gray-600 truncate w-full text-center">
                        {user.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 text-sm mt-2">Loading...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredConversations.map(conversation => (
                    <button
                      key={conversation.id}
                      onClick={() => setActiveConversation(conversation.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        activeConversation === conversation.id
                          ? 'bg-blue-50 border-r-2 border-blue-500'
                          : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="w-12 h-12 rounded-full"
                          />
                          {conversation.type === 'direct' && (
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
                                conversation.participants.find(
                                  p => p.id !== 'current-user'
                                )?.status === 'online'
                                  ? 'bg-green-500'
                                  : conversation.participants.find(
                                        p => p.id !== 'current-user'
                                      )?.status === 'away'
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-400'
                              }`}
                            ></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 truncate">
                              {conversation.name}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {conversation.unreadCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                  {conversation.unreadCount}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={activeConv.avatar}
                      alt={activeConv.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {activeConv.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {activeConv.type === 'group'
                          ? `${activeConv.participants.length} members`
                          : activeConv.participants.find(
                                p => p.id !== 'current-user'
                              )?.status === 'online'
                            ? 'Online now'
                            : 'Last seen recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <PhoneIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <VideoCameraIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                          message.senderId === 'current-user'
                            ? 'flex-row-reverse space-x-reverse'
                            : ''
                        }`}
                      >
                        <img
                          src={message.senderAvatar}
                          alt={message.senderName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.senderId === 'current-user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p>{message.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {typing.length > 0 && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.1s' }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.2s' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <PaperClipIcon className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
                        <FaceSmileIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No conversation selected
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
