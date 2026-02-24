/**
 * Comprehensive Cutoff Data Seed
 * 
 * Seeds cutoff data for ALL major Indian institutes:
 * - 23 IITs (JEE Advanced)
 * - 31 NITs (JEE Main)
 * - 26 IIITs (JEE Main)
 * - 20+ GFTIs (JEE Main)
 * - 15+ Private Engineering (JEE Main / Own Exam)
 * - 30+ Medical Colleges (NEET)
 * 
 * Usage: npx ts-node src/seedCutoffs.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './models/College';

dotenv.config();

interface CutoffEntry {
    exam: string;
    branch: string;
    category: string;
    closingRank: number;
    year: number;
    quota: string; // 'AI', 'HS', 'OS'
}

interface CollegeSeed {
    name: string;
    slug: string;
    type: string;
    location: { city: string; state: string; country: string };
    nirfRank?: number;
    cutoffs: CutoffEntry[];
    coursesOffered: { name: string; fee: number; duration: string; type: string }[];
    description?: string;
}

// ═══════════════════════════════════════════════════════
// HELPER: Generate cutoffs for all categories
// ═══════════════════════════════════════════════════════

const CATEGORIES = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'];
const CAT_MULT: Record<string, number> = {
    'General': 1.0, 'OBC-NCL': 1.4, 'SC': 2.5, 'ST': 3.5, 'EWS': 1.2,
};

// Generate cutoffs with a single quota (AI by default)
function gen(exam: string, branches: [string, number][], year = 2025, quota = 'AI'): CutoffEntry[] {
    const cutoffs: CutoffEntry[] = [];
    for (const [branch, baseRank] of branches) {
        for (const cat of CATEGORIES) {
            cutoffs.push({
                exam, branch, category: cat,
                closingRank: Math.round(baseRank * (CAT_MULT[cat] || 1)),
                year, quota,
            });
        }
    }
    return cutoffs;
}

// Generate cutoffs for NITs/IIITs with both HS and OS quotas
// HS (Home State): ~1.5x higher closing rank = easier to get in
// OS (Other State): base ranks (same as AI)
function genWithQuota(exam: string, branches: [string, number][], year = 2025): CutoffEntry[] {
    const osCutoffs = gen(exam, branches, year, 'OS');
    const hsBranches: [string, number][] = branches.map(([b, r]) => [b, Math.round(r * 1.5)]);
    const hsCutoffs = gen(exam, hsBranches, year, 'HS');
    return [...osCutoffs, ...hsCutoffs];
}

function slug(name: string): string {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function mkCollege(
    name: string, city: string, state: string, type: string,
    nirfRank: number | undefined, fee: number, courseName: string,
    duration: string, cutoffs: CutoffEntry[], description?: string
): CollegeSeed {
    return {
        name, slug: slug(name), type,
        location: { city, state, country: 'India' },
        nirfRank,
        coursesOffered: [{ name: courseName, fee, duration, type: 'Full-time' }],
        cutoffs,
        description: description || `${name} is located in ${city}, ${state}.`,
    };
}

// ═══════════════════════════════════════════════════════
// ALL 23 IITs (JEE Advanced Cutoffs)
// ═══════════════════════════════════════════════════════

const ENG_BRANCHES: [string, number][] = [
    ['Computer Science and Engineering', 0],
    ['Electrical Engineering', 0],
    ['Mechanical Engineering', 0],
    ['Chemical Engineering', 0],
    ['Civil Engineering', 0],
];

function iit(name: string, city: string, state: string, nirf: number | undefined,
    cse: number, ee: number, me: number, che: number, ce: number, extras?: [string, number][]): CollegeSeed {
    const branches: [string, number][] = [
        ['Computer Science and Engineering', cse],
        ['Electrical Engineering', ee],
        ['Mechanical Engineering', me],
        ['Chemical Engineering', che],
        ['Civil Engineering', ce],
        ...(extras || []),
    ];
    return mkCollege(name, city, state, 'Government', nirf, 250000, 'B.Tech', '4 Years', gen('JEE Advanced', branches));
}

const iitData: CollegeSeed[] = [
    iit('Indian Institute of Technology Madras', 'Chennai', 'Tamil Nadu', 1, 105, 520, 1800, 3500, 4500, [['Data Science', 200], ['Aerospace Engineering', 1400]]),
    iit('Indian Institute of Technology Delhi', 'New Delhi', 'Delhi', 2, 61, 355, 1350, 3100, 3800, [['Computer Science and Artificial Intelligence', 50], ['Mathematics and Computing', 180]]),
    iit('Indian Institute of Technology Bombay', 'Mumbai', 'Maharashtra', 3, 68, 347, 1200, 2800, 3500, [['Aerospace Engineering', 1600], ['Engineering Physics', 2200]]),
    iit('Indian Institute of Technology Kanpur', 'Kanpur', 'Uttar Pradesh', 4, 220, 750, 2200, 4200, 5000, [['Mathematics and Scientific Computing', 400]]),
    iit('Indian Institute of Technology Kharagpur', 'Kharagpur', 'West Bengal', 5, 380, 1100, 2900, 5200, 6000, [['Electronics and Electrical Communication', 900], ['Industrial Engineering', 4500]]),
    iit('Indian Institute of Technology Roorkee', 'Roorkee', 'Uttarakhand', 6, 820, 2200, 4500, 6800, 7200, [['Electronics and Communication Engineering', 1800], ['Metallurgical Engineering', 7500]]),
    iit('Indian Institute of Technology Guwahati', 'Guwahati', 'Assam', 7, 1200, 3000, 5500, 7500, 8000, [['Electronics and Electrical Engineering', 2500], ['Design', 3200]]),
    iit('Indian Institute of Technology Hyderabad', 'Hyderabad', 'Telangana', 8, 1000, 2800, 5000, 7000, 7800, [['Artificial Intelligence', 700], ['Biomedical Engineering', 6500]]),
    iit('Indian Institute of Technology Indore', 'Indore', 'Madhya Pradesh', 11, 2500, 4500, 7000, 8500, 9000, [['Computer Science and Engineering with AI', 2200]]),
    iit('Indian Institute of Technology BHU Varanasi', 'Varanasi', 'Uttar Pradesh', 10, 2000, 4000, 6500, 8000, 8500, [['Biochemical Engineering', 7800], ['Ceramic Engineering', 9000]]),
    iit('Indian Institute of Technology Dhanbad', 'Dhanbad', 'Jharkhand', 14, 3000, 5500, 7500, 9000, 9500, [['Mining Engineering', 8500], ['Petroleum Engineering', 8800]]),
    iit('Indian Institute of Technology Ropar', 'Rupnagar', 'Punjab', 20, 3200, 5800, 7800, 9200, 9800, [['Computer Science and Engineering with AI', 2800]]),
    iit('Indian Institute of Technology Patna', 'Patna', 'Bihar', 22, 3500, 6000, 8000, 9500, 10000, [['Mathematics and Computing', 4000]]),
    iit('Indian Institute of Technology Gandhinagar', 'Gandhinagar', 'Gujarat', 13, 2800, 5200, 7200, 8800, 9300, [['Materials Science', 8000]]),
    iit('Indian Institute of Technology Bhubaneswar', 'Bhubaneswar', 'Odisha', 24, 3800, 6200, 8200, 9800, 10200),
    iit('Indian Institute of Technology Mandi', 'Mandi', 'Himachal Pradesh', 25, 4000, 6500, 8500, 10000, 10500, [['Data Science and Engineering', 3500]]),
    iit('Indian Institute of Technology Jodhpur', 'Jodhpur', 'Rajasthan', 26, 4200, 6800, 8800, 10200, 10800, [['Artificial Intelligence and Data Science', 3200]]),
    iit('Indian Institute of Technology Tirupati', 'Tirupati', 'Andhra Pradesh', 30, 4500, 7000, 9000, 10500, 11000),
    iit('Indian Institute of Technology Palakkad', 'Palakkad', 'Kerala', 35, 4800, 7200, 9200, 10800, 11200),
    iit('Indian Institute of Technology Dharwad', 'Dharwad', 'Karnataka', 40, 5000, 7500, 9500, 11000, 11500),
    iit('Indian Institute of Technology Bhilai', 'Bhilai', 'Chhattisgarh', 45, 5200, 7800, 9800, 11200, 11800),
    iit('Indian Institute of Technology Goa', 'Goa', 'Goa', 50, 5500, 8000, 10000, 11500, 12000, [['Mathematics and Computing', 4800]]),
    iit('Indian Institute of Technology Jammu', 'Jammu', 'Jammu and Kashmir', 55, 5800, 8200, 10200, 11800, 12200),
];

// ═══════════════════════════════════════════════════════
// ALL 31 NITs (JEE Main Cutoffs)
// ═══════════════════════════════════════════════════════

function nit(name: string, city: string, state: string, nirf: number | undefined,
    cse: number, ece: number, me: number, ee: number, ce: number, extras?: [string, number][]): CollegeSeed {
    const branches: [string, number][] = [
        ['Computer Science and Engineering', cse],
        ['Electronics and Communication Engineering', ece],
        ['Mechanical Engineering', me],
        ['Electrical Engineering', ee],
        ['Civil Engineering', ce],
        ...(extras || []),
    ];
    return mkCollege(name, city, state, 'Government', nirf, 175000, 'B.Tech', '4 Years', genWithQuota('JEE Main', branches));
}

const nitData: CollegeSeed[] = [
    nit('National Institute of Technology Tiruchirappalli', 'Tiruchirappalli', 'Tamil Nadu', 9, 4500, 8500, 18000, 12000, 25000, [['Chemical Engineering', 28000], ['Instrumentation', 15000]]),
    nit('National Institute of Technology Surathkal', 'Mangalore', 'Karnataka', 10, 5200, 9800, 20000, 13000, 28000, [['Information Technology', 7500]]),
    nit('National Institute of Technology Warangal', 'Warangal', 'Telangana', 11, 5800, 10500, 22000, 14000, 30000, [['Chemical Engineering', 32000]]),
    nit('National Institute of Technology Rourkela', 'Rourkela', 'Odisha', 12, 8500, 14000, 25000, 18000, 35000, [['Metallurgical Engineering', 38000]]),
    nit('National Institute of Technology Calicut', 'Kozhikode', 'Kerala', 13, 8200, 13500, 24000, 16000, 32000, [['Chemical Engineering', 34000]]),
    nit('Motilal Nehru National Institute of Technology Allahabad', 'Prayagraj', 'Uttar Pradesh', 15, 9000, 15000, 26000, 19000, 36000, [['Biotechnology', 40000]]),
    nit('Visvesvaraya National Institute of Technology Nagpur', 'Nagpur', 'Maharashtra', 16, 10000, 16000, 28000, 20000, 38000),
    nit('Sardar Vallabhbhai National Institute of Technology Surat', 'Surat', 'Gujarat', 17, 11000, 18000, 30000, 22000, 40000, [['Chemical Engineering', 42000]]),
    nit('Malaviya National Institute of Technology Jaipur', 'Jaipur', 'Rajasthan', 18, 9500, 15500, 27000, 20000, 37000),
    nit('National Institute of Technology Karnataka Surathkal', 'Surathkal', 'Karnataka', 14, 7500, 12000, 22000, 15000, 30000, [['Information Technology', 10000]]),
    nit('National Institute of Technology Kurukshetra', 'Kurukshetra', 'Haryana', 30, 13000, 20000, 35000, 25000, 45000),
    nit('National Institute of Technology Durgapur', 'Durgapur', 'West Bengal', 32, 14000, 22000, 37000, 27000, 47000, [['Information Technology', 16000]]),
    nit('National Institute of Technology Silchar', 'Silchar', 'Assam', 45, 16000, 25000, 40000, 30000, 50000),
    nit('National Institute of Technology Hamirpur', 'Hamirpur', 'Himachal Pradesh', 50, 17000, 26000, 42000, 32000, 52000),
    nit('National Institute of Technology Jamshedpur', 'Jamshedpur', 'Jharkhand', 38, 15000, 23000, 38000, 28000, 48000),
    nit('National Institute of Technology Patna', 'Patna', 'Bihar', 42, 13500, 21000, 36000, 26000, 46000),
    nit('National Institute of Technology Agartala', 'Agartala', 'Tripura', 55, 20000, 30000, 48000, 35000, 55000),
    nit('National Institute of Technology Raipur', 'Raipur', 'Chhattisgarh', 48, 18000, 28000, 44000, 33000, 53000),
    nit('National Institute of Technology Srinagar', 'Srinagar', 'Jammu and Kashmir', 52, 19000, 29000, 46000, 34000, 54000),
    nit('National Institute of Technology Meghalaya', 'Shillong', 'Meghalaya', 60, 22000, 32000, 50000, 37000, 57000),
    nit('National Institute of Technology Nagaland', 'Dimapur', 'Nagaland', 65, 24000, 34000, 52000, 39000, 59000),
    nit('National Institute of Technology Manipur', 'Imphal', 'Manipur', 62, 23000, 33000, 51000, 38000, 58000),
    nit('National Institute of Technology Mizoram', 'Aizawl', 'Mizoram', 68, 25000, 35000, 53000, 40000, 60000),
    nit('National Institute of Technology Sikkim', 'Ravangla', 'Sikkim', 70, 26000, 36000, 54000, 41000, 61000),
    nit('National Institute of Technology Arunachal Pradesh', 'Yupia', 'Arunachal Pradesh', 72, 27000, 37000, 55000, 42000, 62000),
    nit('National Institute of Technology Uttarakhand', 'Srinagar', 'Uttarakhand', 58, 21000, 31000, 49000, 36000, 56000),
    nit('National Institute of Technology Andhra Pradesh', 'Tadepalligudem', 'Andhra Pradesh', 35, 14500, 22500, 38000, 28000, 48000),
    nit('National Institute of Technology Goa', 'Ponda', 'Goa', 56, 19500, 29500, 47000, 35000, 55000),
    nit('National Institute of Technology Delhi', 'New Delhi', 'Delhi', 28, 9800, 16000, 28000, 21000, 38000, [['Artificial Intelligence and Data Science', 8000]]),
    nit('National Institute of Technology Puducherry', 'Karaikal', 'Puducherry', 64, 22500, 33000, 51000, 38000, 58000),
    nit('Maulana Azad National Institute of Technology Bhopal', 'Bhopal', 'Madhya Pradesh', 23, 11500, 18500, 31000, 23000, 41000, [['Information Technology', 13000]]),
];

// ═══════════════════════════════════════════════════════
// ALL 26 IIITs (JEE Main Cutoffs)
// ═══════════════════════════════════════════════════════

function iiit(name: string, city: string, state: string, nirf: number | undefined,
    cse: number, ece: number, extras?: [string, number][]): CollegeSeed {
    const branches: [string, number][] = [
        ['Computer Science and Engineering', cse],
        ['Electronics and Communication Engineering', ece],
        ...(extras || []),
    ];
    return mkCollege(name, city, state, 'Government', nirf, 220000, 'B.Tech', '4 Years', genWithQuota('JEE Main', branches));
}

const iiitData: CollegeSeed[] = [
    iiit('Indian Institute of Information Technology Hyderabad', 'Hyderabad', 'Telangana', 20, 3200, 6500, [['Computer Science with AI', 2800]]),
    iiit('Indian Institute of Information Technology Allahabad', 'Prayagraj', 'Uttar Pradesh', 25, 5500, 11000, [['Information Technology', 7000]]),
    iiit('Indian Institute of Information Technology Bangalore', 'Bangalore', 'Karnataka', 22, 4500, 8000),
    iiit('Indian Institute of Information Technology Delhi', 'New Delhi', 'Delhi', 23, 4000, 7500, [['Computer Science and Artificial Intelligence', 3800]]),
    iiit('Indian Institute of Information Technology Gwalior', 'Gwalior', 'Madhya Pradesh', 28, 7000, 13000, [['Information Technology', 9000]]),
    iiit('Indian Institute of Information Technology Jabalpur', 'Jabalpur', 'Madhya Pradesh', 35, 9000, 15000),
    iiit('Indian Institute of Information Technology Kota', 'Kota', 'Rajasthan', 40, 10000, 16000),
    iiit('Indian Institute of Information Technology Lucknow', 'Lucknow', 'Uttar Pradesh', 38, 9500, 15500),
    iiit('Indian Institute of Information Technology Sri City', 'Sri City', 'Andhra Pradesh', 42, 10500, 17000),
    iiit('Indian Institute of Information Technology Vadodara', 'Vadodara', 'Gujarat', 45, 11000, 18000),
    iiit('Indian Institute of Information Technology Kancheepuram', 'Chennai', 'Tamil Nadu', 33, 8500, 14000),
    iiit('Indian Institute of Information Technology Kalyani', 'Kalyani', 'West Bengal', 50, 12000, 19000),
    iiit('Indian Institute of Information Technology Sonepat', 'Sonepat', 'Haryana', 48, 11500, 18500),
    iiit('Indian Institute of Information Technology Una', 'Una', 'Himachal Pradesh', 52, 13000, 20000),
    iiit('Indian Institute of Information Technology Ranchi', 'Ranchi', 'Jharkhand', 55, 14000, 22000),
    iiit('Indian Institute of Information Technology Nagpur', 'Nagpur', 'Maharashtra', 47, 11500, 18000),
    iiit('Indian Institute of Information Technology Pune', 'Pune', 'Maharashtra', 43, 10500, 17000),
    iiit('Indian Institute of Information Technology Dharwad', 'Dharwad', 'Karnataka', 49, 12000, 19000),
    iiit('Indian Institute of Information Technology Tiruchirappalli', 'Tiruchirappalli', 'Tamil Nadu', 44, 11000, 17500),
    iiit('Indian Institute of Information Technology Surat', 'Surat', 'Gujarat', 46, 11500, 18000),
    iiit('Indian Institute of Information Technology Bhagalpur', 'Bhagalpur', 'Bihar', 58, 15000, 23000),
    iiit('Indian Institute of Information Technology Bhopal', 'Bhopal', 'Madhya Pradesh', 53, 13500, 21000),
    iiit('Indian Institute of Information Technology Agartala', 'Agartala', 'Tripura', 62, 17000, 25000),
    iiit('Indian Institute of Information Technology Manipur', 'Imphal', 'Manipur', 65, 18000, 26000),
    iiit('Indian Institute of Information Technology Raichur', 'Raichur', 'Karnataka', 60, 16000, 24000),
    iiit('Indian Institute of Information Technology Killikollur', 'Kollam', 'Kerala', 57, 14500, 22500),
];

// ═══════════════════════════════════════════════════════
// GFTIs & STATE ENGINEERING (JEE Main)
// ═══════════════════════════════════════════════════════

function gfti(name: string, city: string, state: string, nirf: number | undefined, fee: number,
    cse: number, ece: number, me: number, ee: number, ce: number, extras?: [string, number][]): CollegeSeed {
    const branches: [string, number][] = [
        ['Computer Science and Engineering', cse],
        ['Electronics and Communication Engineering', ece],
        ['Mechanical Engineering', me],
        ['Electrical Engineering', ee],
        ['Civil Engineering', ce],
        ...(extras || []),
    ];
    return mkCollege(name, city, state, 'Government', nirf, fee, 'B.Tech', '4 Years', gen('JEE Main', branches));
}

const gftiData: CollegeSeed[] = [
    gfti('Birla Institute of Technology Mesra', 'Ranchi', 'Jharkhand', 35, 250000, 18000, 30000, 45000, 35000, 50000),
    gfti('Indian Institute of Engineering Science and Technology Shibpur', 'Howrah', 'West Bengal', 28, 120000, 12000, 20000, 32000, 24000, 42000),
    gfti('Jamia Millia Islamia', 'New Delhi', 'Delhi', 32, 90000, 15000, 25000, 40000, 30000, 50000),
    gfti('Delhi Technological University', 'New Delhi', 'Delhi', 40, 180000, 3500, 8000, 20000, 12000, 30000, [['Information Technology', 5000], ['Software Engineering', 6000]]),
    gfti('Netaji Subhas University of Technology', 'New Delhi', 'Delhi', 55, 175000, 3200, 7500, 18000, 11000, 28000, [['Information Technology', 4800]]),
    gfti('Jadavpur University', 'Kolkata', 'West Bengal', 15, 15000, 5000, 10000, 18000, 12000, 25000, [['Information Technology', 7000]]),
    gfti('Thapar Institute of Engineering and Technology', 'Patiala', 'Punjab', 33, 350000, 15000, 25000, 40000, 30000, 48000, [['Computer Science with Data Science', 12000]]),
    gfti('PEC Chandigarh', 'Chandigarh', 'Chandigarh', 42, 120000, 8000, 15000, 28000, 20000, 38000),
    gfti('Indian Institute of Space Science and Technology', 'Thiruvananthapuram', 'Kerala', 19, 50000, 2000, 4000, 6000, 5000, 8000, [['Avionics', 3000]]),
    gfti('Institute of Chemical Technology Mumbai', 'Mumbai', 'Maharashtra', 21, 35000, 8000, 12000, 20000, 15000, 25000, [['Chemical Engineering', 5000], ['Pharmaceutical Chemistry', 10000]]),
    gfti('Harcourt Butler Technical University', 'Kanpur', 'Uttar Pradesh', 75, 100000, 20000, 30000, 45000, 35000, 50000),
    gfti('Aligarh Muslim University', 'Aligarh', 'Uttar Pradesh', 27, 30000, 12000, 20000, 32000, 24000, 42000),
    gfti('Banaras Hindu University IIT', 'Varanasi', 'Uttar Pradesh', 10, 50000, 2000, 4000, 6500, 5000, 8500),
    gfti('National Institute of Foundry and Forge Technology', 'Ranchi', 'Jharkhand', 80, 120000, 22000, 32000, 48000, 38000, 55000),
    gfti('School of Planning and Architecture Delhi', 'New Delhi', 'Delhi', 12, 80000, 0, 0, 0, 0, 2000, [['Architecture', 800], ['Planning', 1500]]),
];

// ═══════════════════════════════════════════════════════
// PRIVATE ENGINEERING COLLEGES (JEE Main / Own Exam)
// ═══════════════════════════════════════════════════════

function pvt(name: string, city: string, state: string, nirf: number | undefined, fee: number,
    cse: number, ece: number, me: number, extras?: [string, number][]): CollegeSeed {
    const branches: [string, number][] = [
        ['Computer Science and Engineering', cse],
        ['Electronics and Communication Engineering', ece],
        ['Mechanical Engineering', me],
        ...(extras || []),
    ];
    return mkCollege(name, city, state, 'Private', nirf, fee, 'B.Tech', '4 Years', gen('JEE Main', branches));
}

const privateData: CollegeSeed[] = [
    pvt('BITS Pilani', 'Pilani', 'Rajasthan', 25, 550000, 3000, 6000, 15000, [['Electronics and Instrumentation', 8000], ['Chemical Engineering', 18000]]),
    pvt('BITS Pilani Goa Campus', 'Goa', 'Goa', 30, 550000, 5000, 9000, 20000),
    pvt('BITS Pilani Hyderabad Campus', 'Hyderabad', 'Telangana', 28, 550000, 4500, 8000, 18000),
    pvt('VIT Vellore', 'Vellore', 'Tamil Nadu', 12, 300000, 8000, 15000, 28000, [['Computer Science with AI', 6000], ['Information Technology', 10000]]),
    pvt('VIT Chennai', 'Chennai', 'Tamil Nadu', 18, 300000, 12000, 20000, 35000),
    pvt('SRM Institute of Science and Technology', 'Chennai', 'Tamil Nadu', 22, 350000, 10000, 18000, 30000, [['Computer Science with AI', 8000]]),
    pvt('Manipal Institute of Technology', 'Manipal', 'Karnataka', 35, 450000, 12000, 20000, 35000, [['Information Technology', 15000]]),
    pvt('PSG College of Technology', 'Coimbatore', 'Tamil Nadu', 40, 120000, 6000, 12000, 22000),
    pvt('Amity University', 'Noida', 'Uttar Pradesh', 50, 350000, 20000, 30000, 45000),
    pvt('Lovely Professional University', 'Phagwara', 'Punjab', 55, 200000, 25000, 35000, 50000),
    pvt('Presidency University Bangalore', 'Bangalore', 'Karnataka', 60, 280000, 22000, 32000, 48000),
    pvt('Kalinga Institute of Industrial Technology', 'Bhubaneswar', 'Odisha', 20, 250000, 15000, 22000, 35000, [['Information Technology', 18000]]),
    pvt('Shiv Nadar University', 'Greater Noida', 'Uttar Pradesh', 38, 500000, 10000, 18000, 30000),
    pvt('Thapar Institute of Engineering and Technology Patiala', 'Patiala', 'Punjab', 33, 350000, 14000, 24000, 38000),
    pvt('Nirma University', 'Ahmedabad', 'Gujarat', 45, 180000, 16000, 25000, 40000),
    pvt('Symbiosis Institute of Technology', 'Pune', 'Maharashtra', 48, 400000, 18000, 28000, 42000),
    pvt('Bennett University', 'Greater Noida', 'Uttar Pradesh', 52, 450000, 20000, 30000, 45000),
    pvt('Chandigarh University', 'Mohali', 'Punjab', 42, 250000, 18000, 28000, 42000, [['Artificial Intelligence', 15000]]),
];

// ═══════════════════════════════════════════════════════
// MEDICAL COLLEGES (NEET Cutoffs)
// ═══════════════════════════════════════════════════════

function med(name: string, city: string, state: string, nirf: number | undefined, fee: number, type: string,
    mbbs: number, bds?: number): CollegeSeed {
    const branches: [string, number][] = [['MBBS', mbbs]];
    if (bds) branches.push(['BDS', bds]);
    return mkCollege(name, city, state, type, nirf, fee, 'MBBS', '5.5 Years', genWithQuota('NEET', branches));
}

const medicalData: CollegeSeed[] = [
    med('All India Institute of Medical Sciences New Delhi', 'New Delhi', 'Delhi', 1, 7500, 'Government', 50),
    med('All India Institute of Medical Sciences Bhopal', 'Bhopal', 'Madhya Pradesh', 15, 7500, 'Government', 2000),
    med('All India Institute of Medical Sciences Bhubaneswar', 'Bhubaneswar', 'Odisha', 18, 7500, 'Government', 2200),
    med('All India Institute of Medical Sciences Jodhpur', 'Jodhpur', 'Rajasthan', 12, 7500, 'Government', 1800),
    med('All India Institute of Medical Sciences Patna', 'Patna', 'Bihar', 20, 7500, 'Government', 2500),
    med('All India Institute of Medical Sciences Rishikesh', 'Rishikesh', 'Uttarakhand', 16, 7500, 'Government', 2100),
    med('All India Institute of Medical Sciences Raipur', 'Raipur', 'Chhattisgarh', 22, 7500, 'Government', 2800),
    med('All India Institute of Medical Sciences Nagpur', 'Nagpur', 'Maharashtra', 25, 7500, 'Government', 3200),
    med('All India Institute of Medical Sciences Mangalagiri', 'Mangalagiri', 'Andhra Pradesh', 28, 7500, 'Government', 3500),
    med('All India Institute of Medical Sciences Kalyani', 'Kalyani', 'West Bengal', 30, 7500, 'Government', 4000),
    med('JIPMER Puducherry', 'Puducherry', 'Puducherry', 3, 14000, 'Government', 150),
    med('Christian Medical College Vellore', 'Vellore', 'Tamil Nadu', 2, 50000, 'Private', 500, 8000),
    med('Armed Forces Medical College Pune', 'Pune', 'Maharashtra', 5, 20000, 'Government', 300),
    med('Maulana Azad Medical College Delhi', 'New Delhi', 'Delhi', 6, 15000, 'Government', 200),
    med('Institute of Medical Sciences BHU Varanasi', 'Varanasi', 'Uttar Pradesh', 7, 18000, 'Government', 800),
    med('King George Medical University Lucknow', 'Lucknow', 'Uttar Pradesh', 8, 45000, 'Government', 2000, 15000),
    med('Grant Medical College Mumbai', 'Mumbai', 'Maharashtra', 10, 25000, 'Government', 1000, 12000),
    med('University College of Medical Sciences Delhi', 'New Delhi', 'Delhi', 15, 12000, 'Government', 3000),
    med('Lady Hardinge Medical College Delhi', 'New Delhi', 'Delhi', 11, 10000, 'Government', 1500),
    med('Seth GS Medical College Mumbai', 'Mumbai', 'Maharashtra', 9, 25000, 'Government', 900),
    med('Kasturba Medical College Manipal', 'Manipal', 'Karnataka', 12, 2300000, 'Private', 5000, 20000),
    med('St Johns Medical College Bangalore', 'Bangalore', 'Karnataka', 14, 350000, 'Private', 4000, 18000),
    med('Jawaharlal Nehru Medical College Belgaum', 'Belgaum', 'Karnataka', 20, 800000, 'Private', 8000, 25000),
    med('Govt Medical College Thiruvananthapuram', 'Thiruvananthapuram', 'Kerala', 18, 15000, 'Government', 5000, 22000),
    med('Bangalore Medical College', 'Bangalore', 'Karnataka', 16, 20000, 'Government', 4500, 20000),
    med('Madras Medical College', 'Chennai', 'Tamil Nadu', 13, 15000, 'Government', 3500, 18000),
    med('Govt Medical College Kozhikode', 'Kozhikode', 'Kerala', 22, 15000, 'Government', 5500, 23000),
    med('SMS Medical College Jaipur', 'Jaipur', 'Rajasthan', 19, 20000, 'Government', 6000, 24000),
    med('Osmania Medical College Hyderabad', 'Hyderabad', 'Telangana', 17, 15000, 'Government', 5000, 22000),
    med('GMC Nagpur', 'Nagpur', 'Maharashtra', 24, 25000, 'Government', 7000, 25000),
    med('B J Medical College Ahmedabad', 'Ahmedabad', 'Gujarat', 21, 18000, 'Government', 4000, 20000),
    med('PGIMER Chandigarh', 'Chandigarh', 'Chandigarh', 4, 10000, 'Government', 100),
    med('NIMHANS Bangalore', 'Bangalore', 'Karnataka', 8, 15000, 'Government', 600),
    med('Amrita Institute of Medical Sciences', 'Kochi', 'Kerala', 25, 1500000, 'Private', 10000, 30000),
    med('Manipal Academy of Higher Education', 'Manipal', 'Karnataka', 10, 2500000, 'Private', 6000, 22000),
];

// ═══════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════

async function seedCutoffs() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB\n');

        const allColleges = [
            ...iitData,
            ...nitData,
            ...iiitData,
            ...gftiData,
            ...privateData,
            ...medicalData,
        ];

        console.log(`Total colleges to seed: ${allColleges.length}`);
        console.log(`  IITs: ${iitData.length}`);
        console.log(`  NITs: ${nitData.length}`);
        console.log(`  IIITs: ${iiitData.length}`);
        console.log(`  GFTIs: ${gftiData.length}`);
        console.log(`  Private: ${privateData.length}`);
        console.log(`  Medical: ${medicalData.length}\n`);

        let created = 0;
        let updated = 0;
        let errors = 0;

        for (const collegeData of allColleges) {
            try {
                const existing = await College.findOne({ slug: collegeData.slug });

                if (existing) {
                    existing.cutoffs = collegeData.cutoffs as any;
                    if (collegeData.nirfRank) existing.nirfRank = collegeData.nirfRank;
                    if (collegeData.coursesOffered.length > 0 && existing.coursesOffered.length === 0) {
                        existing.coursesOffered = collegeData.coursesOffered as any;
                    }
                    if (collegeData.description && !existing.description) {
                        existing.description = collegeData.description;
                    }
                    await existing.save();
                    updated++;
                } else {
                    await College.create({
                        ...collegeData,
                        placements: { averagePackage: 0, highestPackage: 0, placementPercentage: 0 },
                        gallery: [],
                        facilities: [],
                        scholarships: [],
                        importantDates: [],
                        admissionProcess: [],
                        requiredDocuments: [],
                    });
                    created++;
                }
            } catch (err: any) {
                // Handle duplicate slug errors gracefully
                if (err.code === 11000) {
                    // Try updating instead
                    try {
                        await College.updateOne(
                            { slug: collegeData.slug },
                            { $set: { cutoffs: collegeData.cutoffs, nirfRank: collegeData.nirfRank } }
                        );
                        updated++;
                    } catch {
                        errors++;
                        console.error(`  ❌ Failed: ${collegeData.name}`);
                    }
                } else {
                    errors++;
                    console.error(`  ❌ Failed: ${collegeData.name} - ${err.message}`);
                }
            }
        }

        console.log(`\n═══ Seed Complete ═══`);
        console.log(`✨ Created: ${created}`);
        console.log(`✅ Updated: ${updated}`);
        if (errors) console.log(`❌ Errors: ${errors}`);
        console.log(`📊 Total processed: ${allColleges.length}`);

        // Verify
        const withCutoffs = await College.countDocuments({ 'cutoffs.0': { $exists: true } });
        const totalCutoffs = await College.aggregate([
            { $match: { 'cutoffs.0': { $exists: true } } },
            { $project: { count: { $size: '$cutoffs' } } },
            { $group: { _id: null, total: { $sum: '$count' } } }
        ]);
        console.log(`\n📈 Colleges with cutoff data: ${withCutoffs}`);
        console.log(`📈 Total cutoff entries: ${totalCutoffs[0]?.total || 0}`);

        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seedCutoffs();
