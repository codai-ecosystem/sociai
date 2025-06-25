import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, tone = 'casual', hashtags = [] } = body;

    if (!prompt?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Simulate AI content generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate content based on tone and prompt
    let generatedContent = '';

    switch (tone) {
      case 'professional':
        generatedContent = `I'm excited to share insights on ${prompt}. Through careful analysis and industry research, I've discovered key strategies that can significantly impact business outcomes. Here are my top findings:\n\n1. Strategic implementation drives results\n2. Data-driven decisions create competitive advantages\n3. Continuous innovation ensures market leadership\n\nWhat are your thoughts on this approach?`;
        break;

      case 'creative':
        generatedContent = `🎨 Let me paint you a picture about ${prompt}... \n\nImagine a world where creativity meets innovation! ✨ I've been exploring this fascinating topic and here's what sparked my imagination:\n\n🌟 Every challenge is a canvas waiting for a masterpiece\n🚀 Ideas flow like rivers, creating new landscapes of possibility\n💡 The magic happens when we dare to think differently\n\nWhat creative solutions have you discovered lately? Share your artistic journey! 🎭`;
        break;

      case 'educational':
        generatedContent = `📚 Learning Series: Understanding ${prompt}\n\nToday, let's dive deep into this important topic. Here's what you need to know:\n\n🔍 Key Concepts:\n• Fundamental principles that matter\n• Real-world applications and examples\n• Common misconceptions to avoid\n\n💡 Quick Tip: Start with the basics and build your understanding step by step.\n\n🤔 Discussion Question: How has this knowledge impacted your work or projects?\n\nDrop your questions below - I love helping others learn! 📖`;
        break;

      default: // casual
        generatedContent = `Hey everyone! 👋\n\nI've been thinking about ${prompt} lately and wanted to share some thoughts with you all.\n\nHonestly, this stuff is pretty amazing when you really dive into it! Here's what I've learned:\n\n✅ It's more accessible than people think\n✅ The potential impact is huge\n✅ Getting started is easier than expected\n\nAnyone else exploring this? Would love to hear your experiences! Drop a comment below 👇\n\n#Learning #Growth #Community`;
    }

    // Add hashtags if provided
    if (hashtags.length > 0) {
      const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
      generatedContent += `\n\n${hashtagString}`;
    }

    return NextResponse.json({
      success: true,
      content: generatedContent,
      metadata: {
        prompt,
        tone,
        hashtags,
        wordCount: generatedContent.split(' ').length,
        estimatedReadTime:
          Math.ceil(generatedContent.split(' ').length / 200) + ' min',
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
