import {
  FaUniversity, FaBookOpen, FaLaptopCode, FaStethoscope,
  FaBalanceScale, FaChartLine, FaDraftingCompass, FaGlobeAmericas,
  FaListUl, FaRegComments, FaConciergeBell, FaBroadcastTower,
  FaCalculator, FaAtom, FaPalette, FaChalkboardTeacher, FaDesktop
} from 'react-icons/fa';

// ... (existing code)

export const examCategories = [
  { id: 1, title: 'Engineering', subtext: 'JEE Main, GATE', icon: FaLaptopCode, color: '#4CAF50', link: '/engineering' },
  { id: 2, title: 'Medical', subtext: 'NEET, AIIMS', icon: FaStethoscope, color: '#2196F3', link: '/medicine' },
  { id: 3, title: 'MBA', subtext: 'CAT, XAT, MAT', icon: FaChartLine, color: '#FF9800', link: '/management' },
  { id: 4, title: 'Law', subtext: 'CLAT, AILET', icon: FaBalanceScale, color: '#9C27B0', link: '/law' },
  { id: 5, title: 'Pharmacy', subtext: 'GPAT, NIPER', icon: FaBookOpen, color: '#f44336', link: '/pharmacy' },
  { id: 6, title: 'Universities', subtext: 'CUET, DUET', icon: FaUniversity, color: '#607D8B', link: '/universities' },
  { id: 7, title: 'Design', subtext: 'NIFT, NID', icon: FaDraftingCompass, color: '#E91E63', link: '/design' },
  { id: 8, title: 'Study Abroad', subtext: 'GRE, GMAT', icon: FaGlobeAmericas, color: '#3F51B5', link: '/study-abroad' },
];

export const allExamCategories = [
  ...examCategories,
  { id: 9, title: 'Hospitality', subtext: 'NCHMCT JEE', icon: FaConciergeBell, color: '#FF5722', link: '/hospitality' },
  { id: 10, title: 'Media', subtext: 'IIMC, JMI', icon: FaBroadcastTower, color: '#795548', link: '/media' },
  { id: 11, title: 'Commerce', subtext: 'CA, CS, CMA', icon: FaCalculator, color: '#607D8B', link: '/commerce' },
  { id: 12, title: 'Science', subtext: 'CUET, NEST', icon: FaAtom, color: '#00BCD4', link: '/science' },
  { id: 13, title: 'Arts', subtext: 'Humanities', icon: FaPalette, color: '#FFEB3B', link: '/arts' },
  { id: 14, title: 'Education', subtext: 'B.Ed, TET', icon: FaChalkboardTeacher, color: '#8BC34A', link: '/education' },
  { id: 15, title: 'Computer App', subtext: 'BCA, MCA', icon: FaDesktop, color: '#3F51B5', link: '/computer-applications' },
];

export const collegesData = [
  {
    id: 'top-colleges',
    label: 'Top Colleges',
    titles: { col1: 'Top Ranked', col2: 'By Placement', col3_1: 'By City', col3_2: 'By State' },
    content: {
      exams: [
        { title: 'Top Engineering Colleges', href: '/colleges?search=Engineering' },
        { title: 'Top MBA Colleges', href: '/colleges?search=MBA' },
        { title: 'Top Medical Colleges', href: '/colleges?search=Medical' },
        { title: 'Top Law Colleges', href: '/colleges?search=Law' },
        { title: 'Top Pharmacy Colleges', href: '/colleges?search=Pharmacy' }
      ],
      colleges: [
        { title: 'Colleges with Best ROI', href: '#' },
        { title: 'Best Placements 2025', href: '#' },
        { title: 'Highest Package Colleges', href: '#' }
      ],
      predictors: [
        { title: 'Colleges in Delhi NCR', href: '/colleges?state=Delhi' },
        { title: 'Colleges in Bangalore', href: '/colleges?search=Bangalore' },
        { title: 'Colleges in Mumbai', href: '/colleges?search=Mumbai' }
      ],
      resources: [
        { title: 'Colleges in Uttar Pradesh', href: '/colleges?search=Uttar Pradesh' },
        { title: 'Colleges in Maharashtra', href: '/colleges?state=Maharashtra' },
        { title: 'Colleges in Karnataka', href: '/colleges?state=Karnataka' }
      ]
    }
  },
  {
    id: 'state-colleges',
    label: 'Colleges By State',
    titles: { col1: 'North India', col2: 'South India', col3_1: 'East India', col3_2: 'West India' },
    content: {
      exams: [
        { title: 'Delhi', href: '/colleges?state=Delhi' },
        { title: 'Uttar Pradesh', href: '/colleges?search=Uttar Pradesh' },
        { title: 'Punjab', href: '/colleges?search=Punjab' }
      ],
      colleges: [
        { title: 'Tamil Nadu', href: '/colleges?state=Tamil Nadu' },
        { title: 'Karnataka', href: '/colleges?state=Karnataka' },
        { title: 'Kerala', href: '/colleges?search=Kerala' }
      ],
      predictors: [
        { title: 'West Bengal', href: '/colleges?search=West Bengal' },
        { title: 'Bihar', href: '/colleges?search=Bihar' }
      ],
      resources: [
        { title: 'Maharashtra', href: '/colleges?state=Maharashtra' },
        { title: 'Gujarat', href: '/colleges?search=Gujarat' }
      ]
    }
  },
  {
    id: 'city-colleges',
    label: 'Colleges By City',
    titles: { col1: 'Metro Cities', col2: 'Education Hubs', col3_1: 'Tier 2 Cities', col3_2: 'Others' },
    content: {
      exams: [
        { title: 'Delhi', href: '#' },
        { title: 'Mumbai', href: '#' },
        { title: 'Bangalore', href: '#' },
        { title: 'Chennai', href: '#' }
      ],
      colleges: [
        { title: 'Kota', href: '#' },
        { title: 'Pune', href: '#' },
        { title: 'Hyderabad', href: '#' }
      ],
      predictors: [
        { title: 'Lucknow', href: '#' },
        { title: 'Jaipur', href: '#' },
        { title: 'Chandigarh', href: '#' }
      ],
      resources: [
        { title: 'Indore', href: '#' },
        { title: 'Bhopal', href: '#' },
        { title: 'Nagpur', href: '#' }
      ]
    }
  }
];

