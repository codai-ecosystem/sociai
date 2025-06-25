import { NextRequest, NextResponse } from 'next/server';

// Mock data for content ideas
const mockContentIdeas = [
  {
    id: '1',
    title: 'Share your AI automation win',
    description: 'Tell your audience about a recent task you automated with AI',
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
  {
    id: '4',
    title: 'Quick productivity tip',
    description: 'Share a simple tip that improved your daily workflow',
    category: 'personal',
    estimatedEngagement: 67,
    hashtags: ['Productivity', 'Tips', 'Workflow'],
    difficulty: 'easy',
  },
  {
    id: '5',
    title: 'Creative problem solving story',
    description:
      'Tell a story about how you creatively solved a challenging problem',
    category: 'creative',
    estimatedEngagement: 89,
    hashtags: ['ProblemSolving', 'Innovation', 'Creativity'],
    difficulty: 'medium',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    let filteredIdeas = mockContentIdeas;

    if (category && category !== 'all') {
      filteredIdeas = filteredIdeas.filter(idea => idea.category === category);
    }

    if (difficulty && difficulty !== 'all') {
      filteredIdeas = filteredIdeas.filter(
        idea => idea.difficulty === difficulty
      );
    }

    // Simulate AI regeneration with some randomization
    const refreshedIdeas = filteredIdeas.map(idea => ({
      ...idea,
      estimatedEngagement: Math.max(
        60,
        Math.min(95, idea.estimatedEngagement + (Math.random() * 10 - 5))
      ),
    }));

    return NextResponse.json({
      success: true,
      ideas: refreshedIdeas,
      total: refreshedIdeas.length,
    });
  } catch (error) {
    console.error('Error fetching content ideas:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content ideas' },
      { status: 500 }
    );
  }
}
