'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  EyeIcon,
  TrendingUpIcon,
  CalendarIcon,
  ClockIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';

interface SocialMetrics {
  totalFollowers: number;
  totalPosts: number;
  totalEngagement: number;
  totalReach: number;
  weeklyGrowth: {
    followers: number;
    engagement: number;
    reach: number;
  };
}

interface PostAnalytics {
  id: string;
  content: string;
  timestamp: string;
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    engagementRate: number;
  };
  performance: 'high' | 'medium' | 'low';
}

interface AudienceInsights {
  demographics: {
    age: { range: string; percentage: number }[];
    location: { country: string; percentage: number }[];
    interests: { interest: string; percentage: number }[];
  };
  activity: {
    bestTimes: string[];
    bestDays: string[];
    peakHours: { hour: number; engagement: number }[];
  };
}

interface EngagementTrends {
  daily: { date: string; engagement: number; reach: number }[];
  hashtags: {
    tag: string;
    performance: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  contentTypes: { type: string; avgEngagement: number; count: number }[];
}

export default function SocialAnalytics() {
  const [metrics, setMetrics] = useState<SocialMetrics | null>(null);
  const [postAnalytics, setPostAnalytics] = useState<PostAnalytics[]>([]);
  const [audienceInsights, setAudienceInsights] =
    useState<AudienceInsights | null>(null);
  const [engagementTrends, setEngagementTrends] =
    useState<EngagementTrends | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'posts' | 'audience' | 'trends'
  >('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [metricsRes, postsRes, audienceRes, trendsRes] = await Promise.all([
        fetch(`/api/social/analytics/metrics?range=${timeRange}`),
        fetch(`/api/social/analytics/posts?range=${timeRange}`),
        fetch(`/api/social/analytics/audience?range=${timeRange}`),
        fetch(`/api/social/analytics/trends?range=${timeRange}`),
      ]);

      const metricsData = await metricsRes.json();
      const postsData = await postsRes.json();
      const audienceData = await audienceRes.json();
      const trendsData = await trendsRes.json();