export const testPrepData = [
  {
    id: 'engineering-prep',
    label: 'Engineering',
    titles: { col1: 'Exam Prep', col2: 'Mock Tests', col3_1: 'Previous Papers', col3_2: 'Resources' },
    content: {
      exams: [
        { title: 'JEE Main Preparation', href: '#' },
        { title: 'JEE Advanced Preparation', href: '#' },
        { title: 'BITSAT Preparation', href: '#' },
        { title: 'VITEEE Preparation', href: '#' }
      ],
      colleges: [
        { title: 'JEE Main Mock Test', href: '#' },
        { title: 'JEE Advanced Mock Test', href: '#' },
        { title: 'BITSAT Mock Test', href: '#' },
        { title: 'VITEEE Mock Test', href: '#' }
      ],
      predictors: [
        { title: 'JEE Main 2025 Paper', href: '#' },
        { title: 'JEE Advanced 2024 Paper', href: '#' },
        { title: 'BITSAT Previous Papers', href: '#' }
      ],
      resources: [
        { title: 'Engineering Study Material', href: '#' },
        { title: 'Toppers Strategy', href: '#' },
        { title: 'Important Topics', href: '#' }
      ]
    }
  },
  {
    id: 'medical-prep',
    label: 'Medical',
    titles: { col1: 'Exam Prep', col2: 'Mock Tests', col3_1: 'Previous Papers', col3_2: 'Resources' },
    content: {
      exams: [
        { title: 'NEET UG Preparation', href: '#' },
        { title: 'NEET PG Preparation', href: '#' },
        { title: 'AIIMS Preparation', href: '#' }
      ],
      colleges: [
        { title: 'NEET Free Mock Test', href: '#' },
        { title: 'NEET PG Mock Test', href: '#' },
        { title: 'Biology Chapter-wise Test', href: '#' },
        { title: 'Physics Chapter-wise Test', href: '#' }
      ],
      predictors: [
        { title: 'NEET 2025 Question Paper', href: '#' },
        { title: 'NEET 2024 Question Paper', href: '#' },
        { title: 'AIIMS Previous Papers', href: '#' }
      ],
      resources: [
        { title: 'NCERT Solutions', href: '#' },
        { title: 'NEET Biology Notes', href: '#' },
        { title: 'Medical Counselling', href: '#' }
      ]
    }
  },
  {
    id: 'mba-prep',
    label: 'MBA',
    titles: { col1: 'Exam Prep', col2: 'Mock Tests', col3_1: 'Previous Papers', col3_2: 'Resources' },
    content: {
      exams: [
        { title: 'CAT Preparation', href: '#' },
        { title: 'XAT Preparation', href: '#' },
        { title: 'MAT Preparation', href: '#' }
      ],
      colleges: [
        { title: 'CAT Free Mock Test', href: '#' },
        { title: 'XAT Mock Test', href: '#' },
        { title: 'NMAT Mock Test', href: '#' }
      ],
      predictors: [
        { title: 'CAT 2024 Question Paper', href: '#' },
        { title: 'XAT Previous Papers', href: '#' }
      ],
      resources: [
        { title: 'Data Interpretation Notes', href: '#' },
        { title: 'Verbal Ability Tips', href: '#' }
      ]
    }
  }
];

