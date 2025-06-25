import { NextRequest, NextResponse } from 'next/server';

// Mock analytics data
const mockMetrics = {
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

const mockPostAnalytics = [
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

const mockAudienceInsights = {
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

const mockEngagementTrends = {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    const type = searchParams.get('type');

    // Adjust data based on time range
    let adjustedMetrics = { ...mockMetrics };
    let adjustedPosts = [...mockPostAnalytics];
    let adjustedInsights = { ...mockAudienceInsights };
    let adjustedTrends = { ...mockEngagementTrends };

    switch (range) {
      case '7d':
        adjustedMetrics.totalPosts = Math.floor(mockMetrics.totalPosts * 0.25);
        adjustedMetrics.totalEngagement = Math.floor(
          mockMetrics.totalEngagement * 0.3
        );
        adjustedPosts = mockPostAnalytics.slice(0, 5);
        break;
      case '90d':
        adjustedMetrics.totalPosts = Math.floor(mockMetrics.totalPosts * 3);
        adjustedMetrics.totalEngagement = Math.floor(
          mockMetrics.totalEngagement * 2.8
        );
        break;
    }

    // Return specific data type if requested
    switch (type) {
      case 'metrics':
        return NextResponse.json({
          success: true,
          metrics: adjustedMetrics,
        });
      case 'posts':
        return NextResponse.json({
          success: true,
          posts: adjustedPosts,
        });
      case 'audience':
        return NextResponse.json({
          success: true,
          insights: adjustedInsights,
        });
      case 'trends':
        return NextResponse.json({
          success: true,
          trends: adjustedTrends,
        });
      default:
        return NextResponse.json({
          success: true,
          data: {
            metrics: adjustedMetrics,
            posts: adjustedPosts,
            insights: adjustedInsights,
            trends: adjustedTrends,
          },
        });
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
