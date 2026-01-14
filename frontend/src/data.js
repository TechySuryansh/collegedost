import {
  FaUniversity, FaBookOpen, FaLaptopCode, FaStethoscope,
  FaBalanceScale, FaChartLine, FaDraftingCompass, FaGlobeAmericas,
  FaListUl, FaRegComments
} from 'react-icons/fa';

/**
 * Main Data File
 */

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
    titles: {
      col1: 'Exams',
      col2: 'Colleges',
      col3_1: 'Predictors',
      col3_2: 'Resources'
    },
    content: {
      exams: [
        { title: 'JEE Main Exam', href: '#' },
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
        { title: 'JEE Main College Predictor', href: '#' },
        { title: 'JEE Main Rank Predictor', href: '#' },
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
    titles: { col1: 'Exams', col2: 'Colleges', col3_1: 'Predictors', col3_2: 'Resources' },
    content: {
      exams: [
        { title: 'NEET', href: '#' },
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

export const navLinks = [
  { title: 'Browse by Stream', href: '#', hasDropdown: true },
  { title: 'Test Prep', href: '#', hasDropdown: true },
  { title: 'Colleges', href: '#', hasDropdown: true },
  { title: 'Exams', href: '#', hasDropdown: true },
  { title: 'Courses', href: '#', hasDropdown: true },
  { title: 'Careers', href: '#', hasDropdown: false },
];

export const heroTabs = [
  { id: 'all', label: 'All' },
  { id: 'colleges', label: 'Colleges' },
  { id: 'exams', label: 'Exams' },
  { id: 'courses', label: 'Courses' },
  { id: 'abroad', label: 'Study Abroad' },
  { id: 'reviews', label: 'Reviews' },
];

export const examCategories = [
  { id: 1, title: 'Engineering', subtext: 'JEE Main, GATE', icon: FaLaptopCode, color: '#4CAF50' },
  { id: 2, title: 'Medical', subtext: 'NEET, AIIMS', icon: FaStethoscope, color: '#2196F3' },
  { id: 3, title: 'MBA', subtext: 'CAT, XAT, MAT', icon: FaChartLine, color: '#FF9800' },
  { id: 4, title: 'Law', subtext: 'CLAT, AILET', icon: FaBalanceScale, color: '#9C27B0' },
  { id: 5, title: 'Pharmacy', subtext: 'GPAT, NIPER', icon: FaBookOpen, color: '#f44336' },
  { id: 6, title: 'Universities', subtext: 'CUET, DUET', icon: FaUniversity, color: '#607D8B' },
  { id: 7, title: 'Design', subtext: 'NIFT, NID', icon: FaDraftingCompass, color: '#E91E63' },
  { id: 8, title: 'Study Abroad', subtext: 'GRE, GMAT', icon: FaGlobeAmericas, color: '#3F51B5' },
];

export const latestNews = [
  "JEE Main 2026 Admit Card Released: Download now at jeemain.nta.nic.in",
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