export const browseByStreamData = [
  {
    id: 'engineering',
    label: 'Engineering and Architecture',
    link: '/engineering',
    titles: {
      col1: 'Exams',
      col2: 'Colleges',
      col3_1: 'Predictors',
      col3_2: 'Resources'
    },
    content: {
      exams: [
        { title: 'JEE Main Exam', href: '/exams/jee-main' },
        { title: 'BITSAT Exam', href: '#' },
        { title: 'JEE Advanced Exam', href: '#' },
        { title: 'VITEEE Exam', href: '#' },
        { title: 'UPESEAT- B.Tech', href: '#' },
        { title: 'AEEE Exam', href: '#' },
        { title: 'MHT CET', href: '#' },
        { title: 'View All Engineering Exams', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Colleges Accepting B.Tech Applications', href: '#' },
        { title: 'Top Engineering Colleges in India', href: '#' },
        { title: 'Engineering Colleges in India', href: '#' },
        { title: 'Engineering Colleges in Tamil Nadu', href: '#' },
        { title: 'Engineering Colleges Accepting JEE Main', href: '#' },
        { title: 'Top IITs in India', href: '#' },
        { title: 'Top NITs in India', href: '#' },
        { title: 'Top IIITs in India', href: '#' }
      ],
      predictors: [
        { title: 'JEE Main College Predictor', href: '/jee-main-predictor' },
        { title: 'JEE Main Rank Predictor', href: '/jee-main-rank-predictor' },
        { title: 'MHT CET College Predictor', href: '#' },
        { title: 'AP EAMCET College Predictor', href: '#' },
        { title: 'GATE College Predictor', href: '#' },
        { title: 'KCET College Predictor', href: '#' },
        { title: 'JEE Advanced College Predictor', href: '#' },
        { title: 'View All College Predictors', href: '#', isLink: true }
      ],
      resources: [
        { title: 'JEE Main Admit Card 2026', href: '#' },
        { title: 'JEE Main Cutoff', href: '#' },
        { title: 'GATE Admit Card 2026', href: '#' },
        { title: 'JEE Main Syllabus 2026', href: '#' },
        { title: 'Download E-Books and Sample Papers', href: '#' },
        { title: 'Compare Colleges', href: '#' },
        { title: 'B.Tech College Applications', href: '#' },
        { title: 'JEE Main Question Papers', href: '#' }
      ]
    }
  },
  {
    id: 'management',
    label: 'Management and Business Administration',
    link: '/management',
    titles: {
      col1: 'Exams',
      col2: 'Colleges & Courses',
      col3_1: 'Predictors',
      col3_2: 'Resources'
    },
    content: {
      exams: [
        { title: 'XAT Exam', href: '#' },
        { title: 'CAT Exam', href: '#' },
        { title: 'IBSAT Exam', href: '#' },
        { title: 'NMAT Exam', href: '#' },
        { title: 'MICAT Exam', href: '#' },
        { title: 'CMAT Exam', href: '#' },
        { title: 'SNAP Exam', href: '#' },
        { title: 'View All Management Exams', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Top MBA Colleges in India', href: '#' },
        { title: 'MBA College Admissions', href: '#' },
        { title: 'MBA Colleges in India', href: '#' },
        { title: 'Top IIMs Colleges in India', href: '#' },
        { title: 'Top Online MBA Colleges in India', href: '#' },
        { title: 'Online MBA', href: '#' },
        { title: 'MBA Colleges Accepting XAT Score', href: '#' },
        { title: 'BBA Colleges in India', href: '#' }
      ],
      predictors: [
        { title: 'XAT College Predictor 2026', href: '#' },
        { title: 'SNAP College Predictor', href: '#' },
        { title: 'NMAT College Predictor', href: '#' },
        { title: 'MAT College Predictor 2025', href: '#' },
        { title: 'CMAT College Predictor 2026', href: '#' },
        { title: 'CAT Percentile Predictor 2025', href: '#' },
        { title: 'CAT 2025 College Predictor', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      resources: [
        { title: 'Top MBA Entrance Exams in India', href: '#' },
        { title: 'CAT Result 2025', href: '#' },
        { title: 'XAT Admit Card 2026', href: '#' },
        { title: 'IBSAT Mock Test', href: '#' },
        { title: 'Download Helpful Ebooks', href: '#' },
        { title: 'List of Popular Branches', href: '#' },
        { title: 'QnA - Get answers to your doubts', href: '#' },
        { title: 'IIM Fees Structure', href: '#' }
      ]
    }
  },
  {
    id: 'medical',
    label: 'Medicine and Allied Sciences',
    link: '/medicine',
    titles: { col1: 'Exams', col2: 'Colleges', col3_1: 'Predictors', col3_2: 'Resources' },
    content: {
      exams: [
        { title: 'NEET', href: '/exams/neet-ug' },
        { title: 'NEET PG', href: '#' },
        { title: 'NEET MDS', href: '#' },
        { title: 'FMGE', href: '#' },
        { title: 'INI CET', href: '#' },
        { title: 'AIIMS Nursing', href: '#' },
        { title: 'AIAPGET', href: '#' },
        { title: 'View All Medicine Exams', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Top Medical Colleges in India', href: '#' },
        { title: 'Top Medical Colleges in India accepting NEET Score', href: '#' },
        { title: 'Medical Colleges accepting NEET', href: '#' },
        { title: 'List of Medical Colleges in India', href: '#' },
        { title: 'List of AIIMS Colleges in India', href: '#' },
        { title: 'Medical Colleges in Maharashtra', href: '#' },
        { title: 'Medical Colleges in India Accepting NEET PG', href: '#' }
      ],
      predictors: [
        { title: 'NEET College Predictor', href: '#' },
        { title: 'NEET PG College Predictor', href: '#' },
        { title: 'NEET MDS College Predictor', href: '#' },
        { title: 'NEET Rank Predictor', href: '#' },
        { title: 'DNB PDCET College Predictor', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      resources: [
        { title: 'NEET Syllabus 2026', href: '#' },
        { title: 'NEET Exam Date 2026', href: '#' },
        { title: 'NEET Cut off', href: '#' },
        { title: 'NEET Counselling 2025', href: '#' },
        { title: 'Download Helpful E-books', href: '#' },
        { title: 'QnA - Get answers to your doubts', href: '#' }
      ]
    }
  },
  {
    id: 'law',
    label: 'Law',
    link: '/law',
    titles: {
      col1: 'Exams',
      col2: 'Colleges',
      col3_1: 'Predictors & E-Books',
      col3_2: 'Resources'
    },
    content: {
      exams: [
        { title: 'CLAT', href: '#' },
        { title: 'AILET', href: '#' },
        { title: 'SLAT', href: '#' },
        { title: 'AP LAWCET', href: '#' },
        { title: 'MH CET Law', href: '#' },
        { title: 'AIBE', href: '#' },
        { title: 'ULSAT-LLB', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Colleges Accepting Admissions', href: '#' },
        { title: 'Top Law Colleges in India', href: '#' },
        { title: 'Law College Accepting CLAT Score', href: '#' },
        { title: 'List of Law Colleges in India', href: '#' },
        { title: 'Top Law Colleges in Delhi', href: '#' },
        { title: 'Top NLUs Colleges in India', href: '#' },
        { title: 'Top Law Colleges in Chandigarh', href: '#' },
        { title: 'Top Law Colleges in Lucknow', href: '#' }
      ],
      predictors: [
        { title: 'CLAT College Predictor', href: '#' },
        { title: 'MHCET Law ( 5 Year L.L.B) College Predictor', href: '#' },
        { title: 'AILET College Predictor', href: '#' },
        { title: 'Sample Papers', href: '#' },
        { title: 'E-Books & Sample Papers', href: '#' },
        { title: 'CLAT Rank Predictor', href: '#' }
      ],
      resources: [
        { title: 'Compare Law Collages', href: '#' },
        { title: 'QnA - Get answers to your doubts', href: '#' },
        { title: 'Collegedost Youtube Channel', href: '#' },
        { title: 'CLAT Syllabus', href: '#' },
        { title: 'Free CLAT Practice Test', href: '#' }
      ]
    }
  },
  {
    id: 'animation',
    label: 'Animation and Design',
    titles: {
      col1: 'Exams',
      col2: 'Colleges',
      col3_1: 'Predictors & Articles',
      col3_2: 'Resources'
    },
    content: {
      exams: [
        { title: 'NIFT 2026', href: '#' },
        { title: 'UCEED Exam', href: '#' },
        { title: 'NID DAT Exam', href: '#' },
        { title: 'JNAFAU FADEE Exam', href: '#' },
        { title: 'CEED Exam', href: '#' },
        { title: 'FDDI AIST Exam', href: '#' },
        { title: 'MITID DAT Exam', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Design Colleges in India', href: '#' },
        { title: 'Top Design Colleges in India', href: '#' },
        { title: 'Top NIFT Colleges in India', href: '#' },
        { title: 'Fashion Design Colleges in India', href: '#' },
        { title: 'Top Interior Design Colleges in India', href: '#' },
        { title: 'Top Graphic Designing Colleges in India', href: '#' },
        { title: 'Fashion Design Colleges in Delhi', href: '#' },
        { title: 'Fashion Design Colleges in Mumbai', href: '#' }
      ],
      predictors: [
        { title: 'NIFT College Predictor', href: '#' },
        { title: 'UCEED College Predictor', href: '#' },
        { title: 'NID DAT College Predictor', href: '#' },
        { title: 'NIFT 2026 Preparation', href: '#' },
        { title: 'NID DAT 2026 Preparation', href: '#' },
        { title: 'UCEED 2026 Preparation', href: '#' },
        { title: 'NIFT Question Paper', href: '#' },
        { title: 'NID DAT Question Papers', href: '#' }
      ],
      resources: [
        { title: 'NIFT Cutoff 2025', href: '#' },
        { title: 'NID Cutoff 2025', href: '#' },
        { title: 'NIFT Fees Structure', href: '#' },
        { title: 'Free Design Sample Papers', href: '#' },
        { title: 'Free Design E-books', href: '#' },
        { title: 'List of Branches', href: '#' },
        { title: 'QnA - Get answers to your doubts', href: '#' },
        { title: 'Collegedost Youtube channel', href: '#' }
      ]
    }
  },
  {
    id: 'media',
    label: 'Media, Mass Communication and Journalism',
    titles: {
      col1: 'Exams',
      col2: 'Colleges',
      col3_1: 'Resources', /* Using first slot for Resources to match screenshot layout */
      col3_2: ' ' /* Hiding second header */
    },
    content: {
      exams: [
        { title: 'IIMC Entrance Exam 2025', href: '#' },
        { title: 'NPAT 2025', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Compare Colleges', href: '#' },
        { title: 'Media & Journalism colleges in Delhi', href: '#' },
        { title: 'Media & Journalism colleges in Bangalore', href: '#' },
        { title: 'Media & Journalism colleges in Mumbai', href: '#' },
        { title: 'Colleges Accepting Admissions', href: '#' },
        { title: 'List of Media & Journalism Colleges in India', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      predictors: [ /* Content placed here to appear under the top header of col 3 */
        { title: 'Free Ebooks', href: '#' },
        { title: 'Free Sample Papers', href: '#' },
        { title: 'List of Popular Branches', href: '#' },
        { title: 'QnA - Get answers to your doubts', href: '#' },
        { title: 'Collegedost Youtube Channel', href: '#' }
      ],
      resources: [] /* Empty second list */
    }
  },
  {
    id: 'finance',
    label: 'Finance & Accounts',
    titles: {
      col1: 'Exams',
      col2: 'Resources',
      col3_1: 'Top Courses & Careers',
      col3_2: 'Colleges'
    },
    content: {
      exams: [
        { title: 'CA Intermediate', href: '#' },
        { title: 'CA Foundation', href: '#' },
        { title: 'CA Final', href: '#' },
        { title: 'CS Executive', href: '#' },
        { title: 'CS Professional', href: '#' },
        { title: 'CFA Exam', href: '#' },
        { title: 'CSEET', href: '#' },
        { title: 'ACET', href: '#' }
      ],
      colleges: [
        { title: 'Difference between CA and CS', href: '#' },
        { title: 'Difference between CA and CMA', href: '#' },
        { title: 'CA Full form', href: '#' },
        { title: 'CMA Full form', href: '#' },
        { title: 'CS Full form', href: '#' },
        { title: 'E-books and Sample Papers', href: '#' },
        { title: 'Free Sample Papers', href: '#' },
        { title: 'CA Salary In India', href: '#' }
      ],
      predictors: [
        { title: 'Bachelor of Commerce (B.Com)', href: '#' },
        { title: 'Master of Commerce (M.Com)', href: '#' },
        { title: 'Company Secretary', href: '#' },
        { title: 'Cost Accountant', href: '#' },
        { title: 'Charted Accountant', href: '#' },
        { title: 'Credit Manager', href: '#' },
        { title: 'Financial Advisor', href: '#' }
      ],
      resources: [
        { title: 'Top Commerce Colleges in India', href: '#' },
        { title: 'Top Government Commerce Colleges in India', href: '#' },
        { title: 'Top Private Commerce Colleges in India', href: '#' },
        { title: 'Top M.Com Colleges in Mumbai', href: '#' },
        { title: 'Top B.Com Colleges in India', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ]
    }
  },
  {
    id: 'computer',
    label: 'Computer Application and IT',
    titles: {
      col1: 'Exams',
      col2: 'Colleges',
      col3_1: 'Resources',
      col3_2: 'Quick Links'
    },
    content: {
      exams: [
        { title: 'NIMCET', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Compare Colleges', href: '#' },
        { title: 'IT Colleges in Tamil Nadu', href: '#' },
        { title: 'IT Colleges in Uttar Pradesh', href: '#' },
        { title: 'Colleges Accepting Admissions', href: '#' },
        { title: 'MCA Colleges in India', href: '#' },
        { title: 'BCA Colleges in India', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      predictors: [
        { title: 'Sample Papers', href: '#' },
        { title: 'Free Ebooks', href: '#' },
        { title: 'QnA - Get answers to your doubts', href: '#' },
        { title: 'Collegedost Youtube Channel', href: '#' }
      ],
      resources: [
        { title: 'MCA', href: '#' },
        { title: 'BCA', href: '#' },
        { title: 'Information Technology Courses', href: '#' },
        { title: 'Programming Courses', href: '#' },
        { title: 'Web Development Courses', href: '#' },
        { title: 'Data Analytics Courses', href: '#' },
        { title: 'Big Data Analytics Courses', href: '#' }
      ]
    }
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    link: '/pharmacy',
    titles: {
      col1: 'Exams',
      col2: 'Colleges',
      col3_1: 'Resources',
      col3_2: ' '
    },
    content: {
      exams: [
        { title: 'GPAT', href: '#' },
        { title: 'RUHS Pharmacy Admission Test', href: '#' },
        { title: 'KAHER-AIET', href: '#' },
        { title: 'NIPER JEE', href: '#' },
        { title: 'UPESPAT', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Top Pharmacy Colleges in India', href: '#' },
        { title: 'Pharmacy Colleges in Pune', href: '#' },
        { title: 'Pharmacy Colleges in Mumbai', href: '#' },
        { title: 'Colleges Accepting GPAT Score', href: '#' },
        { title: 'Pharmacy Colleges in Lucknow', href: '#' },
        { title: 'List of Pharmacy Colleges in Nagpur', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      predictors: [
        { title: 'GPAT Result', href: '#' },
        { title: 'GPAT 2025 Admit Card', href: '#' },
        { title: 'GPAT Question Papers', href: '#' },
        { title: 'B. Pharma', href: '#' },
        { title: 'M. Pharma', href: '#' },
        { title: 'Free Ebooks', href: '#' },
        { title: 'Free Sample Papers', href: '#' },
        { title: 'Collegedost Youtube Channel', href: '#' }
      ],
      resources: []
    }
  },
  {
    id: 'hospitality',
    label: 'Hospitality and Tourism',
    titles: {
      col1: 'Exams',
      col2: 'Colleges',
      col3_1: 'Resources',
      col3_2: 'Diploma Colleges'
    },
    content: {
      exams: [
        { title: 'NCHMCT JEE 2025', href: '#' },
        { title: 'Mah BHMCT CET', href: '#' },
        { title: 'MAH HM CET', href: '#' },
        { title: 'PUTHAT', href: '#' },
        { title: 'IHM-A', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Top Hotel Management Colleges in Delhi', href: '#' },
        { title: 'Top Hotel Management Colleges in Hyderabad', href: '#' },
        { title: 'Top Hotel Management Colleges in Mumbai', href: '#' },
        { title: 'Top Hotel Management Colleges in Tamil Nadu', href: '#' },
        { title: 'Top Hotel Management Colleges in Maharashtra', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      predictors: [
        { title: 'Free Hospitality E-books', href: '#' },
        { title: 'Free Hospitality Sample Papers', href: '#' },
        { title: 'BHM Course', href: '#' },
        { title: 'B.Sc Hotel Management', href: '#' },
        { title: 'Hotel Management', href: '#' },
        { title: 'Diploma in Hotel Management and Catering Technology', href: '#' },
        { title: 'List of Popular Branches', href: '#' }
      ],
      resources: [
        { title: 'Top Diploma Colleges in Maharashtra', href: '#' }
      ]
    }
  },
  {
    id: 'competition',
    label: 'Competition',
    titles: {
      col1: 'Exams',
      col2: 'Resources',
      col3_1: 'Upcoming Events',
      col3_2: 'Other Exams'
    },
    content: {
      exams: [
        { title: 'NDA Exam', href: '#' },
        { title: 'UPSC IAS Exam', href: '#' },
        { title: 'CDS Exam', href: '#' },
        { title: 'AFCAT Exam', href: '#' },
        { title: 'SSC CGL Exam', href: '#' },
        { title: 'IBPS RRB Exam', href: '#' },
        { title: 'CTET Exam', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Previous Year Sample Papers', href: '#' },
        { title: 'Free Competition E-books', href: '#' },
        { title: 'Sarkari Result', href: '#' },
        { title: 'QnA - Get answers to your doubts', href: '#' },
        { title: 'UPSC Previous Year Sample Papers', href: '#' },
        { title: 'CTET Previous Year Sample Papers', href: '#' },
        { title: 'SBI Clerk Previous Year Sample Papers', href: '#' },
        { title: 'NDA Previous Year Sample Papers', href: '#' }
      ],
      predictors: [
        { title: 'AFCAT 1 Result 2025', href: '#' },
        { title: 'UPSC CAPF Admit card 2025', href: '#' },
        { title: 'SSC GD Constable Result 2025', href: '#' },
        { title: 'UPSC CMS Admit Card 2025', href: '#' },
        { title: 'RRB ALP Result 2025', href: '#' },
        { title: 'CTET Notification 2025', href: '#' },
        { title: 'NDA 1 Admit card 2025', href: '#' },
        { title: 'CDS 1 Admit Card 2025', href: '#' }
      ],
      resources: [
        { title: 'TNPSC Group 4 Exam', href: '#' },
        { title: 'UPSC CMS Exam', href: '#' },
        { title: 'UPSC IFS Exam', href: '#' },
        { title: 'UGC NET Exam', href: '#' },
        { title: 'RRB NTPC Exam', href: '#' },
        { title: 'IBPS PO Exam', href: '#' },
        { title: 'IBPS Clerk Exam', href: '#' },
        { title: 'SSC GD Constable Exam', href: '#' }
      ]
    }
  },
  {
    id: 'school',
    label: 'School',
    titles: {
      col1: 'Exams',
      col2: 'Top Schools',
      col3_1: 'Products & Resources',
      col3_2: 'NCERT Study Material'
    },
    content: {
      exams: [
        { title: 'CBSE Class 10th', href: '#' },
        { title: 'CBSE Class 12th', href: '#' },
        { title: 'UP Board 10th', href: '#' },
        { title: 'UP Board 12th', href: '#' },
        { title: 'Bihar Board 10th', href: '#' },
        { title: 'Bihar Board 12th', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Top Schools in India', href: '#' },
        { title: 'Top Schools in Delhi', href: '#' },
        { title: 'Top Schools in Mumbai', href: '#' },
        { title: 'Top Schools in Chennai', href: '#' },
        { title: 'Top Schools in Hyderabad', href: '#' },
        { title: 'Top Schools in Kolkata', href: '#' },
        { title: 'Top Schools in Pune', href: '#' },
        { title: 'Top Schools in Bangalore', href: '#' }
      ],
      predictors: [
        { title: 'JEE Main Knockout April', href: '#' },
        { title: 'Free eBooks & Sample Papers', href: '#' },
        { title: 'RD Sharma Solutions', href: '#' },
        { title: 'State Boards Results 2025', href: '#' }
      ],
      resources: [
        { title: 'NCERT Notes', href: '#' },
        { title: 'NCERT Books', href: '#' },
        { title: 'NCERT Syllabus', href: '#' },
        { title: 'NCERT Solutions', href: '#' },
        { title: 'NCERT Solutions for Class 12', href: '#' },
        { title: 'NCERT Solutions for Class 11', href: '#' },
        { title: 'NCERT Solutions for Class 10', href: '#' }
      ]
    }
  },
  {
    id: 'abroad',
    label: 'Study Abroad',
    link: '/international-colleges',
    titles: {
      col1: 'Exams',
      col2: 'Colleges',
      col3_1: 'Top Countries',
      col3_2: 'Resources'
    },
    content: {
      exams: [
        { title: 'TOEFL', href: '#' },
        { title: 'PTE', href: '#' },
        { title: 'IELTS', href: '#' },
        { title: 'GMAT', href: '#' },
        { title: 'GRE', href: '#' },
        { title: 'SAT', href: '#' },
        { title: 'LNAT UK', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Top University in USA', href: '#' },
        { title: 'Top University in Canada', href: '#' },
        { title: 'Top University in Ireland', href: '#' },
        { title: 'Top Universities in UK', href: '#' },
        { title: 'Top Universities in Australia', href: '#' },
        { title: 'Best MBA Colleges in Abroad', href: '#' },
        { title: 'Business Management Studies Colleges', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      predictors: [
        { title: 'Study in USA', href: '#' },
        { title: 'Study in UK', href: '#' },
        { title: 'Study in Canada', href: '#' },
        { title: 'Study in Australia', href: '#' },
        { title: 'Study in Ireland', href: '#' },
        { title: 'Study in Germany', href: '#' },
        { title: 'Study in China', href: '#' },
        { title: 'Study in Europe', href: '#' }
      ],
      resources: [
        { title: 'Student Visa Canada', href: '#' },
        { title: 'Student Visa UK', href: '#' },
        { title: 'Student Visa USA', href: '#' },
        { title: 'Download E-books and Sample Papers', href: '#' },
        { title: 'Free Exam Sample Papers', href: '#' },
        { title: 'IELTS Reading Practice E-book', href: '#' },
        { title: 'IELTS 2025 Writing Task 1 & Task 2', href: '#' },
        { title: 'Know All About Education Loan', href: '#' }
      ]
    }
  },
  {
    id: 'arts',
    label: 'Arts, Commerce & Sciences',
    titles: {
      col1: 'Exams',
      col2: 'Colleges',
      col3_1: 'Upcoming Events',
      col3_2: 'Resources'
    },
    content: {
      exams: [
        { title: 'CUET Exam', href: '#' },
        { title: 'CUET PG', href: '#' },
        { title: 'NFAT', href: '#' },
        { title: 'NEST', href: '#' },
        { title: 'UP B.Ed JEE', href: '#' },
        { title: 'TS EDCET Exam', href: '#' },
        { title: 'IIT JAM', href: '#' },
        { title: 'AP PGCET Exam', href: '#' }
      ],
      colleges: [
        { title: 'Universities in India', href: '#' },
        { title: 'Top Universities in India', href: '#' },
        { title: 'Top Colleges in India', href: '#' },
        { title: 'Top Universities in Uttar Pradesh', href: '#' },
        { title: 'Top Universities in Bihar', href: '#' },
        { title: 'Top Universities in Madhya Pradesh', href: '#' },
        { title: 'Top Universities in Tamil Nadu', href: '#' },
        { title: 'Central Universities in India', href: '#' }
      ],
      predictors: [
        { title: 'DU Cut Off', href: '#' },
        { title: 'IGNOU Date Sheet 2025', href: '#' },
        { title: 'CUET 2026', href: '#' },
        { title: 'CUET Cut Off', href: '#' },
        { title: 'IIT JAM Syllabus', href: '#' },
        { title: 'CUET Participating Universities 2026', href: '#' },
        { title: 'CUET Previous Year Question Paper', href: '#' },
        { title: 'IGNOU Result', href: '#' }
      ],
      resources: [
        { title: 'E-Books and Sample Papers', href: '#' },
        { title: 'CUET College Predictor', href: '#' },
        { title: 'IIT JAM Exam Dates 2026', href: '#' },
        { title: 'CUET PG Cut Off', href: '#' },
        { title: 'IGNOU Exam Form', href: '#' },
        { title: 'CUET Syllabus', href: '#' },
        { title: 'CUET Counselling', href: '#' }
      ]
    }
  },
  {
    id: 'learn',
    label: 'Learn',
    titles: {
      col1: 'Engineering Preparation',
      col2: 'Medical Preparation',
      col3_1: 'Law Preparation',
      col3_2: 'MBA Preparation'
    },
    content: {
      exams: [
        { title: 'JEE Main Free Mock Test', href: '#' },
        { title: 'BITSAT Free Mock Test', href: '#' },
        { title: 'VITEEE Free Mock Test', href: '#' },
        { title: 'MET Free Mock Test', href: '#' }
      ],
      colleges: [
        { title: 'NEET UG Free Mock Test', href: '#' },
        { title: 'NEET PG Free Mock Test', href: '#' }
      ],
      predictors: [
        { title: 'CLAT Free Mock Test', href: '#' },
        { title: 'AILET Free Mock Test', href: '#' },
        { title: 'AP LAWCET Free Mock Test', href: '#' },
        { title: 'TS LAWCET Free Mock Test', href: '#' }
      ],
      resources: [
        { title: 'CAT Free Mock Test', href: '#' },
        { title: 'MAT Free Mock Test', href: '#' },
        { title: 'XAT Free Mock Test', href: '#' },
        { title: 'CMAT Free Mock Test', href: '#' }
      ]
    }
  },
  {
    id: 'online',
    label: 'Online Courses and Certifications',
    titles: {
      col1: 'Top Streams',
      col2: 'Specializations',
      col3_1: 'Resources',
      col3_2: 'Top Providers'
    },
    content: {
      exams: [
        { title: 'IT & Software Certification Courses', href: '#' },
        { title: 'Engineering and Architecture Certification Courses', href: '#' },
        { title: 'Programming And Development Certification Courses', href: '#' },
        { title: 'Business and Management Certification Courses', href: '#' },
        { title: 'Marketing Certification Courses', href: '#' },
        { title: 'Health and Fitness Certification Courses', href: '#' },
        { title: 'Design Certification Courses', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ],
      colleges: [
        { title: 'Digital Marketing Certification Courses', href: '#' },
        { title: 'Cyber Security Certification Courses', href: '#' },
        { title: 'Artificial Intelligence Certification Courses', href: '#' },
        { title: 'Business Analytics Certification Courses', href: '#' },
        { title: 'Data Science Certification Courses', href: '#' },
        { title: 'Cloud Computing Certification Courses', href: '#' },
        { title: 'Machine Learning Certification Courses', href: '#' },
        { title: 'View All Certification Courses', href: '#', isLink: true }
      ],
      predictors: [
        { title: 'UG Degree Courses', href: '#' },
        { title: 'PG Degree Courses', href: '#' },
        { title: 'Online MBA', href: '#' },
        { title: 'Short Term Courses', href: '#' },
        { title: 'Free Courses', href: '#' },
        { title: 'Online Degrees and Diplomas', href: '#' },
        { title: 'Compare Courses', href: '#' }
      ],
      resources: [
        { title: 'Coursera Courses', href: '#' },
        { title: 'Udemy Courses', href: '#' },
        { title: 'Edx Courses', href: '#' },
        { title: 'Swayam Courses', href: '#' },
        { title: 'upGrad Courses', href: '#' },
        { title: 'Simplilearn Courses', href: '#' },
        { title: 'Great Learning Courses', href: '#' },
        { title: 'View All', href: '#', isLink: true }
      ]
    }
  },
];

export const examsData = [
  {
    id: 'engineering',
    label: 'Engineering',
    titles: { col1: 'Entrance Exams', col2: 'dates & Applications', col3_1: 'Preparation', col3_2: 'Resources' },
    content: {
      exams: [
        { title: 'JEE Main', href: '#' },
        { title: 'JEE Advanced', href: '#' },
        { title: 'GATE', href: '#' },
        { title: 'BITSAT', href: '#' }
      ],
      colleges: [
        { title: 'JEE Main 2026 Dates', href: '/exams/jee-main?tab=dates' },
        { title: 'Application Process', href: '/exams/jee-main?tab=application' },
        { title: 'Exam Centers', href: '#' }
      ],
      predictors: [
        { title: 'Syllabus', href: '/exams/jee-main?tab=syllabus' },
        { title: 'Mock Tests', href: '#' },
        { title: 'Previous Papers', href: '#' }
      ],
      resources: [
        { title: 'Coaching Centers', href: '#' },
        { title: 'Best Books', href: '#' }
      ]
    }
  },
  {
    id: 'medical',
    label: 'Medical',
    titles: { col1: 'Entrance Exams', col2: 'dates & Applications', col3_1: 'Preparation', col3_2: 'Resources' },
    content: {
      exams: [
        { title: 'NEET UG', href: '#' },
        { title: 'NEET PG', href: '#' },
        { title: 'AIIMS', href: '#' }
      ],
      colleges: [
        { title: 'NEET 2026 Dates', href: '#' },
        { title: 'Application Form', href: '#' }
      ],
      predictors: [
        { title: 'Biology Notes', href: '#' },
        { title: 'Chemistry Notes', href: '#' }
      ],
      resources: [
        { title: 'Top Medical Colleges', href: '#' }
      ]
    }
  },
  {
    id: 'management',
    label: 'Management',
    titles: { col1: 'Entrance Exams', col2: 'dates & Applications', col3_1: 'Preparation', col3_2: 'Resources' },
    content: {
      exams: [
        { title: 'CAT', href: '#' },
        { title: 'MAT', href: '#' },
        { title: 'XAT', href: '#' }
      ],
      colleges: [
        { title: 'CAT 2025 Registration', href: '#' },
        { title: 'MBA Admission', href: '#' }
      ],
      predictors: [
        { title: 'Data Interpretation', href: '#' },
        { title: 'Verbal Ability', href: '#' }
      ],
      resources: [
        { title: 'Top B-Schools', href: '#' }
      ]
    }
  }
];

export const coursesData = [
  {
    id: 'degree',
    label: 'Degree Courses',
    titles: { col1: 'Bachelors', col2: 'Masters', col3_1: 'Doctoral', col3_2: 'Popular' },
    content: {
      exams: [
        { title: 'B.Tech', href: '/courses/bachelor-of-technology-computer-science' },
        { title: 'B.Sc', href: '/courses?search=B.Sc' },
        { title: 'B.Com', href: '/courses?search=B.Com' },
        { title: 'B.A', href: '/courses?search=B.A' }
      ],
      colleges: [
        { title: 'M.Tech', href: '/courses?search=M.Tech' },
        { title: 'M.Sc', href: '/courses?search=M.Sc' },
        { title: 'MBA', href: '/courses/master-of-business-administration' },
        { title: 'M.A', href: '/courses?search=M.A' }
      ],
      predictors: [
        { title: 'Ph.D in Engineering', href: '#' },
        { title: 'Ph.D in Science', href: '#' }
      ],
      resources: [
        { title: 'Computer Science', href: '#' },
        { title: 'Data Science', href: '#' }
      ]
    }
  },
  {
    id: 'diploma',
    label: 'Diploma',
    titles: { col1: 'Engineering', col2: 'Medical', col3_1: 'Management', col3_2: 'Others' },
    content: {
      exams: [
        { title: 'Polytechnic', href: '#' },
        { title: 'Diploma in CS', href: '#' }
      ],
      colleges: [
        { title: 'D.Pharma', href: '#' },
        { title: 'Paramedical', href: '#' }
      ],
      predictors: [
        { title: 'Diploma in Management', href: '#' }
      ],
      resources: [
        { title: 'Event Management', href: '#' },
        { title: 'Hotel Management', href: '#' }
      ]
    }
  },
  {
    id: 'certification',
    label: 'Certifications',
    titles: { col1: 'IT & Software', col2: 'Business', col3_1: 'Marketing', col3_2: 'Design' },
    content: {
      exams: [
        { title: 'AWS Certified', href: '#' },
        { title: 'Google Cloud', href: '#' },
        { title: 'Full Stack Dev', href: '#' }
      ],
      colleges: [
        { title: 'PMP Certification', href: '#' },
        { title: 'Six Sigma', href: '#' }
      ],
      predictors: [
        { title: 'Digital Marketing', href: '#' },
        { title: 'SEO Expert', href: '#' }
      ],
      resources: [
        { title: 'UI/UX Design', href: '#' },
        { title: 'Graphic Design', href: '#' }
      ]
    }
  }
];

export const predictorsData = [
  {
    id: 'engineering',
    label: 'Engineering',
    titles: { col1: 'Jee Main', col2: 'Advanced & BIT', col3_1: 'State Level', col3_2: 'Others' },
    content: {
      exams: [
        { title: 'JEE Main College Predictor', href: '/jee-main-college-predictor' },
        { title: 'JEE Main Rank Predictor', href: '/jee-main-rank-predictor' },
        { title: 'JEE Main B.Arch Predictor', href: '#' }
      ],
      colleges: [
        { title: 'JEE Advanced College Predictor', href: '/predict-colleges?exam=JEE+Advanced' },
        { title: 'BITSAT College Predictor', href: '/predict-colleges?exam=BITSAT' }
      ],
      predictors: [
        { title: 'MHT CET College Predictor', href: '/predict-colleges?exam=MHT+CET' },
        { title: 'AP EAMCET College Predictor', href: '/predict-colleges?exam=AP+EAMCET' },
        { title: 'TS EAMCET College Predictor', href: '/predict-colleges?exam=TS+EAMCET' },
        { title: 'KCET College Predictor', href: '/predict-colleges?exam=KCET' }
      ],
      resources: [
        { title: 'VITEEE College Predictor', href: '/predict-colleges?exam=VITEEE' },
        { title: 'SRMJEEE College Predictor', href: '/predict-colleges?exam=SRMJEEE' }
      ]
    }
  },
  {
    id: 'medical',
    label: 'Medical',
    titles: { col1: 'NEET', col2: 'AIIMS', col3_1: 'State Quota', col3_2: 'Others' },
    content: {
      exams: [
        { title: 'NEET College Predictor', href: '/predict-colleges?exam=NEET' },
        { title: 'NEET Rank Predictor', href: '/rank-predictor?exam=NEET' }
      ],
      colleges: [
        { title: 'AIIMS College Predictor', href: '/predict-colleges?exam=AIIMS' }
      ],
      predictors: [
        { title: 'Maharashtra NEET Predictor', href: '/predict-colleges?exam=NEET&state=Maharashtra' },
        { title: 'Karnataka NEET Predictor', href: '/predict-colleges?exam=NEET&state=Karnataka' }
      ],
      resources: [
        { title: 'AFMC College Predictor', href: '/predict-colleges?exam=AFMC' }
      ]
    }
  },
  {
    id: 'management',
    label: 'Management',
    titles: { col1: 'CAT', col2: 'XAT & CMAT', col3_1: 'MAT', col3_2: 'Others' },
    content: {
      exams: [
        { title: 'CAT Percentile Predictor', href: '/rank-predictor?exam=CAT' },
        { title: 'CAT College Predictor', href: '/predict-colleges?exam=CAT' }
      ],
      colleges: [
        { title: 'XAT College Predictor', href: '/predict-colleges?exam=XAT' },
        { title: 'CMAT College Predictor', href: '/predict-colleges?exam=CMAT' }
      ],
      predictors: [
        { title: 'MAT College Predictor', href: '/predict-colleges?exam=MAT' },
        { title: 'NMAT College Predictor', href: '/predict-colleges?exam=NMAT' }
      ],
      resources: [
        { title: 'SNAP College Predictor', href: '/predict-colleges?exam=SNAP' }
      ]
    }
  }
];

export const rankingsData = [
  {
    id: 'engineering',
    label: 'Engineering',
    titles: { col1: 'NIRF Ranking', col2: 'CollegeDost Ranking', col3_1: 'By Placement', col3_2: 'International' },
    content: {
      exams: [
        { title: 'Top Engineering Colleges (NIRF)', href: '#' },
        { title: 'Best Engineering Colleges India', href: '#' }
      ],
      colleges: [
        { title: 'Top Rated Engineering Colleges', href: '#' },
        { title: 'AAA+ Rated Colleges', href: '#' }
      ],
      predictors: [
        { title: 'Best Placement Colleges', href: '#' },
        { title: 'Best ROI Colleges', href: '#' }
      ],
      resources: [
        { title: 'QS World University Rankings', href: '#' },
        { title: 'THE World Rankings', href: '#' }
      ]
    }
  },
  {
    id: 'medical',
    label: 'Medical',
    titles: { col1: 'Government', col2: 'Private', col3_1: 'By City', col3_2: 'International' },
    content: {
      exams: [
        { title: 'Top Govt Medical Colleges', href: '#' },
        { title: 'AIIMS Ranking', href: '#' }
      ],
      colleges: [
        { title: 'Top Private Medical Colleges', href: '#' }
      ],
      predictors: [
        { title: 'Top Medical Colleges in Delhi', href: '#' }
      ],
      resources: [
        { title: 'Top Medical Colleges in World', href: '#' }
      ]
    }
  },
  {
    id: 'mba',
    label: 'MBA',
    titles: { col1: 'IIMs', col2: 'Private B-Schools', col3_1: 'Executive MBA', col3_2: 'Global' },
    content: {
      exams: [
        { title: 'Top IIMs in India', href: '#' },
        { title: 'NIRF Management Ranking', href: '#' }
      ],
      colleges: [
        { title: 'Top Private MBA Colleges', href: '#' }
      ],
      predictors: [
        { title: 'One Year MBA Ranking', href: '#' }
      ],
      resources: [
        { title: 'FT Global MBA Ranking', href: '#' }
      ]
    }
  }
];

export const counsellingData = [
  {
    id: 'engineering',
    label: 'Engineering',
    titles: { col1: 'JoSAA / CSAB', col2: 'State Counselling', col3_1: 'Private Colleges', col3_2: 'Resources' },
    content: {
      exams: [
        { title: 'JoSAA 2026 Process', href: '#' },
        { title: 'CSAB Special Round', href: '#' },
        { title: 'JEE Main Counselling', href: '#' }
      ],
      colleges: [
        { title: 'MHT CET CAP Rounds', href: '#' },
        { title: 'TNEA Counselling', href: '#' },
        { title: 'UPTAC Counselling', href: '#' }
      ],
      predictors: [
        { title: 'VIT Counselling Process', href: '#' },
        { title: 'SRMJEEE Counselling', href: '#' },
        { title: 'BITSAT Iterations', href: '#' }
      ],
      resources: [
        { title: 'Counselling Seat Matrix', href: '#' },
        { title: 'Choice Filling Tips', href: '#' }
      ]
    }
  },
  {
    id: 'medical',
    label: 'Medical',
    titles: { col1: 'MCC (AIQ)', col2: 'State Quota', col3_1: 'AYUSH / Veterinary', col3_2: 'Documents' },
    content: {
      exams: [
        { title: 'NEET AIQ Counselling', href: '#' },
        { title: 'MCC Registration', href: '#' },
        { title: 'Deemed Universities', href: '#' }
      ],
      colleges: [
        { title: 'Maharashtra NEET Counselling', href: '#' },
        { title: 'UP NEET Counselling', href: '#' },
        { title: 'Karnataka NEET Counselling', href: '#' }
      ],
      predictors: [
        { title: 'AYUSH Counselling (AACCC)', href: '#' },
        { title: 'BVSc & AH Counselling', href: '#' }
      ],
      resources: [
        { title: 'Documents Required', href: '#' },
        { title: 'Bond Policy', href: '#' }
      ]
    }
  },
  {
    id: 'mba',
    label: 'MBA',
    titles: { col1: 'IIMs', col2: 'Non-IIMs', col3_1: 'State MBA', col3_2: 'Others' },
    content: {
      exams: [
        { title: 'IIM CAP Process', href: '#' },
        { title: 'WAT/PI Preparation', href: '#' }
      ],
      colleges: [
        { title: 'XAT Selection Process', href: '#' },
        { title: 'NMAT Counselling', href: '#' }
      ],
      predictors: [
        { title: 'MAH MBA CET CAP', href: '#' },
        { title: 'TS ICET Counselling', href: '#' }
      ],
      resources: [
        { title: 'GD Topics', href: '#' }
      ]
    }
  }
];

export const navLinks = [
  { title: 'Browse by Stream', href: '#', hasDropdown: true },
  { title: 'Test Prep', href: '#', hasDropdown: true },
  { title: 'Colleges', href: '/colleges', hasDropdown: true },
  { title: 'Exams', href: '#', hasDropdown: true },
  { title: 'Courses', href: '/courses', hasDropdown: true },
  { title: 'News', href: '/news', hasDropdown: false },
  { title: 'Rankings', href: '#', hasDropdown: true },
  { title: 'International', href: '/international-colleges', hasDropdown: false },
  { title: 'Counselling', href: '#', hasDropdown: true },
  { title: 'Careers', href: '#', hasDropdown: true },
  { title: 'More', href: '#', hasDropdown: true }
];

export const heroTabs = [
  { id: 'all', label: 'All' },
  { id: 'colleges', label: 'Colleges' },
  { id: 'exams', label: 'Exams' },
  { id: 'courses', label: 'Courses' },
  { id: 'abroad', label: 'Study Abroad' },
  { id: 'reviews', label: 'Reviews' },
];



export const latestNews = [
  "JEE Main 2026 Admit Card Released: Available at jeemain.nta.nic.in",
  "NEET PG 2025 Counselling Round 3 Schedule Revised - Check updates",
  "Top 10 Engineering Colleges in India 2026: IIT Madras Tops the list again",
  "GATE 2026 Hall Ticket Available for Download - Exam from Feb 3rd",
  "New Scholarship Announced for Merit Students - Apply before March 31st"
];

export const featuredColleges = [
  {
    id: 1,
    name: "IIT Madras - Indian Institute of Technology",
    location: "Chennai, Tamil Nadu",
    rating: "AAAAA",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/1200px-IIT_Madras_Logo.svg.png",
    tags: ["Engineering", "Public", "NIRF Rank #1"],
    fees: "₹ 8.5L Total Fees",
    placement: "₹ 18.5L Avg Package"
  },
  {
    id: 2,
    name: "IIM Ahmedabad - Indian Institute of Management",
    location: "Ahmedabad, Gujarat",
    rating: "AAAAA",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/IIMA_Logo.svg/1200px-IIMA_Logo.svg.png",
    tags: ["MBA", "Public", "NIRF Rank #1"],
    fees: "₹ 23L Total Fees",
    placement: "₹ 32L Avg Package"
  },
  {
    id: 3,
    name: "All India Institute of Medical Sciences",
    location: "New Delhi, Delhi",
    rating: "AAAAA",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/All_India_Institute_of_Medical_Sciences%2C_New_Delhi_logo.svg/1200px-All_India_Institute_of_Medical_Sciences%2C_New_Delhi_logo.svg.png",
    tags: ["Medical", "Public", "Top Ranked"],
    fees: "₹ 5.8K Total Fees",
    placement: "High ROI"
  },
  {
    id: 4,
    name: "Vellore Institute of Technology (VIT)",
    location: "Vellore, Tamil Nadu",
    rating: "AAAA+",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Vellore_Institute_of_Technology_seal_2017.svg/1200px-Vellore_Institute_of_Technology_seal_2017.svg.png",
    tags: ["Engineering", "Private", "Research"],
    fees: "₹ 7.8L Total Fees",
    placement: "₹ 8.5L Avg Package"
  }
];



export const homePredictorsData = [
  {
    title: "College Predictor",
    items: [
      { name: "JEE Main College Predictor", link: "/jee-main-college-predictor" },
      { name: "NEET College Predictor", link: "/predict-colleges?exam=NEET" },
      { name: "CAT College Predictor", link: "/predict-colleges" },
      { name: "GATE College Predictor", link: "/predict-colleges" },
      { name: "BITSAT College Predictor", link: "/predict-colleges" },
      { name: "NIFT College Predictor", link: "/predict-colleges" }
    ]
  },
  {
    title: "Rank Predictor",
    items: [
      { name: "JEE Main Rank Predictor", link: "/jee-main-rank-predictor" },
      { name: "NEET Rank Predictor", link: "/rank-predictor?exam=NEET" },
      { name: "KCET Rank Predictor", link: "/rank-predictor?exam=KCET" },
      { name: "AP EAMCET Rank Predictor", link: "/rank-predictor?exam=AP+EAMCET" },
      { name: "TS EAMCET Rank Predictor", link: "/rank-predictor?exam=TS+EAMCET" },
      { name: "KEAM Rank Predictor", link: "/rank-predictor?exam=KEAM" }
    ]
  }
];

export const homeCoursesData = [
  {
    title: "Trending Specializations",
    items: [
      { name: "Data Science", link: "#" },
      { name: "Artificial Intelligence", link: "#" },
      { name: "Machine Learning", link: "#" },
      { name: "Digital Marketing", link: "#" },
      { name: "Cyber Security", link: "#" },
      { name: "Cloud Computing", link: "#" },
      { name: "Business Analytics", link: "#" },
      { name: "Project Management", link: "#" }
    ]
  },
  {
    title: "Trending Courses",
    items: [
      { name: "Python Programming", link: "#" },
      { name: "Java Development", link: "#" },
      { name: "Web Design for Beginners", link: "#" },
      { name: "SQL Database Masterclass", link: "#" },
      { name: "React JS - Complete Guide", link: "#" },
      { name: "Excel Mastery Course", link: "#" },
      { name: "Google Data Analytics", link: "#" },
      { name: "AWS Certified Solutions", link: "#" }
    ]
  }
];

export const homeCounsellingData = [
  {
    title: "Expert Counselling",
    description: "Get personalized advice from our expert counsellors.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    cta: "Book Session",
    link: "#",
    color: "bg-blue-50"
  },
  {
    title: "Ask Now",
    description: "Have a question? Ask and get answers from experts.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    cta: "Ask Now",
    link: "#",
    color: "bg-orange-50"
  }
];

export const homeStatsData = [
  { count: "30000+", label: "Colleges", icon: "FaUniversity" },
  { count: "500+", label: "Exams", icon: "FaBookOpen" },
  { count: "1000+", label: "E-Books", icon: "FaTabletAlt" },
  { count: "1 Million+", label: "Monthly Visits", icon: "FaUsers" }
];

export const homeRankingsData = [
  { name: "Top Engineering Colleges in India", link: "#" },
  { name: "Top MBA Colleges in India", link: "#" },
  { name: "Top Medical Colleges in India", link: "#" },
  { name: "Top Law Colleges in India", link: "/law" },
  { name: "Top Universities in India", link: "#" },
  { name: "Top BBA Colleges in India", link: "#" },
  { name: "Top Pharmacy Colleges in India", link: "/pharmacy" },
  { name: "Top Architecture Colleges", link: "#" }
];

export const homeExamsData = [
  { name: "JEE Main 2025", link: "#" },
  { name: "GATE 2025", link: "#" },
  { name: "CAT 2024", link: "#" },
  { name: "NEET 2025", link: "#" },
  { name: "BITSAT 2025", link: "#" },
  { name: "XAT 2025", link: "#" },
  { name: "CLAT 2025", link: "#" },
  { name: "MAT 2025", link: "#" }
];

export const careersData = [
  {
    id: 'stream',
    label: 'By Stream',
    content: {
      col1: [
        { title: 'Engineer', href: '#', isLink: true },
        { title: 'Doctor', href: '#', isLink: true },
        { title: 'Designer', href: '#', isLink: true }
      ],
      col2: [
        { title: 'Manager', href: '#', isLink: true },
        { title: 'CA / CS', href: '#', isLink: true },
        { title: 'Lawyer', href: '#', isLink: true }
      ],
      col3_1: [
        { title: 'Know More', href: '#', isLink: true },
        { title: 'Career Options', href: '#' }
      ]
    }
  },
  {
    id: 'class',
    label: 'By Class',
    content: {
      col1: [
        { title: 'Class 10th', href: '#', isLink: true },
        { title: 'Class 12th PCM', href: '#', isLink: true }
      ],
      col2: [
        { title: 'Class 12th PCB', href: '#', isLink: true },
        { title: 'Class 12th Commerce', href: '#', isLink: true }
      ],
      col3_1: [
        { title: 'Class 12th Arts', href: '#', isLink: true }
      ]
    }
  }
];

export const moreData = [
  {
    id: 'learn',
    label: 'Learn',
    content: {
      col1: [
        { title: 'Online Courses', href: '#', isLink: true },
        { title: 'Mock Tests', href: '#', isLink: true }
      ],
      col2: [
        { title: 'E-Books', href: '#', isLink: true },
        { title: 'Sample Papers', href: '#', isLink: true }
      ],
      col3_1: []
    }
  },
  {
    id: 'study-abroad',
    label: 'Study Abroad',
    content: {
      col1: [
        { title: 'Colleges in USA', href: '#', isLink: true },
        { title: 'Colleges in UK', href: '#', isLink: true }
      ],
      col2: [
        { title: 'Colleges in Canada', href: '#', isLink: true },
        { title: 'Colleges in Germany', href: '#', isLink: true }
      ],
      col3_1: [
        { title: 'IELTS Preparation', href: '#', isLink: true },
        { title: 'GRE Preparation', href: '#', isLink: true }
      ]
    }
  },
  {
    id: 'counselling',
    label: 'Counselling',
    content: {
      col1: [
        { title: 'B.Tech Companion', href: '#', isLink: true },
        { title: 'MBBS Companion', href: '#', isLink: true }
      ],
      col2: [
        { title: 'MBA Companion', href: '#', isLink: true }
      ]
    }
  }
];
