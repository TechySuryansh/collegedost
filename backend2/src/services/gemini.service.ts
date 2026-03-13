import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Helper to get a configured Gemini model instance.
 * Ensures the API key is read from the environment at the time of creation.
 */
function getGeminiModel(modelName: string = 'gemini-2.0-flash') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

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

export interface SpecializationGuideData {
  specName: string;
  sections: ExamGuideSection[];
  highlights: { key: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

export async function generateExamGuide(examName: string, examSlug: string): Promise<ExamGuideData> {
  const model = getGeminiModel();

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
  const model = getGeminiModel();

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
  const model = getGeminiModel();

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
  const model = getGeminiModel();

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

export interface CollegeGuideData {
  collegeName: string;
  sections: ExamGuideSection[];
  highlights: { key: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

export async function generateCollegeGuide(collegeName: string, collegeSlug: string): Promise<CollegeGuideData> {
  const model = getGeminiModel();

  const prompt = `You are an expert Indian education counselor. Generate a comprehensive, detailed guide for "${collegeName}" college/university in India.

Return a JSON object with this EXACT structure (no markdown, no code fences, just raw JSON):

{
  "collegeName": "${collegeName}",
  "highlights": [
    {"key": "College Name", "value": "Full official name"},
    {"key": "Type", "value": "Government/Private/Deemed"},
    {"key": "Established", "value": "Year of establishment"},
    {"key": "Location", "value": "City, State"},
    {"key": "NIRF Rank", "value": "Rank if available or N/A"},
    {"key": "Approved By", "value": "UGC/AICTE/etc."},
    {"key": "Affiliation", "value": "University affiliation"},
    {"key": "Official Website", "value": "URL"}
  ],
  "sections": [
    {
      "id": "overview",
      "title": "${collegeName} Overview",
      "content": "<p>Detailed introduction about the college, its history, mission, vision, and significance in Indian education...</p>"
    },
    {
      "id": "highlights-2026",
      "title": "${collegeName} Highlights 2026",
      "content": "<p>Key highlights and recent achievements, rankings, accreditations...</p>"
    },
    {
      "id": "courses-fees",
      "title": "${collegeName} Courses and Fees 2026",
      "content": "<p>Detailed breakdown of courses offered (UG, PG, PhD) along with fee structures...</p><ul><li>Course 1...</li></ul>"
    },
    {
      "id": "admission",
      "title": "${collegeName} Admission Process and Important Dates 2026",
      "content": "<p>Step-by-step admission process, entrance exams accepted, important dates and deadlines...</p>"
    },
    {
      "id": "reviews",
      "title": "${collegeName} Student Reviews",
      "content": "<p>What current and past students say about academics, campus life, faculty quality...</p>"
    },
    {
      "id": "popular-programmes",
      "title": "${collegeName} Popular Programmes 2026",
      "content": "<p>Most sought-after courses at this institution with details on intake, specializations...</p>"
    },
    {
      "id": "popular-courses",
      "title": "${collegeName} Popular Courses",
      "content": "<p>Breakdown of individual popular courses with key details...</p>"
    },
    {
      "id": "placements",
      "title": "${collegeName} Placements 2025",
      "content": "<p>Placement statistics, top recruiters, average and highest packages, placement percentage...</p>"
    },
    {
      "id": "cutoff",
      "title": "${collegeName} Cutoff 2025",
      "content": "<p>Previous year cutoffs for various exams and categories...</p>"
    },
    {
      "id": "infrastructure",
      "title": "${collegeName} Infrastructure",
      "content": "<p>Campus facilities, labs, libraries, hostels, sports facilities, Wi-Fi, canteen...</p>"
    },
    {
      "id": "application-process",
      "title": "${collegeName} Application Process 2026",
      "content": "<p>Detailed steps to apply online/offline, required documents...</p>"
    },
    {
      "id": "online-courses",
      "title": "Top online courses you might be interested in",
      "content": "<p>Related online courses and certifications that complement studies at this college...</p>"
    },
    {
      "id": "scholarships",
      "title": "${collegeName} Scholarships 2026",
      "content": "<p>Available scholarships, eligibility criteria, and application process...</p>"
    },
    {
      "id": "comparison",
      "title": "${collegeName} vs Other Universities: Which is Better?",
      "content": "<p>Comparison with similar institutions on parameters like ranking, fees, placements...</p>"
    },
    {
      "id": "faculty",
      "title": "${collegeName} Faculty",
      "content": "<p>Information about faculty strength, qualifications, notable professors...</p>"
    },
    {
      "id": "collaborations",
      "title": "${collegeName} Collaborations and Partnerships",
      "content": "<p>Industry tie-ups, international collaborations, MoUs with other institutions...</p>"
    },
    {
      "id": "schools",
      "title": "${collegeName} Schools of Study",
      "content": "<p>Different schools/departments within the institution and their specializations...</p>"
    }
  ],
  "faqs": [
    {"question": "How to get admission in ${collegeName}?", "answer": "..."},
    {"question": "What is the fee structure of ${collegeName}?", "answer": "..."},
    {"question": "What are the top courses at ${collegeName}?", "answer": "..."},
    {"question": "What is the placement record of ${collegeName}?", "answer": "..."},
    {"question": "Is ${collegeName} good for engineering/management?", "answer": "..."}
  ]
}

IMPORTANT RULES:
1. Content must be factually accurate and up-to-date for 2025-2026
2. Each section's "content" must be rich HTML with <p>, <ul>, <ol>, <li>, <strong>, <em> tags
3. Each section should have at least 2-3 detailed paragraphs (150-300 words minimum per section)
4. Include real data: actual placement figures, actual courses, actual faculty info where possible
5. Return ONLY valid JSON, no markdown fences, no extra text
6. If you don't know exact data, provide realistic estimates based on the college's reputation and type`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('[Gemini Service] No JSON found in college guide response:', text);
    throw new Error('Failed to parse AI response: No JSON found');
  }

  const cleanedText = jsonMatch[0];

  try {
    const guideData: CollegeGuideData = JSON.parse(cleanedText);
    return guideData;
  } catch (error: any) {
    console.error('[Gemini Service] College Guide JSON Parse Error:', error.message);
    console.error('[Gemini Service] Raw response segment:', text.substring(0, 500));
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

export async function generateSpecializationGuide(specName: string, specSlug: string): Promise<SpecializationGuideData> {
  const model = getGeminiModel();

  const prompt = `You are an expert Indian education counselor. Generate a comprehensive, detailed guide for the "${specName}" engineering specialization in India.
    
    Return a JSON object with this EXACT structure (no markdown, no code fences, just raw JSON):
    
    {
      "specName": "${specName}",
      "highlights": [
        {"key": "Specialization Name", "value": "${specName}"},
        {"key": "Course Levels", "value": "UG, PG, Diploma, Doctorate"},
        {"key": "Duration", "value": "4 Years (UG), 2 Years (PG)"},
        {"key": "Eligibility", "value": "10+2 with PCM (UG), B.Tech (PG)"},
        {"key": "Entrance Exams", "value": "JEE Main, JEE Advanced, GATE, State CETs"},
        {"key": "Average Fees", "value": "INR 1 - 10 Lakhs"},
        {"key": "Average Salary", "value": "INR 4 - 15 LPA"}
      ],
      "sections": [
        {
          "id": "overview",
          "title": "What is ${specName}?",
          "content": "<p>Detailed introduction to the field, what it covers, and its importance in the modern world...</p>"
        },
        {
          "id": "eligibility",
          "title": "${specName} Eligibility & Admission Process",
          "content": "<p>Minimum requirements for UG and PG courses, marks required, and how admission works...</p>"
        },
        {
          "id": "entrance-exams",
          "title": "Top Entrance Exams for ${specName}",
          "content": "<p>Major national and state level exams required for admission...</p><ul><li>JEE Main</li><li>GATE</li></ul>"
        },
        {
          "id": "subjects",
          "title": "${specName} Subjects & Syllabus",
          "content": "<p>Overview of core subjects taught during the course (e.g., Mathematics, Thermodynamics, Structure, etc.)...</p>"
        },
        {
          "id": "career-scope",
          "title": "Career Scope & Job Profiles in ${specName}",
          "content": "<p>Job opportunities after graduation, roles like Project Manager, Lead Engineer, etc...</p>"
        },
        {
          "id": "salary",
          "title": "${specName} Salary in India",
          "content": "<p>Salary trends for freshers and experienced professionals in this field...</p>"
        },
        {
          "id": "recruiters",
          "title": "Top Recruiters for ${specName}",
          "content": "<p>Major private companies and PSUs that hire graduates from this branch...</p>"
        },
        {
          "id": "colleges",
          "title": "Top Colleges for ${specName}",
          "content": "<p>Premier institutions known for this specialization (IITs, NITs, Bits Pilani, etc.)...</p>"
        }
      ],
      "faqs": [
        {"question": "Is ${specName} a good career option?", "answer": "..."},
        {"question": "What is the average salary for ${specName} graduates?", "answer": "..."},
        {"question": "...", "answer": "..."}
      ]
    }
    
    IMPORTANT RULES:
    1. Content must be factually accurate and up-to-date for 2025-2026.
    2. Each section's "content" must be rich HTML with <p>, <ul>, <ol>, <li>, <strong>, <em> tags.
    3. Each section should have at least 2-3 detailed paragraphs.
    4. Include real data: actual salaries, company names, and subjects.
    5. Return ONLY valid JSON, no markdown fences, no extra text.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('[Gemini Service] No JSON found in specialization guide response:', text);
    throw new Error('Failed to parse AI response: No JSON found');
  }

  const cleanedText = jsonMatch[0];

  try {
    const guideData: SpecializationGuideData = JSON.parse(cleanedText);
    return guideData;
  } catch (error: any) {
    console.error('[Gemini Service] Specialization Guide JSON Parse Error:', error.message);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}
