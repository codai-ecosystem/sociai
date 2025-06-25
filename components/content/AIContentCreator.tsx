'use client';

import React, { useState, useEffect } from 'react';
import {
  PencilSquareIcon,
  PhotoIcon,
  VideoCameraIcon,
  SparklesIcon,
  ChartBarIcon,
  ClockIcon,
  HashtagIcon,
  UserIcon,
  LightBulbIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  category: 'trending' | 'personal' | 'professional' | 'creative';
  estimatedEngagement: number;
  hashtags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'post' | 'thread' | 'poll' | 'story';
  template: string;
  variables: string[];
}

interface ContentAnalytics {
  bestPostingTimes: string[];
  topHashtags: string[];
  engagementTrends: {
    day: string;
    engagement: number;
  }[];
  contentPerformance: {
    type: string;
    avgEngagement: number;
  }[];
}

export default function AIContentCreator() {
  const [activeTab, setActiveTab] = useState<
    'create' | 'ideas' | 'templates' | 'analytics'
  >('create');
  const [contentText, setContentText] = useState('');
  const [selectedTone, setSelectedTone] = useState<
    'professional' | 'casual' | 'creative' | 'educational'
  >('casual');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [analytics, setAnalytics] = useState<ContentAnalytics | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async () => {
    setLoading(true);
    try {
      const [ideasRes, templatesRes, analyticsRes] = await Promise.all([
        fetch('/api/social/content/ideas'),
        fetch('/api/social/content/templates'),
        fetch('/api/social/content/analytics'),
      ]);

      const ideasData = await ideasRes.json();
      const templatesData = await templatesRes.json();
      const analyticsData = await analyticsRes.json();

      setContentIdeas(ideasData.ideas || mockContentIdeas);
      setTemplates(templatesData.templates || mockTemplates);
      setAnalytics(analyticsData.analytics || mockAnalytics);
    } catch (error) {
      console.error('Error loading content data:', error);
      setContentIdeas(mockContentIdeas);
      setTemplates(mockTemplates);
      setAnalytics(mockAnalytics);
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/social/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          tone: selectedTone,
          hashtags: selectedHashtags,
        }),
      });

      const data = await response.json();
      setContentText(
        data.content ||
          `AI-generated content based on: "${prompt}" with ${selectedTone} tone. This is a demo response that would be replaced with actual AI generation.`
      );
    } catch (error) {
      console.error('Error generating content:', error);
      setContentText(
        `AI-generated content based on: "${prompt}" with ${selectedTone} tone. This is a demo response that would be replaced with actual AI generation.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const useTemplate = (template: ContentTemplate) => {
    let content = template.template;
    template.variables.forEach(variable => {
      const placeholder = `{${variable}}`;
      const value = prompt(`Enter value for ${variable}:`);
      if (value) {
        content = content.replace(placeholder, value);
      }
    });
    setContentText(content);
    setActiveTab('create');
  };

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtag)
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  // Mock data
  const mockContentIdeas: ContentIdea[] = [
    {
      id: '1',
      title: 'Share your AI automation win',
      description:
        'Tell your audience about a recent task you automated with AI',
      category: 'professional',
      estimatedEngagement: 85,
      hashtags: ['AI', 'Automation', 'Productivity'],
      difficulty: 'easy',
    },
    {
      id: '2',
      title: 'Behind-the-scenes development process',
      description: 'Show your coding workflow and development environment',
      category: 'professional',
      estimatedEngagement: 92,
      hashtags: ['Development', 'CodingLife', 'BehindTheScenes'],
      difficulty: 'medium',
    },
    {
      id: '3',
      title: 'Tech trend prediction for 2024',
      description: 'Share your thoughts on emerging technologies',
      category: 'trending',
      estimatedEngagement: 78,
      hashtags: ['TechTrends', 'Future', 'Innovation'],
      difficulty: 'hard',
    },
  ];

  const mockTemplates: ContentTemplate[] = [
    {
      id: '1',
      name: 'Achievement Announcement',
      description: 'Celebrate a milestone or achievement',
      type: 'post',
      template:
        '🎉 Excited to share that {achievement}! \n\nThis journey taught me {lesson}. \n\nNext up: {next_goal}\n\n#Achievement #Growth #TechLife',
      variables: ['achievement', 'lesson', 'next_goal'],
    },
    {
      id: '2',
      name: 'Learning Thread',
      description: 'Share knowledge in a thread format',
      type: 'thread',
      template:
        '🧵 Thread: {topic} \n\n1/ {point_1}\n\n2/ {point_2}\n\n3/ {point_3}\n\n4/ {conclusion}\n\n#Learning #Tech #Knowledge',
      variables: ['topic', 'point_1', 'point_2', 'point_3', 'conclusion'],
    },
    {
      id: '3',
      name: 'Question Poll',
      description: 'Engage audience with a question',
      type: 'poll',
      template:
        '🤔 Quick question for my network:\n\n{question}\n\nA) {option_a}\nB) {option_b}\nC) {option_c}\n\nDrop your thoughts below! 👇\n\n#Community #Discussion',
      variables: ['question', 'option_a', 'option_b', 'option_c'],
    },
  ];

  const mockAnalytics: ContentAnalytics = {
    bestPostingTimes: ['9:00 AM', '1:00 PM', '6:00 PM'],
    topHashtags: [
      '#AI',
      '#TechLife',
      '#Development',
      '#Innovation',
      '#Learning',
    ],
    engagementTrends: [
      { day: 'Mon', engagement: 65 },
      { day: 'Tue', engagement: 78 },
      { day: 'Wed', engagement: 92 },
      { day: 'Thu', engagement: 87 },
      { day: 'Fri', engagement: 95 },
      { day: 'Sat', engagement: 72 },
      { day: 'Sun', engagement: 68 },
    ],
    contentPerformance: [
      { type: 'Text Posts', avgEngagement: 85 },
      { type: 'Images', avgEngagement: 120 },
      { type: 'Videos', avgEngagement: 180 },
      { type: 'Polls', avgEngagement: 95 },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI Content Creator
        </h2>
        <p className="text-gray-600">
          Create engaging social content with AI assistance
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'create', label: 'Create Content', icon: PencilSquareIcon },
            { key: 'ideas', label: 'Content Ideas', icon: LightBulbIcon },
            { key: 'templates', label: 'Templates', icon: DocumentTextIcon },
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

      {/* Content Creator */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Content
            </h3>

            {/* Content Input */}
            <div className="mb-4">
              <textarea
                value={contentText}
                onChange={e => setContentText(e.target.value)}
                placeholder="Write your content here or use AI to generate it..."
                className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tone Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Tone
              </label>
              <div className="flex space-x-2">
                {[
                  { key: 'professional', label: 'Professional' },
                  { key: 'casual', label: 'Casual' },
                  { key: 'creative', label: 'Creative' },
                  { key: 'educational', label: 'Educational' },
                ].map(tone => (
                  <button
                    key={tone.key}
                    onClick={() => setSelectedTone(tone.key as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTone === tone.key
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hashtag Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suggested Hashtags
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'AI',
                  'TechLife',
                  'Development',
                  'Innovation',
                  'Learning',
                  'Growth',
                  'Community',
                  'Insights',
                ].map(hashtag => (
                  <button
                    key={hashtag}
                    onClick={() => toggleHashtag(hashtag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedHashtags.includes(hashtag)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    #{hashtag}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generation */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Content Generation
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Describe what you want to post about..."
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      generateContent((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector(
                      'input[placeholder="Describe what you want to post about..."]'
                    ) as HTMLInputElement;
                    generateContent(input.value);
                  }}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <PhotoIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <VideoCameraIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <HashtagIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Save Draft
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Ideas */}
      {activeTab === 'ideas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              AI-Generated Content Ideas
            </h3>
            <button
              onClick={loadContentData}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              Refresh Ideas
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading content ideas...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {contentIdeas.map(idea => (
                <div
                  key={idea.id}
                  className="bg-white rounded-lg shadow-sm border p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {idea.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {idea.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          idea.difficulty === 'easy'
                            ? 'bg-green-100 text-green-700'
                            : idea.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {idea.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">
                        {idea.estimatedEngagement}% engagement
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {idea.hashtags.map(hashtag => (
                        <span
                          key={hashtag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => generateContent(idea.description)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Use Idea
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Templates */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Content Templates
          </h3>

          <div className="grid gap-4">
            {templates.map(template => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow-sm border p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {template.name}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {template.description}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.type === 'post'
                        ? 'bg-blue-100 text-blue-700'
                        : template.type === 'thread'
                          ? 'bg-green-100 text-green-700'
                          : template.type === 'poll'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {template.type}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {template.template}
                  </pre>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map(variable => (
                      <span
                        key={variable}
                        className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => useTemplate(template)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Use Template
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
            Content Analytics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Posting Times */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Best Posting Times
              </h4>
              <div className="space-y-2">
                {analytics.bestPostingTimes.map((time, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700">{time}</span>
                    <span className="text-sm text-green-600 font-medium">
                      Optimal
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Hashtags */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <HashtagIcon className="h-5 w-5 mr-2" />
                Top Performing Hashtags
              </h4>
              <div className="flex flex-wrap gap-2">
                {analytics.topHashtags.map(hashtag => (
                  <span
                    key={hashtag}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>

            {/* Engagement Trends */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Weekly Engagement Trends
              </h4>
              <div className="space-y-2">
                {analytics.engagementTrends.map(trend => (
                  <div
                    key={trend.day}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-700">{trend.day}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${trend.engagement}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {trend.engagement}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Performance */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Content Type Performance
              </h4>
              <div className="space-y-2">
                {analytics.contentPerformance.map(perf => (
                  <div
                    key={perf.type}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-700">{perf.type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(perf.avgEngagement, 200) / 2}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {perf.avgEngagement}
                      </span>
                    </div>
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
