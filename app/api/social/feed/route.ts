import { NextRequest, NextResponse } from 'next/server';

// Mock data for social feed
const mockPosts = [
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    // Filter posts based on the filter parameter
    let filteredPosts = mockPosts;

    switch (filter) {
      case 'following':
        filteredPosts = mockPosts.filter(post => post.author.id !== 'ai-bot');
        break;
      case 'trending':
        filteredPosts = mockPosts.filter(post => post.engagement.likes > 100);
        break;
      case 'ai':
        filteredPosts = mockPosts.filter(post => post.aiGenerated);
        break;
      default:
        filteredPosts = mockPosts;
    }

    return NextResponse.json({
      success: true,
      posts: filteredPosts,
      total: filteredPosts.length,
    });
  } catch (error) {
    console.error('Error fetching social feed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social feed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, hashtags = [], mentions = [] } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Create new post
    const newPost = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        username: 'current_user',
        displayName: 'Current User',
        avatar: '/api/placeholder/40/40',
        verified: false,
      },
      content: {
        text: content,
        hashtags,
        mentions,
      },
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarks: 0,
        views: 0,
      },
      timestamp: new Date().toISOString(),
      isLiked: false,
      isBookmarked: false,
      aiGenerated: false,
    };

    // In a real application, you would save this to a database
    mockPosts.unshift(newPost);

    return NextResponse.json({
      success: true,
      post: newPost,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
