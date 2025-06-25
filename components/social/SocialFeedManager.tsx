'use client';

import React, { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  UserGroupIcon,
  SparklesIcon,
  EyeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
} from '@heroicons/react/24/solid';

interface SocialPost {
  id: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
  };
  content: {
    text: string;
    media?: {
      type: 'image' | 'video' | 'gif';
      url: string;
      alt?: string;
    }[];
    hashtags: string[];
    mentions: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    bookmarks: number;
    views: number;
  };
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  aiGenerated: boolean;
  communityId?: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon: string;
  isJoined: boolean;
}

export default function SocialFeedManager() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'following' | 'trending' | 'ai'
  >('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  useEffect(() => {
    loadFeedData();
    loadCommunities();
  }, [activeFilter]);

  const loadFeedData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/social/feed?filter=${activeFilter}`);
      const data = await response.json();
      setPosts(data.posts || mockPosts);
    } catch (error) {
      console.error('Error loading feed:', error);
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunities = async () => {
    try {
      const response = await fetch('/api/social/communities');
      const data = await response.json();
      setCommunities(data.communities || mockCommunities);
    } catch (error) {
      console.error('Error loading communities:', error);
      setCommunities(mockCommunities);
    }
  };

  const handleEngagement = async (
    postId: string,
    action: 'like' | 'bookmark' | 'share'
  ) => {
    try {
      await fetch('/api/social/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action }),
      });

      setPosts(
        posts.map(post => {
          if (post.id === postId) {
            switch (action) {
              case 'like':
                return {
                  ...post,
                  isLiked: !post.isLiked,
                  engagement: {
                    ...post.engagement,
                    likes: post.isLiked
                      ? post.engagement.likes - 1
                      : post.engagement.likes + 1,
                  },
                };
              case 'bookmark':
                return {
                  ...post,
                  isBookmarked: !post.isBookmarked,
                  engagement: {
                    ...post.engagement,
                    bookmarks: post.isBookmarked
                      ? post.engagement.bookmarks - 1
                      : post.engagement.bookmarks + 1,
                  },
                };
              case 'share':
                return {
                  ...post,
                  engagement: {
                    ...post.engagement,
                    shares: post.engagement.shares + 1,
                  },
                };
            }
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error handling engagement:', error);
    }
  };

  const createPost = async () => {
    if (!newPostContent.trim()) return;

    try {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent }),
      });

      if (response.ok) {
        setNewPostContent('');
        setShowNewPost(false);
        loadFeedData();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - postTime.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Mock data
  const mockPosts: SocialPost[] = [
    {
      id: '1',
      author: {
        id: 'user1',
        username: 'alex_dev',
        displayName: 'Alex Developer',
        avatar: '/api/placeholder/40/40',
        verified: true,
      },
      content: {
        text: 'Just built an amazing AI-powered feature for our social platform! The engagement analytics are mind-blowing 🤯 #AI #SocialTech #Innovation',
        hashtags: ['AI', 'SocialTech', 'Innovation'],
        mentions: [],
      },
      engagement: {
        likes: 234,
        comments: 45,
        shares: 23,
        bookmarks: 67,
        views: 1200,
      },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isLiked: false,
      isBookmarked: true,
      aiGenerated: false,
      communityId: 'tech-innovators',
    },
    {
      id: '2',
      author: {
        id: 'ai-bot',
        username: 'sociai_bot',
        displayName: 'SociAI Assistant',
        avatar: '/api/placeholder/40/40',
        verified: true,
      },
      content: {
        text: "Here's your daily AI-generated insight: Communities with active engagement show 3x higher retention rates. Focus on meaningful interactions! 📊✨",
        hashtags: ['AIInsights', 'CommunityBuilding'],
        mentions: [],
      },
      engagement: {
        likes: 89,
        comments: 12,
        shares: 8,
        bookmarks: 34,
        views: 456,
      },
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isLiked: true,
      isBookmarked: false,
      aiGenerated: true,
    },
  ];

  const mockCommunities: Community[] = [
    {
      id: 'tech-innovators',
      name: 'Tech Innovators',
      description: 'AI and technology enthusiasts',
      memberCount: 12500,
      icon: '🚀',
      isJoined: true,
    },
    {
      id: 'creative-minds',
      name: 'Creative Minds',
      description: 'Artists, designers, and creators',
      memberCount: 8900,
      icon: '🎨',
      isJoined: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Communities Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Your Communities
            </h3>
            <div className="space-y-3">
              {communities.map(community => (
                <div
                  key={community.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{community.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {community.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {community.memberCount.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                  <button
                    className={`text-xs px-2 py-1 rounded-full ${
                      community.isJoined
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {community.isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Trending Topics
            </h3>
            <div className="space-y-2">
              {[
                '#AIInnovation',
                '#SocialTech',
                '#CommunityBuilding',
                '#TechTrends',
              ].map(tag => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    {tag}
                  </span>
                  <span className="text-xs text-gray-500">12.5K posts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3">
          {/* Feed Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All Posts' },
                  { key: 'following', label: 'Following' },
                  { key: 'trending', label: 'Trending' },
                  { key: 'ai', label: 'AI Generated' },
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === filter.key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowNewPost(!showNewPost)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                New Post
              </button>
            </div>
          </div>

          {/* New Post Creator */}
          {showNewPost && (
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <textarea
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="What's on your mind? Share your thoughts with the community..."
                className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    📷
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    🎥
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    📊
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createPost}
                    disabled={!newPostContent.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts Feed */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading feed...</p>
              </div>
            ) : (
              posts.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm border p-6"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">
                          {post.author.displayName}
                        </h4>
                        {post.author.verified && (
                          <span className="text-blue-500">✓</span>
                        )}
                        <span className="text-gray-500">
                          @{post.author.username}
                        </span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-500 text-sm flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatTimeAgo(post.timestamp)}
                        </span>
                        {post.aiGenerated && (
                          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center">
                            <SparklesIcon className="h-3 w-3 mr-1" />
                            AI
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <p className="text-gray-900 leading-relaxed">
                          {post.content.text}
                        </p>

                        {post.content.hashtags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {post.content.hashtags.map(tag => (
                              <span
                                key={tag}
                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => handleEngagement(post.id, 'like')}
                            className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            {post.isLiked ? (
                              <HeartSolidIcon className="h-5 w-5 text-red-500" />
                            ) : (
                              <HeartIcon className="h-5 w-5" />
                            )}
                            <span className="text-sm">
                              {post.engagement.likes}
                            </span>
                          </button>

                          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                            <ChatBubbleLeftRightIcon className="h-5 w-5" />
                            <span className="text-sm">
                              {post.engagement.comments}
                            </span>
                          </button>

                          <button
                            onClick={() => handleEngagement(post.id, 'share')}
                            className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                          >
                            <ShareIcon className="h-5 w-5" />
                            <span className="text-sm">
                              {post.engagement.shares}
                            </span>
                          </button>

                          <div className="flex items-center space-x-2 text-gray-500">
                            <EyeIcon className="h-5 w-5" />
                            <span className="text-sm">
                              {post.engagement.views}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleEngagement(post.id, 'bookmark')}
                          className="text-gray-500 hover:text-yellow-500 transition-colors"
                        >
                          {post.isBookmarked ? (
                            <BookmarkSolidIcon className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <BookmarkIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
