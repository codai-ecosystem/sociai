import { NextRequest, NextResponse } from 'next/server';

// Mock data for communities
const mockCommunities = [
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
    description: 'A private community for creative professionals and artists.',
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const joined = searchParams.get('joined');

    let filteredCommunities = mockCommunities;

    if (category && category !== 'all') {
      filteredCommunities = filteredCommunities.filter(
        community => community.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (joined === 'true') {
      filteredCommunities = filteredCommunities.filter(
        community => community.isJoined
      );
    }

    return NextResponse.json({
      success: true,
      communities: filteredCommunities,
      total: filteredCommunities.length,
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch communities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      category,
      isPrivate = false,
      icon = '👥',
    } = body;

    if (!name?.trim() || !description?.trim() || !category?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, description, and category are required',
        },
        { status: 400 }
      );
    }

    // Create new community
    const newCommunity = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      memberCount: 1,
      icon,
      category: category.trim(),
      isPrivate,
      isJoined: true,
      role: 'owner',
      activity: {
        postsThisWeek: 0,
        engagementRate: 0,
        activeMembers: 1,
      },
      rules: [
        'Be respectful and constructive',
        'Stay on topic',
        'No spam or inappropriate content',
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    // In a real application, you would save this to a database
    mockCommunities.unshift(newCommunity);

    return NextResponse.json({
      success: true,
      community: newCommunity,
      message: 'Community created successfully',
    });
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create community' },
      { status: 500 }
    );
  }
}