      setMetrics(metricsData.metrics || mockMetrics);
      setPostAnalytics(postsData.posts || mockPostAnalytics);
      setAudienceInsights(audienceData.insights || mockAudienceInsights);
      setEngagementTrends(trendsData.trends || mockEngagementTrends);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setMetrics(mockMetrics);
      setPostAnalytics(mockPostAnalytics);
      setAudienceInsights(mockAudienceInsights);
      setEngagementTrends(mockEngagementTrends);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
    }
  };

  // Mock data
  const mockMetrics: SocialMetrics = {
    totalFollowers: 12540,
    totalPosts: 234,
    totalEngagement: 45600,
    totalReach: 120000,
    weeklyGrowth: {
      followers: 12.5,
      engagement: 18.2,
      reach: 8.7,
    },
  };

  const mockPostAnalytics: PostAnalytics[] = [
    {
      id: '1',
      content:
        'Just built an amazing AI-powered feature for our social platform! The engagement analytics are mind-blowing 🤯',
      timestamp: '2024-01-20T10:00:00Z',
      metrics: {
        likes: 234,
        comments: 45,
        shares: 23,
        views: 1200,
        engagementRate: 25.8,
      },
      performance: 'high',
    },
    {
      id: '2',
      content:
        "Here's your daily AI-generated insight: Communities with active engagement show 3x higher retention rates.",
      timestamp: '2024-01-19T14:30:00Z',
      metrics: {
        likes: 89,
        comments: 12,
        shares: 8,
        views: 456,
        engagementRate: 23.9,
      },
      performance: 'high',
    },
    {
      id: '3',
      content:
        "Working on something cool today. Can't wait to share it with you all!",
      timestamp: '2024-01-18T09:15:00Z',
      metrics: {
        likes: 45,
        comments: 6,
        shares: 2,
        views: 234,
        engagementRate: 22.6,
      },
      performance: 'medium',
    },
  ];

  const mockAudienceInsights: AudienceInsights = {
    demographics: {
      age: [
        { range: '18-24', percentage: 25 },
        { range: '25-34', percentage: 40 },
        { range: '35-44', percentage: 22 },
        { range: '45-54', percentage: 10 },
        { range: '55+', percentage: 3 },
      ],
      location: [
        { country: 'United States', percentage: 35 },
        { country: 'United Kingdom', percentage: 18 },
        { country: 'Canada', percentage: 12 },
        { country: 'Germany', percentage: 8 },
        { country: 'Australia', percentage: 7 },
      ],
      interests: [
        { interest: 'Technology', percentage: 45 },
        { interest: 'AI & Machine Learning', percentage: 38 },
        { interest: 'Software Development', percentage: 32 },
        { interest: 'Innovation', percentage: 28 },
        { interest: 'Startups', percentage: 22 },
      ],
    },
    activity: {
      bestTimes: ['9:00 AM', '1:00 PM', '6:00 PM'],
      bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
      peakHours: [
        { hour: 9, engagement: 85 },
        { hour: 13, engagement: 92 },
        { hour: 18, engagement: 78 },
        { hour: 20, engagement: 65 },
      ],
    },
  };

  const mockEngagementTrends: EngagementTrends = {
    daily: [
      { date: '2024-01-14', engagement: 78, reach: 1200 },
      { date: '2024-01-15', engagement: 85, reach: 1350 },
      { date: '2024-01-16', engagement: 92, reach: 1580 },
      { date: '2024-01-17', engagement: 88, reach: 1420 },
      { date: '2024-01-18', engagement: 95, reach: 1680 },
      { date: '2024-01-19', engagement: 89, reach: 1520 },
      { date: '2024-01-20', engagement: 102, reach: 1750 },
    ],
    hashtags: [
      { tag: '#AI', performance: 95, trend: 'up' },
      { tag: '#TechLife', performance: 87, trend: 'stable' },
      { tag: '#Innovation', performance: 82, trend: 'up' },
      { tag: '#Development', performance: 78, trend: 'down' },
      { tag: '#SocialTech', performance: 92, trend: 'up' },
    ],
    contentTypes: [
      { type: 'Text Posts', avgEngagement: 85, count: 120 },
      { type: 'Images', avgEngagement: 125, count: 80 },
      { type: 'Videos', avgEngagement: 180, count: 25 },
      { type: 'Polls', avgEngagement: 95, count: 9 },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Social Analytics
            </h2>
            <p className="text-gray-600">
              Track and analyze your social media performance
            </p>
          </div>
          <div className="flex space-x-2">
            {[
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: '90d', label: '90 Days' },
            ].map(range => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: ChartBarIcon },
            {
              key: 'posts',
              label: 'Post Performance',
              icon: ChatBubbleLeftRightIcon,
            },
            { key: 'audience', label: 'Audience Insights', icon: UsersIcon },
            { key: 'trends', label: 'Engagement Trends', icon: TrendingUpIcon },
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

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Overview */}
          {activeTab === 'overview' && metrics && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UsersIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Followers
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(metrics.totalFollowers)}
                      </p>
                      <p className="text-sm text-green-600">
                        +{metrics.weeklyGrowth.followers}% this week
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <HeartIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Engagement
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(metrics.totalEngagement)}
                      </p>
                      <p className="text-sm text-green-600">
                        +{metrics.weeklyGrowth.engagement}% this week
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <EyeIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Reach</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(metrics.totalReach)}
                      </p>
                      <p className="text-sm text-green-600">
                        +{metrics.weeklyGrowth.reach}% this week
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Posts</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metrics.totalPosts}
                      </p>
                      <p className="text-sm text-gray-500">Total published</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Insights */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">
                      Best Performing Content
                    </h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Videos get 180% more engagement than text posts
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">
                      Optimal Posting Time
                    </h4>
                    <p className="text-green-700 text-sm mt-1">
                      1:00 PM on Wednesdays shows highest engagement
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">
                      Growing Hashtag
                    </h4>
                    <p className="text-purple-700 text-sm mt-1">
                      #AI trending up 95% this month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Post Performance */}
          {activeTab === 'posts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Performing Posts
              </h3>

              <div className="space-y-4">
                {postAnalytics.map(post => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-sm border p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">{post.content}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {new Date(post.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(post.performance)}`}
                      >
                        {post.performance} performance
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <HeartIcon className="h-4 w-4 text-red-500 mr-1" />
                          <span className="font-semibold">
                            {post.metrics.likes}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Likes</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="font-semibold">
                            {post.metrics.comments}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Comments</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <ShareIcon className="h-4 w-4 text-green-500 mr-1" />
                          <span className="font-semibold">
                            {post.metrics.shares}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Shares</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <EyeIcon className="h-4 w-4 text-purple-500 mr-1" />
                          <span className="font-semibold">
                            {post.metrics.views}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Views</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUpIcon className="h-4 w-4 text-orange-500 mr-1" />
                          <span className="font-semibold">
                            {post.metrics.engagementRate}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Engagement</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audience Insights */}
          {activeTab === 'audience' && audienceInsights && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Audience Insights
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demographics */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Age Distribution
                    </h4>
                    <div className="space-y-3">
                      {audienceInsights.demographics.age.map(age => (
                        <div
                          key={age.range}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-700">{age.range}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${age.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-10">
                              {age.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Top Locations
                    </h4>
                    <div className="space-y-3">
                      {audienceInsights.demographics.location.map(location => (
                        <div
                          key={location.country}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-700">
                            {location.country}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${location.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-10">
                              {location.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activity & Interests */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Peak Activity Times
                    </h4>
                    <div className="space-y-3">
                      {audienceInsights.activity.peakHours.map(hour => (
                        <div
                          key={hour.hour}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-700">{hour.hour}:00</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${hour.engagement}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-10">
                              {hour.engagement}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Top Interests
                    </h4>
                    <div className="space-y-3">
                      {audienceInsights.demographics.interests.map(interest => (
                        <div
                          key={interest.interest}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-700">
                            {interest.interest}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ width: `${interest.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-10">
                              {interest.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Trends */}
          {activeTab === 'trends' && engagementTrends && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Engagement Trends
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Hashtag Performance
                  </h4>
                  <div className="space-y-3">
                    {engagementTrends.hashtags.map(hashtag => (
                      <div
                        key={hashtag.tag}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <HashtagIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-700">{hashtag.tag}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {hashtag.performance}%
                          </span>
                          <span className="text-lg">
                            {getTrendIcon(hashtag.trend)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Content Type Performance
                  </h4>
                  <div className="space-y-3">
                    {engagementTrends.contentTypes.map(type => (
                      <div
                        key={type.type}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span className="text-gray-700">{type.type}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({type.count} posts)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(type.avgEngagement, 200) / 2}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-10">
                            {type.avgEngagement}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Daily Trends Chart */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Daily Engagement & Reach
                </h4>
                <div className="h-64 flex items-end space-x-2">
                  {engagementTrends.daily.map((day, index) => (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-blue-100 rounded-t-lg relative"
                        style={{ height: `${day.engagement}%` }}
                      >
                        <div
                          className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg"
                          style={{ height: `${(day.engagement / 120) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Engagement</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
