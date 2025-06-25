'use client';

import React, { useState } from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  PencilSquareIcon,
  BellIcon,
  Cog6ToothIcon,
  SparklesIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import SocialFeedManager from '../social/SocialFeedManager';
import AIContentCreator from '../content/AIContentCreator';
import CommunityBuilder from '../community/CommunityBuilder';
import SocialAnalytics from '../analytics/SocialAnalytics';
import RealTimeMessaging from '../messaging/RealTimeMessaging';

interface QuickStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
}

export default function SociAIDashboard() {
  const [activeTab, setActiveTab] = useState<
    'feed' | 'create' | 'communities' | 'messaging' | 'analytics'
  >('feed');
  const [notifications, setNotifications] = useState(12);

  const quickStats: QuickStat[] = [
    {
      label: 'Total Followers',
      value: '12.5K',
      change: '+12.5%',
      trend: 'up',
      icon: UserGroupIcon,
    },
    {
      label: 'Engagement Rate',
      value: '8.3%',
      change: '+2.1%',
      trend: 'up',
      icon: ChartBarIcon,
    },
    {
      label: 'Posts This Month',
      value: '24',
      change: '+4',
      trend: 'up',
      icon: PencilSquareIcon,
    },
    {
      label: 'Active Communities',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: UserGroupIcon,
    },
  ];

  const navigationItems = [
    { key: 'feed', label: 'Social Feed', icon: HomeIcon },
    { key: 'create', label: 'Create Content', icon: PencilSquareIcon },
    { key: 'communities', label: 'Communities', icon: UserGroupIcon },
    { key: 'messaging', label: 'Messaging', icon: ChatBubbleLeftRightIcon },
    { key: 'analytics', label: 'Analytics', icon: ChartBarIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <SocialFeedManager />;
      case 'create':
        return <AIContentCreator />;
      case 'communities':
        return <CommunityBuilder />;
      case 'messaging':
        return <RealTimeMessaging />;
      case 'analytics':
        return <SocialAnalytics />;
      default:
        return <SocialFeedManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">SociAI</h1>
                  <p className="text-sm text-gray-500">
                    AI-Native Social Platform
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center space-x-6">
                {quickStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <stat.icon className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm font-semibold text-gray-900">
                        {stat.value}
                      </span>
                      <span
                        className={`text-xs ml-1 ${
                          stat.trend === 'up'
                            ? 'text-green-600'
                            : stat.trend === 'down'
                              ? 'text-red-600'
                              : 'text-gray-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <BellIcon className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  )}
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Cog6ToothIcon className="h-5 w-5" />
                </button>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <nav className="space-y-2">
                {navigationItems.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key as any)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === item.key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* AI Assistant */}
            <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
              <div className="flex items-center mb-2">
                <SparklesIcon className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <p className="text-sm opacity-90 mb-3">
                Get personalized content suggestions and engagement insights
              </p>
              <button className="bg-white text-purple-600 text-sm font-medium px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors">
                Ask AI
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <PencilSquareIcon className="h-4 w-4 mr-2" />
                  New Post
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  Join Community
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <MegaphoneIcon className="h-4 w-4 mr-2" />
                  Create Event
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
