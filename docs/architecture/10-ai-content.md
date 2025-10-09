# Tax Genius Platform - AI Content Generation

**Version:** 3.0 FINAL
**Date:** October 9, 2025
**Status:** Active - Single Source of Truth
**Part:** 10 of 11

[↑ Back to Architecture Index](./README.md)

---

## 14. AI Content Generation Architecture

### 14.1 AI Service Integration

```typescript
// src/lib/services/ai-content.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateLandingPageContent(
  city: string,
  keywords: string[]
): Promise<LandingPageContent> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Generate SEO-optimized content for a tax preparation landing page.

    Target Location: ${city}
    Keywords: ${keywords.join(', ')}

    Generate the following in JSON format:
    1. Page title (60 chars max)
    2. Meta description (155 chars max)
    3. H1 heading
    4. 3 paragraphs of content
    5. 5 Q&A pairs for an FAQ accordion

    Format: { title, metaDescription, h1, content, qa }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return JSON.parse(text);
}
```

---

## AI Service Implementation

### Complete AI Content Service

```typescript
// src/lib/services/ai-content.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface LandingPageContent {
  title: string;
  metaDescription: string;
  h1: string;
  content: string[];
  qa: Array<{ question: string; answer: string }>;
}

export interface GenerateContentOptions {
  city: string;
  state: string;
  keywords: string[];
  targetAudience?: string;
}

export async function generateLandingPageContent(
  options: GenerateContentOptions
): Promise<LandingPageContent> {
  const { city, state, keywords, targetAudience = 'general taxpayers' } = options;

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    You are an expert SEO content writer specializing in tax preparation services.

    Generate SEO-optimized content for a tax preparation landing page with the following details:

    **Location:** ${city}, ${state}
    **Target Audience:** ${targetAudience}
    **Keywords to include:** ${keywords.join(', ')}

    Generate the following in valid JSON format:

    {
      "title": "Compelling page title (60 chars max)",
      "metaDescription": "Engaging meta description (155 chars max)",
      "h1": "Main heading with location and service",
      "content": [
        "First paragraph introducing the service",
        "Second paragraph highlighting benefits",
        "Third paragraph with call to action"
      ],
      "qa": [
        {
          "question": "Common question 1",
          "answer": "Detailed answer 1"
        },
        {
          "question": "Common question 2",
          "answer": "Detailed answer 2"
        },
        {
          "question": "Common question 3",
          "answer": "Detailed answer 3"
        },
        {
          "question": "Common question 4",
          "answer": "Detailed answer 4"
        },
        {
          "question": "Common question 5",
          "answer": "Detailed answer 5"
        }
      ]
    }

    Guidelines:
    - Include the city name naturally in the content
    - Use keywords naturally without keyword stuffing
    - Write in a professional yet friendly tone
    - Focus on benefits and solutions
    - Make Q&A practical and helpful
    - Ensure all content is factually accurate
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;

    const content = JSON.parse(jsonText);

    return content;
  } catch (error) {
    console.error('AI content generation failed:', error);
    throw new Error('Failed to generate content');
  }
}

export async function generateBlogPost(topic: string, keywords: string[]): Promise<any> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Write a comprehensive blog post about: ${topic}

    Include these keywords naturally: ${keywords.join(', ')}

    Structure:
    - Engaging title
    - Introduction (2-3 paragraphs)
    - 3-4 main sections with subheadings
    - Conclusion with call to action
    - Meta description

    Return as JSON with: { title, metaDescription, introduction, sections, conclusion }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return JSON.parse(text);
}

export async function generateEmailTemplate(
  purpose: string,
  tone: 'formal' | 'friendly' | 'urgent'
): Promise<{ subject: string; body: string }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Generate an email template for: ${purpose}
    Tone: ${tone}

    Return as JSON: { subject: "email subject", body: "email body with placeholders like {{name}}" }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return JSON.parse(text);
}
```

---

## Admin Content Generator Interface

### API Endpoint

