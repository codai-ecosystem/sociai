'use client';

import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  PlusIcon,
  UserPlusIcon,
  CogIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  CalendarIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon: string;
  category: string;
  isPrivate: boolean;
  isJoined: boolean;
  role?: 'owner' | 'admin' | 'moderator' | 'member';
  activity: {
    postsThisWeek: number;
    engagementRate: number;
    activeMembers: number;
  };
  rules: string[];
  createdAt: string;
}

interface CommunityEvent {
  id: string;
  communityId: string;
  title: string;
  description: string;
  date: string;
  attendees: number;
  type: 'online' | 'offline' | 'hybrid';
}

interface CommunityAnalytics {
  totalMembers: number;
  weeklyGrowth: number;
  engagementRate: number;
  topContributors: {
    id: string;
    name: string;
    contributions: number;
  }[];
  popularTopics: {
    topic: string;
    mentions: number;
  }[];
}

export default function CommunityBuilder() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [analytics, setAnalytics] = useState<CommunityAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<
    'explore' | 'manage' | 'create' | 'events' | 'analytics'
  >('explore');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    category: '',
    isPrivate: false,
    icon: '👥',
  });

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      const [communitiesRes, eventsRes, analyticsRes] = await Promise.all([
        fetch('/api/social/communities'),
        fetch('/api/social/events'),
        fetch('/api/social/analytics/communities'),
      ]);

      const communitiesData = await communitiesRes.json();
      const eventsData = await eventsRes.json();
      const analyticsData = await analyticsRes.json();

      setCommunities(communitiesData.communities || mockCommunities);
      setEvents(eventsData.events || mockEvents);
      setAnalytics(analyticsData.analytics || mockAnalytics);
    } catch (error) {
      console.error('Error loading community data:', error);
      setCommunities(mockCommunities);
      setEvents(mockEvents);
      setAnalytics(mockAnalytics);
    } finally {
      setLoading(false);
    }
  };

  const joinCommunity = async (communityId: string) => {
    try {
      await fetch(`/api/social/communities/${communityId}/join`, {
        method: 'POST',
      });

      setCommunities(
        communities.map(community =>
          community.id === communityId
            ? {
                ...community,
                isJoined: true,
                memberCount: community.memberCount + 1,
              }
            : community
        )
      );
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      await fetch(`/api/social/communities/${communityId}/leave`, {
        method: 'POST',
      });

      setCommunities(
        communities.map(community =>
          community.id === communityId
            ? {
                ...community,
                isJoined: false,
                memberCount: community.memberCount - 1,
              }
            : community
        )
      );
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const createCommunity = async () => {
    if (!newCommunity.name.trim() || !newCommunity.description.trim()) return;

    try {
      const response = await fetch('/api/social/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommunity),
      });

      if (response.ok) {
        setNewCommunity({
          name: '',
          description: '',
          category: '',
          isPrivate: false,
          icon: '👥',
        });
        setShowCreateForm(false);
        loadCommunityData();
      }
    } catch (error) {
      console.error('Error creating community:', error);
    }
  };

  const attendEvent = async (eventId: string) => {
    try {
      await fetch(`/api/social/events/${eventId}/attend`, {
        method: 'POST',
      });

      setEvents(
        events.map(event =>
          event.id === eventId
            ? { ...event, attendees: event.attendees + 1 }
            : event
        )
      );
    } catch (error) {
      console.error('Error attending event:', error);
    }
  };

  // Mock data
  const mockCommunities: Community[] = [
    {
      id: '1',
      name: 'AI Developers',
      description:
        'A community for AI and machine learning developers to share knowledge, projects, and collaborate.',
      memberCount: 12500,
      icon: '🤖',
      category: 'Technology',
      isPrivate: false,
      isJoined: true,
      role: 'member',
      activity: {
        postsThisWeek: 45,
        engagementRate: 78,
        activeMembers: 892,
      },
      rules: [
        'Be respectful and professional',
        'Share knowledge and help others',
        'No spam or self-promotion without value',
        'Keep discussions on-topic',
      ],
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Tech Innovators',
      description: 'Exploring the latest in technology trends and innovation.',
      memberCount: 8900,
      icon: '🚀',
      category: 'Innovation',
      isPrivate: false,
      isJoined: false,
      activity: {
        postsThisWeek: 32,
        engagementRate: 85,
        activeMembers: 654,
      },
      rules: [
        'Focus on innovation and emerging tech',
        'Share insights and predictions',
        'Constructive discussions only',
      ],
      createdAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'Creative Minds',
      description:
        'A private community for creative professionals and artists.',
      memberCount: 3200,
      icon: '🎨',
      category: 'Creative',
      isPrivate: true,
      isJoined: true,
      role: 'moderator',
      activity: {
        postsThisWeek: 28,
        engagementRate: 92,
        activeMembers: 245,
      },
      rules: [
        'Share original creative work',
        'Provide constructive feedback',
        'Respect intellectual property',
      ],
      createdAt: '2024-03-10',
    },
  ];

  const mockEvents: CommunityEvent[] = [
    {
      id: '1',
      communityId: '1',
      title: 'AI Ethics Panel Discussion',
      description:
        'Join us for a panel discussion on AI ethics and responsible AI development.',
      date: '2024-02-15T19:00:00Z',
      attendees: 234,
      type: 'online',
    },
    {
      id: '2',
      communityId: '2',
      title: 'Tech Innovation Showcase',
      description:
        'Present your latest innovations and get feedback from the community.',
      date: '2024-02-20T18:00:00Z',
      attendees: 156,
      type: 'hybrid',
    },
  ];

  const mockAnalytics: CommunityAnalytics = {
    totalMembers: 24600,
    weeklyGrowth: 12.5,
    engagementRate: 83,
    topContributors: [
      { id: '1', name: 'Alex Rodriguez', contributions: 45 },
      { id: '2', name: 'Sarah Chen', contributions: 38 },
      { id: '3', name: 'Mike Johnson', contributions: 32 },
    ],
    popularTopics: [
      { topic: 'Machine Learning', mentions: 156 },
      { topic: 'Web Development', mentions: 142 },
      { topic: 'AI Ethics', mentions: 89 },
    ],
  };

  const categories = [
    'Technology',
    'Innovation',
    'Creative',
    'Business',
    'Education',
    'Science',
  ];
  const icons = ['🤖', '🚀', '🎨', '💼', '📚', '🔬', '🌟', '⚡', '🎯', '💡'];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Community Builder
        </h2>
        <p className="text-gray-600">Discover, join, and manage communities</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'explore', label: 'Explore', icon: UserGroupIcon },
            { key: 'manage', label: 'My Communities', icon: CogIcon },
            { key: 'create', label: 'Create', icon: PlusIcon },
            { key: 'events', label: 'Events', icon: CalendarIcon },
            { key: 'analytics', label: 'Analytics', icon: ChartBarIcon },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Explore Communities */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Discover Communities
            </h3>
            <div className="flex space-x-2">
              {categories.map(category => (
                <button
                  key={category}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading communities...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map(community => (
                <div
                  key={community.id}
                  className="bg-white rounded-lg shadow-sm border p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{community.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          {community.name}
                          {community.isPrivate && (
                            <ShieldCheckIcon className="h-4 w-4 ml-1 text-gray-500" />
                          )}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {community.category}
                        </p>
                      </div>
                    </div>
                    {community.role && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {community.role}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {community.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      {community.memberCount.toLocaleString()} members
                    </span>
                    <span>
                      {community.activity.postsThisWeek} posts this week
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${community.activity.engagementRate}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {community.activity.engagementRate}% engagement
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    {community.isJoined ? (
                      <>
                        <button
                          onClick={() => leaveCommunity(community.id)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Leave
                        </button>
                        <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          View
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => joinCommunity(community.id)}
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <UserPlusIcon className="h-4 w-4 mr-1" />
                        Join
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manage Communities */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            My Communities
          </h3>

          <div className="grid gap-4">
            {communities
              .filter(c => c.isJoined)
              .map(community => (
                <div
                  key={community.id}
                  className="bg-white rounded-lg shadow-sm border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{community.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {community.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {community.memberCount.toLocaleString()} members
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          {community.activity.postsThisWeek}
                        </p>
                        <p className="text-xs text-gray-500">Posts this week</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          {community.activity.engagementRate}%
                        </p>
                        <p className="text-xs text-gray-500">Engagement</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                          <MegaphoneIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                          <CogIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Create Community */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Create New Community
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Name
                </label>
                <input
                  type="text"
                  value={newCommunity.name}
                  onChange={e =>
                    setNewCommunity({ ...newCommunity, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter community name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCommunity.description}
                  onChange={e =>
                    setNewCommunity({
                      ...newCommunity,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your community and its purpose"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newCommunity.category}
                  onChange={e =>
                    setNewCommunity({
                      ...newCommunity,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewCommunity({ ...newCommunity, icon })}
                      className={`p-2 text-2xl border rounded-lg transition-colors ${
                        newCommunity.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newCommunity.isPrivate}
                  onChange={e =>
                    setNewCommunity({
                      ...newCommunity,
                      isPrivate: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isPrivate"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Make this community private (members need approval to join)
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createCommunity}
                  disabled={
                    !newCommunity.name.trim() ||
                    !newCommunity.description.trim() ||
                    !newCommunity.category
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Community
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Community Events
            </h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Event
            </button>
          </div>

          <div className="grid gap-4">
            {events.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-sm border p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {event.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span>{event.attendees} attending</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          event.type === 'online'
                            ? 'bg-blue-100 text-blue-700'
                            : event.type === 'offline'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {event.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => attendEvent(event.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Attend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Community Analytics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Total Members
              </h4>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalMembers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">
                +{analytics.weeklyGrowth}% this week
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Engagement Rate
              </h4>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.engagementRate}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${analytics.engagementRate}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Top Contributors
              </h4>
              <div className="space-y-1">
                {analytics.topContributors
                  .slice(0, 3)
                  .map((contributor, index) => (
                    <div
                      key={contributor.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700">
                        {index + 1}. {contributor.name}
                      </span>
                      <span className="text-gray-500">
                        {contributor.contributions}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Popular Topics
              </h4>
              <div className="space-y-1">
                {analytics.popularTopics.slice(0, 3).map(topic => (
                  <div
                    key={topic.topic}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">{topic.topic}</span>
                    <span className="text-gray-500">{topic.mentions}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
