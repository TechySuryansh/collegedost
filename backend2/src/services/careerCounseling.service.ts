import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface CareerPathResult {
  rank: number;
  title: string;
  match: string;
  description: string;
  roadmap: string[];
  entranceExams: string[];
  degreeOptions: string[];
  topColleges: { name: string; location: string }[];
  skills: string[];
  roles: string[];
  salaryRange: string;
}

export interface CareerCounselingReport {
  studentSummary: string;
  careerPaths: CareerPathResult[];
  finalRecommendation: string;
}

export interface StudentFormInput {
  fullName: string;
  dateOfBirth?: string;
  currentClass: string;
  board: string;
  stream: string;
  subjects?: string;
  exams: string[];
  preferredLocation?: string;
  preferredColleges?: string;
  preferredLanguage?: string;
  interests: string[];
}

export async function generateCareerCounselingReport(
  input: StudentFormInput
): Promise<CareerCounselingReport> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const locationPref = input.preferredLocation
    ? `The student prefers to study in or near: ${input.preferredLocation}. Prioritize colleges from this region when possible.`
    : 'No specific location preference.';

  const collegePref = input.preferredColleges
    ? `The student is interested in: ${input.preferredColleges}. Include these if relevant.`
    : '';

  const prompt = `You are a senior career counselor with 20+ years of experience in the Indian education system. You help Class 10-12 students choose the right career path.

A student has filled out their profile. Analyze it carefully and generate a detailed, personalized career counseling report.

=== STUDENT PROFILE ===
Name: ${input.fullName}
${input.dateOfBirth ? `Date of Birth: ${input.dateOfBirth}` : ''}
Current Class: ${input.currentClass}
Board: ${input.board}
Stream: ${input.stream}
${input.subjects ? `Subjects: ${input.subjects}` : ''}
Entrance Exams: ${input.exams.join(', ')}
Interests: ${input.interests.join(', ')}
${locationPref}
${collegePref}
Preferred Language: ${input.preferredLanguage || 'English'}
======================

Based on this profile, generate a JSON career counseling report with EXACTLY this structure (no markdown fences, raw JSON only):

{
  "studentSummary": "A 2-3 sentence summary of the student's academic profile, strengths, and potential. Be encouraging and specific.",
  "careerPaths": [
    {
      "rank": 1,
      "title": "Career Path Title (e.g., Software Engineering, Medicine, Chartered Accountancy)",
      "match": "Excellent",
      "description": "2-3 sentences explaining why this is a great fit for the student based on their stream, interests, and exams.",
      "roadmap": [
        "Step 1: What to do right now (e.g., Focus on Class 12 boards)",
        "Step 2: Entrance exam preparation",
        "Step 3: College admission",
        "Step 4: During college — internships, projects",
        "Step 5: Post-graduation or job placement"
      ],
      "entranceExams": ["JEE Main", "JEE Advanced"],
      "degreeOptions": ["B.Tech in Computer Science", "B.E. in IT"],
      "topColleges": [
        {"name": "IIT Bombay", "location": "Mumbai, Maharashtra"},
        {"name": "IIT Delhi", "location": "New Delhi"},
        {"name": "NIT Trichy", "location": "Tiruchirappalli, Tamil Nadu"},
        {"name": "BITS Pilani", "location": "Pilani, Rajasthan"},
        {"name": "IIIT Hyderabad", "location": "Hyderabad, Telangana"}
      ],
      "skills": ["Programming", "Data Structures", "Problem Solving", "Mathematics"],
      "roles": ["Software Developer", "Data Scientist", "ML Engineer", "Product Manager"],
      "salaryRange": "₹6-25 LPA (freshers) | ₹25-80+ LPA (experienced)"
    }
  ],
  "finalRecommendation": "A comprehensive 3-4 sentence final recommendation ranking the 3 paths and explaining which one the student should pursue first, and why. Be direct and actionable."
}

IMPORTANT RULES:
- Return EXACTLY 3 career paths, ranked from best to worst match.
- The "match" field must be one of: "Excellent", "Good", or "Fair".
- Each career path must have exactly 5 roadmap steps.
- Each career path must have 5 top colleges relevant to that career. ${input.preferredLocation ? `Prioritize colleges in or near ${input.preferredLocation}.` : ''}
- Each career path must have 3-5 entrance exams, 2-4 degree options, 4-6 skills, and 4-6 career roles.
- Salary ranges must be in Indian Rupees (₹) with LPA format.
- Be realistic and specific to the Indian education system.
- Do NOT include generic advice. Make it specific to the student's profile.
- Return ONLY the JSON object. No extra text, no markdown code fences.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('[Career Counseling] No JSON found in response:', text.substring(0, 500));
    throw new Error('Failed to parse AI response');
  }

  try {
    const parsed: CareerCounselingReport = JSON.parse(jsonMatch[0]);
    // Validate structure
    if (!parsed.studentSummary || !parsed.careerPaths || !parsed.finalRecommendation) {
      throw new Error('Invalid report structure');
    }
    if (!Array.isArray(parsed.careerPaths) || parsed.careerPaths.length === 0) {
      throw new Error('No career paths generated');
    }
    return parsed;
  } catch (parseError: any) {
    console.error('[Career Counseling] JSON Parse Error:', parseError.message);
    console.error('[Career Counseling] Raw response segment:', text.substring(0, 500));
    throw new Error('Failed to parse AI career counseling response');
  }
}
