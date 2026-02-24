import OpenAI from 'openai';
import { ICollege, IAIContent } from '../models/College';

const apiKey = process.env.OPENAI_API_KEY || '';
const isGroq = apiKey.startsWith('gsk_');

const openai = new OpenAI({
    apiKey,
    ...(isGroq ? { baseURL: 'https://api.groq.com/openai/v1' } : {})
});

const MODEL = isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

/**
 * Generate AI content for a college using OpenAI GPT.
 * Retries up to 2 times on failure.
 */
export const generateCollegeContent = async (college: ICollege): Promise<IAIContent> => {
    const courseNames = college.coursesOffered?.map(c => c.name).filter(Boolean).join(', ') || 'Not specified';

    const prompt = `You are an expert Indian education content writer. Generate structured content for the following Indian college.

COLLEGE DETAILS:
- Name: ${college.name}
- City: ${college.location?.city || 'Unknown'}
- State: ${college.location?.state || 'Unknown'}
- Type: ${college.type || 'Unknown'}
- NIRF Rank: ${college.nirfRank || 'Not ranked'}
- Courses Offered: ${courseNames}

INSTRUCTIONS:
1. Write factual, neutral, SEO-optimized content suitable for an Indian college discovery platform.
2. Do NOT hallucinate specific NAAC grades, NBA accreditations, or NIRF rankings that are not provided above.
3. Do NOT invent exact placement company names or specific recruiter lists.
4. Placement statistics must be realistic for Indian colleges:
   - Use LPA (Lakhs Per Annum) as the unit. Provide numbers only (e.g., 6.5 not "6.5 LPA").
   - highestPackage must be >= averagePackage >= medianPackage.
   - placementRate must be between 50 and 100.
   - Do NOT fabricate extreme salaries greater than 150 LPA.
   - If the college is unknown or unranked, estimate conservative values (averagePackage: 2-4, highestPackage: 5-12, medianPackage: 1.5-3.5, placementRate: 55-75).
   - For top-tier colleges (NIRF top 50): averagePackage 8-25, highestPackage 30-100, medianPackage 6-20, placementRate 85-98.
   - For mid-tier colleges (NIRF 50-200): averagePackage 4-10, highestPackage 12-40, medianPackage 3-8, placementRate 70-90.
5. If data is missing or the college is not well-known, use generic but realistic descriptions.
6. Output ONLY valid JSON, no markdown fences, no commentary.

OUTPUT JSON FORMAT:
{
  "description": "A 2-3 paragraph description of the college",
  "highlights": ["5-7 key highlights as short bullet strings"],
  "placements": "A 1-2 paragraph summary of placement trends",
  "placementStats": {
    "averagePackage": <number in LPA>,
    "medianPackage": <number in LPA>,
    "highestPackage": <number in LPA>,
    "placementRate": <number 50-100>
  },
  "facilities": ["6-10 campus facilities"],
  "coursesSummary": "A 1-2 paragraph summary of academic programs",
  "faqs": [
    { "question": "...", "answer": "..." }
  ],
  "seoTitle": "SEO-optimized title (60 chars max)",
  "seoDescription": "SEO meta description (155 chars max)"
}

Generate 5-7 FAQs covering admissions, placements, fees, campus life, and eligibility.`;

    let lastError: Error | null = null;
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await openai.chat.completions.create({
                model: MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that outputs only valid JSON. Do not include markdown code fences or any text outside the JSON object.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2000,
                ...(isGroq ? {} : { response_format: { type: 'json_object' as const } })
            });

            let content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('Empty response from AI');
            }

            // Strip markdown code fences if present (some models wrap JSON)
            content = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

            const parsed: IAIContent = JSON.parse(content);

            // Basic structure validation
            if (!parsed.description || !parsed.placementStats) {
                throw new Error('Invalid response structure from OpenAI');
            }

            return parsed;
        } catch (error: any) {
            lastError = error;
            console.error(`OpenAI attempt ${attempt + 1} failed for "${college.name}": ${error.message}`);

            if (attempt < maxRetries) {
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            }
        }
    }

    throw lastError || new Error('Failed to generate AI content after retries');
};

/**
 * Validate and adjust placement stats for consistency.
 */
export const validatePlacementStats = (stats: IAIContent['placementStats']): IAIContent['placementStats'] => {
    let { averagePackage, medianPackage, highestPackage, placementRate } = stats;

    // Ensure highestPackage >= averagePackage
    if (averagePackage > highestPackage) {
        averagePackage = highestPackage;
    }

    // Ensure averagePackage >= medianPackage
    if (medianPackage > averagePackage) {
        medianPackage = averagePackage;
    }

    // Clamp placementRate to [50, 100]
    placementRate = Math.max(50, Math.min(100, placementRate));

    return { averagePackage, medianPackage, highestPackage, placementRate };
};