```typescript
// src/app/api/ai/generate-content/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { generateLandingPageContent } from '@/lib/services/ai-content.service';

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Verify user is admin
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (user?.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    const { city, state, keywords } = await request.json();

    // Generate content
    const content = await generateLandingPageContent({
      city,
      state,
      keywords,
    });

    // Create landing page record
    const slug = `${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`;

    const landingPage = await prisma.landingPage.create({
      data: {
        slug,
        city,
        state,
        title: content.title,
        metaDescription: content.metaDescription,
        content: {
          h1: content.h1,
          paragraphs: content.content,
        },
        qaAccordion: content.qa,
        published: false, // Require manual review before publishing
      },
    });

    return NextResponse.json({
      success: true,
      data: landingPage,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Admin UI Component

```typescript
// src/app/admin/content-generator/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContentGeneratorPage() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleGenerate() {
    setLoading(true);

    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          state,
          keywords: keywords.split(',').map((k) => k.trim()),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to generate content');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">AI Content Generator</h1>

      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="block mb-2 font-medium">City</label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Los Angeles"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">State</label>
          <Input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="CA"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Keywords (comma-separated)</label>
          <Textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="tax preparation, tax services, CPA"
            rows={3}
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Content'}
        </Button>
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold">Generated Content</h2>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Title</h3>
            <p>{result.title}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Meta Description</h3>
            <p>{result.metaDescription}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Content</h3>
            {result.content.paragraphs?.map((p, i) => (
              <p key={i} className="mb-2">
                {p}
              </p>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Q&A</h3>
            {result.qaAccordion?.map((qa, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold">{qa.question}</p>
                <p className="text-gray-600">{qa.answer}</p>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={() => window.open(`/locations/${result.slug}`, '_blank')}>
            Preview Page
          </Button>
        </div>
      )}
    </div>
  );
}
```

---

## Content Moderation

### Review Workflow

```typescript
// src/lib/content-moderation.ts
import { prisma } from '@/lib/db';

export async function submitForReview(landingPageId: string, reviewerId: string) {
  await prisma.landingPage.update({
    where: { id: landingPageId },
    data: {
      status: 'PENDING_REVIEW',
      reviewerId,
    },
  });
}

export async function approveContent(landingPageId: string) {
  await prisma.landingPage.update({
    where: { id: landingPageId },
    data: {
      status: 'APPROVED',
      published: true,
      publishedAt: new Date(),
    },
  });
}

export async function rejectContent(landingPageId: string, reason: string) {
  await prisma.landingPage.update({
    where: { id: landingPageId },
    data: {
      status: 'REJECTED',
      rejectionReason: reason,
    },
  });
}
```

---

## Cost Management

### Token Usage Tracking

```typescript
// src/lib/ai-usage-tracking.ts
import { redis } from '@/lib/redis';

export async function trackAIUsage(userId: string, tokens: number, cost: number) {
  const key = `ai_usage:${userId}:${new Date().toISOString().slice(0, 7)}`; // Monthly key

  await redis.hincrby(key, 'tokens', tokens);
  await redis.hincrbyfloat(key, 'cost', cost);
  await redis.expire(key, 90 * 24 * 60 * 60); // Keep for 90 days
}

export async function getMonthlyUsage(userId: string): Promise<{ tokens: number; cost: number }> {
  const key = `ai_usage:${userId}:${new Date().toISOString().slice(0, 7)}`;

  const [tokens, cost] = await Promise.all([
    redis.hget(key, 'tokens'),
    redis.hget(key, 'cost'),
  ]);

  return {
    tokens: parseInt(tokens || '0'),
    cost: parseFloat(cost || '0'),
  };
}
```

---

## Best Practices

### Content Generation Guidelines

1. **Always Review:** Never auto-publish AI-generated content
2. **Fact-Check:** Verify all tax-related information
3. **Personalize:** Add local touches and specific details
4. **SEO Optimize:** Ensure keywords are naturally integrated
5. **Legal Compliance:** Review for compliance with tax regulations
6. **Brand Voice:** Maintain consistent tone across all content
7. **Update Regularly:** Refresh content annually for tax law changes

### Prompt Engineering Tips

- Be specific with instructions
- Provide examples of desired output
- Specify format (JSON, Markdown, etc.)
- Include constraints (length, tone, keywords)
- Request factual accuracy
- Iterate and refine prompts based on results

---

## Alternative AI Providers

### Claude Integration (Backup)

```typescript
// src/lib/services/claude-content.service.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function generateWithClaude(prompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return message.content[0].text;
}
```

---

## Related Documentation

- [API Design Patterns](./03-api-design.md) - AI API endpoints
- [Security Architecture](./07-security.md) - API key management
- [Performance Optimization](./09-performance.md) - Caching AI responses
- [Deployment Architecture](./08-deployment.md) - Environment configuration

---

**Navigation:**
[← Previous: Performance Optimization](./09-performance.md) | [Next: Monitoring & Observability →](./11-monitoring.md)

---

**Document Version:** 3.0 FINAL
**Last Updated:** October 9, 2025
**Next Review:** November 9, 2025
**Maintained By:** Development Team
