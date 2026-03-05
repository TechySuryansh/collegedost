import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ExamGuideSection {
  id: string;
  title: string;
  content: string; // HTML content
}

export interface ExamGuideData {
  examName: string;
  sections: ExamGuideSection[];
  highlights: { key: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

export interface CourseGuideData {
  courseName: string;
  sections: ExamGuideSection[];
  highlights: { key: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

export interface BoardGuideData {
  boardName: string;
  sections: ExamGuideSection[];
  highlights: { key: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

export async function generateExamGuide(examName: string, examSlug: string): Promise<ExamGuideData> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are an expert Indian education counselor. Generate a comprehensive, detailed exam guide for "${examName}" exam in India.

Return a JSON object with this EXACT structure (no markdown, no code fences, just raw JSON):

{
  "examName": "${examName}",
  "highlights": [
    {"key": "Exam Name", "value": "Full official name"},
    {"key": "Conducting Body", "value": "..."},
    {"key": "Exam Level", "value": "National/State"},
    {"key": "Frequency", "value": "..."},
    {"key": "Exam Mode", "value": "Online/Offline/Both"},
    {"key": "Duration", "value": "..."},
    {"key": "Official Website", "value": "..."}
  ],
  "sections": [
    {
      "id": "dates",
      "title": "${examName} 2026 Exam Dates & Schedule",
      "content": "<p>Detailed paragraph about exam dates...</p><ul><li>Registration: ...</li><li>Exam Date: ...</li></ul>"
    },
    {
      "id": "what-is",
      "title": "What is ${examName}?",
      "content": "<p>Detailed explanation...</p>"
    },
    {
      "id": "full-form",
      "title": "What Is ${examName} Full Form?",
      "content": "<p>Full form explanation...</p>"
    },
    {
      "id": "history",
      "title": "${examName} Exam: Over the Years",
      "content": "<p>Evolution and history...</p>"
    },
    {
      "id": "eligibility",
      "title": "Who Can Appear for ${examName} Exam?",
      "content": "<p>Educational qualifications...</p><ul><li>...</li></ul>"
    },
    {
      "id": "application",
      "title": "${examName} Application Process",
      "content": "<p>Step by step application process...</p><ol><li>Step 1...</li></ol>"
    },
    {
      "id": "subjects",
      "title": "${examName} Subjects List",
      "content": "<p>Complete list of subjects...</p>"
    },
    {
      "id": "syllabus",
      "title": "${examName} Syllabus",
      "content": "<p>Detailed syllabus breakdown...</p>"
    },
    {
      "id": "pattern",
      "title": "${examName} Exam Pattern",
      "content": "<p>Pattern with marking scheme, sections, duration...</p>"
    },
    {
      "id": "admission",
      "title": "${examName} Admission Process",
      "content": "<p>How admissions work after the exam...</p>"
    },
    {
      "id": "universities",
      "title": "${examName} Participating Universities/Institutions",
      "content": "<p>List of major accepting institutions...</p>"
    },
    {
      "id": "result",
      "title": "${examName} Result",
      "content": "<p>How to check results, normalization process...</p>"
    },
    {
      "id": "after-results",
      "title": "What After ${examName} Results?",
      "content": "<p>Next steps after results...</p>"
    },
    {
      "id": "counselling",
      "title": "${examName} Counselling Process",
      "content": "<p>Detailed counselling steps...</p>"
    },
    {
      "id": "cutoff",
      "title": "${examName} 2026 Cut Off",
      "content": "<p>Expected cutoffs, previous year trends...</p>"
    },
    {
      "id": "contact",
      "title": "Contact Information",
      "content": "<p>Official helpline, email, website...</p>"
    }
  ],
  "faqs": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}

IMPORTANT RULES:
1. Content must be factually accurate and up-to-date for 2026
2. Each section's "content" must be rich HTML with <p>, <ul>, <ol>, <li>, <strong>, <em> tags
3. Each section should have at least 2-3 detailed paragraphs (150-300 words minimum per section)
4. Include real data: actual dates, actual institutions, actual syllabus topics
5. Return ONLY valid JSON, no markdown fences, no extra text
6. If you don't know exact 2026 dates, use "Expected" or "To be announced" with previous year references`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Robust JSON Extraction using regex
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('[Gemini Service] No JSON found in response:', text);
    throw new Error('Failed to parse AI response: No JSON found');
  }

  const cleanedText = jsonMatch[0];

  try {
    const guideData: ExamGuideData = JSON.parse(cleanedText);
    return guideData;
  } catch (error: any) {
    console.error('[Gemini Service] JSON Parse Error:', error.message);
    console.error('[Gemini Service] Raw response segment:', text.substring(0, 500));
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

export async function generateCourseGuide(courseName: string, courseSlug: string): Promise<CourseGuideData> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are an expert Indian education counselor. Generate a comprehensive, detailed course guide for "${courseName}" course in India.
    
    Return a JSON object with this EXACT structure (no markdown, no code fences, just raw JSON):
    
    {
      "courseName": "${courseName}",
      "highlights": [
        {"key": "Course Name", "value": "Full official name"},
        {"key": "Course Type", "value": "Degree/Diploma/Certification"},
        {"key": "Duration", "value": "e.g. 4 Years / 3 Years"},
        {"key": "Degree Level", "value": "Undergraduate/Postgraduate/etc"},
        {"key": "Eligibility", "value": "e.g. 10+2 with PCM"},
        {"key": "Average Fees", "value": "e.g. INR 2 LPA - 10 LPA"},
        {"key": "Average Salary", "value": "e.g. INR 3 LPA - 12 LPA"}
      ],
      "sections": [
        {
          "id": "overview",
          "title": "What is ${courseName}?",
          "content": "<p>Detailed description of the course, its importance, and what it covers...</p>"
        },
        {
          "id": "why-choose",
          "title": "Why Choose ${courseName}?",
          "content": "<p>Benefits, career growth, and industry demand...</p><ul><li>Reason 1...</li><li>Reason 2...</li></ul>"
        },
        {
          "id": "eligibility",
          "title": "${courseName} Eligibility Criteria",
          "content": "<p>Educational requirements, minimum marks, age limit, etc...</p>"
        },
        {
          "id": "entrance-exams",
          "title": "Top Entrance Exams for ${courseName}",
          "content": "<p>List and details of national/state level entrance exams...</p><ul><li>Exam 1...</li><li>Exam 2...</li></ul>"
        },
        {
          "id": "specializations",
          "title": "Popular Specializations in ${courseName}",
          "content": "<p>Various branches or majors available...</p><ul><li>Spec 1...</li><li>Spec 2...</li></ul>"
        },
        {
          "id": "syllabus",
          "title": "${courseName} Syllabus & Subjects",
          "content": "<p>Year-wise or semester-wise breakdown of key subjects...</p>"
        },
        {
          "id": "admission-process",
          "title": "${courseName} Admission Process",
          "content": "<p>Step-by-step guide to getting admission...</p>"
        },
        {
          "id": "top-colleges",
          "title": "Top Colleges for ${courseName} in India",
          "content": "<p>List of premier institutions (IITs, IIMs, DU, AIIMS etc. as applicable)...</p>"
        },
        {
          "id": "fees",
          "title": "${courseName} Course Fees",
          "content": "<p>Detailed fee structure for government vs private colleges...</p>"
        },
        {
          "id": "career-options",
          "title": "Career Options After ${courseName}",
          "content": "<p>Job profiles, industries, and growth prospects...</p><ul><li>Job 1...</li><li>Job 2...</li></ul>"
        },
        {
          "id": "top-recruiters",
          "title": "${courseName} Top Recruiters",
          "content": "<p>Major companies and organizations that hire graduates...</p>"
        },
        {
          "id": "salary",
          "title": "${courseName} Salary in India",
          "content": "<p>Entry-level, mid-level and senior-level salary trends...</p>"
        },
        {
          "id": "skills-required",
          "title": "Skills Required for ${courseName}",
          "content": "<p>Soft skills and technical skills needed for success...</p>"
        },
        {
          "id": "higher-studies",
          "title": "Higher Studies Options After ${courseName}",
          "content": "<p>Further education like Masters, PhD, or certifications...</p>"
        },
        {
          "id": "comparison",
          "title": "${courseName} vs Similar Courses",
          "content": "<p>Key differences between this and related courses...</p>"
        }
      ],
      "faqs": [
        {"question": "...", "answer": "..."},
        {"question": "...", "answer": "..."},
        {"question": "...", "answer": "..."},
        {"question": "...", "answer": "..."}
      ]
    }
    
    IMPORTANT RULES:
    1. Content must be factually accurate and up-to-date for 2025-2026
    2. Each section's "content" must be rich HTML with <p>, <ul>, <ol>, <li>, <strong>, <em> tags
    3. Each section should have at least 2-3 detailed paragraphs (150-300 words minimum per section)
    4. Include real data: actual salaries, actual college names, actual subjects
    5. Return ONLY valid JSON, no markdown fences, no extra text`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Robust JSON Extraction using regex
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('[Gemini Service] No JSON found in response:', text);
    throw new Error('Failed to parse AI response: No JSON found');
  }

  const cleanedText = jsonMatch[0];

  try {
    const guideData: CourseGuideData = JSON.parse(cleanedText);
    return guideData;
  } catch (error: any) {
    console.error('[Gemini Service] JSON Parse Error:', error.message);
    console.error('[Gemini Service] Raw response segment:', text.substring(0, 500));
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}
export async function generateLatestArticles(): Promise<any[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are a professional education news journalist in India. 
  Generate 6-8 "Latest News & Articles" entries about Indian education, specifically focusing on 2026 exams (CUET, JEE, NEET, NIMCET, MAT, CAT, board exams, results, registration starts, etc.).

  For each article, provide:
  1. title: Catchy news headline
  2. summary: 2-3 sentence summary of the news
  3. category: One of ['Exam News', 'College News', 'Admission Alert', 'General']
  4. content: Detailed article content in HTML (3-4 paragraphs)
  5. author: A realistic name
  6. tags: 2-3 relevant keywords
  7. isLive: Boolean (True if it's currently happening/urgent like "Result (OUT)")

  Return a JSON array of objects with these fields. 
  IMPORTANT: Return ONLY valid JSON, no markdown fences, no extra text.
  Make sure the news is realistic and timely (March 2026).`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error('[Gemini Service] No JSON array found in news response:', text);
    throw new Error('Failed to parse AI news response');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error('[Gemini Service] News JSON Parse Error:', error.message);
    throw new Error(`Failed to parse AI news: ${error.message}`);
  }
}

export async function generateBoardGuide(boardName: string, boardSlug: string): Promise<BoardGuideData> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are an expert Indian education counselor. Generate a comprehensive, detailed guide for the "${boardName}" educational board in India.
    
    Return a JSON object with this EXACT structure (no markdown, no code fences, just raw JSON):
    
    {
      "boardName": "${boardName}",
      "highlights": [
        {"key": "Board Name", "value": "Full official name"},
        {"key": "Conducting Body", "value": "..."},
        {"key": "Exam Level", "value": "State / National"},
        {"key": "Website", "value": "Official website link"},
        {"key": "Exam Mode", "value": "Offline / Online"}
      ],
      "sections": [
        {
          "id": "overview",
          "title": "About ${boardName}",
          "content": "<p>Detailed introduction to the board, its history, and its significance...</p>"
        },
        {
          "id": "dates",
          "title": "${boardName} 2026 Exam Dates & Schedule",
          "content": "<p>Detailed schedule including start date, end date, and practical exam dates...</p><ul><li>Theory Exams: ...</li><li>Practical Exams: ...</li></ul>"
        },
        {
          "id": "admit-card",
          "title": "${boardName} Admit Card 2026",
          "content": "<p>Information on when and how students can download their admit card...</p>"
        },
        {
          "id": "syllabus",
          "title": "${boardName} Syllabus 2026",
          "content": "<p>Overview of the updated syllabus for core subjects (Science, Commerce, Arts)...</p>"
        },
        {
          "id": "pattern",
          "title": "${boardName} Exam Pattern 2026",
          "content": "<p>Marking scheme, question types, and duration of the exams...</p>"
        },
        {
          "id": "timetable",
          "title": "${boardName} Time Table 2026",
          "content": "<p>Key dates for major subjects and how to download the official timetable PDF...</p>"
        },
        {
          "id": "answer-key",
          "title": "${boardName} Answer Key 2026",
          "content": "<p>Details on when official answer keys are released and how to challenge them...</p>"
        },
        {
          "id": "question-papers",
          "title": "${boardName} Question Papers",
          "content": "<p>Importance of previous year question papers and sample papers for preparation...</p>"
        },
        {
          "id": "preparation",
          "title": "${boardName} Preparation Tips",
          "content": "<p>Expert strategies for scoring high marks in board exams...</p>"
        },
        {
          "id": "result",
          "title": "${boardName} Result 2026",
          "content": "<p>Expected result date, websites to check results, and the grading system...</p>"
        }
      ],
      "faqs": [
        {"question": "How to register for ${boardName} 2026?", "answer": "..."},
        {"question": "When will the ${boardName} 2026 time table be released?", "answer": "..."},
        {"question": "...", "answer": "..."}
      ]
    }
    
    IMPORTANT RULES:
    1. Content must be factually accurate and up-to-date for 2025-2026.
    2. Each section's "content" must be rich HTML with <p>, <ul>, <ol>, <li>, <strong>, <em> tags.
    3. Each section should have at least 2-3 detailed paragraphs.
    4. If you don't know exact 2026 dates, use "Expected" or "Tentative" with previous year references.
    5. Return ONLY valid JSON, no markdown fences, no formatting.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  console.log(`[Gemini Service] Raw response length: ${text.length}`);

  // Robust JSON Extraction using regex
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('[Gemini Service] No JSON found in response. Raw text:', text);
    throw new Error('Failed to parse AI response: No JSON found');
  }

  const cleanedText = jsonMatch[0];

  try {
    const guideData: BoardGuideData = JSON.parse(cleanedText);
    return guideData;
  } catch (error: any) {
    console.error('[Gemini Service] JSON Parse Error:', error.message);
    console.error('[Gemini Service] Raw response segment:', text.substring(0, 500));
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}
