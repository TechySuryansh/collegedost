// ──────────────────────────────────────────────────────────
// Mega Menu Data — extracted from reference navigation HTML
// ──────────────────────────────────────────────────────────

export interface MegaMenuLink {
  label: string;
  href: string;
  isHeader?: boolean;
  isSubHeader?: boolean;
  isViewAll?: boolean;
  comingSoon?: boolean;
}

export interface MegaMenuColumn {
  links: MegaMenuLink[];
}

export interface MegaMenuSubCategory {
  title: string;
  directLink?: string;
  columns: MegaMenuColumn[];
}

export interface MegaMenuItem {
  title: string;
  subcategories: MegaMenuSubCategory[];
}

// Helper: marks a link as coming soon (page doesn't exist yet)
const cs = (label: string, href: string = '/coming-soon'): MegaMenuLink => ({
  label,
  href,
  comingSoon: true,
});

const hdr = (label: string): MegaMenuLink => ({
  label,
  href: '#',
  isHeader: true,
});

const subHdr = (label: string): MegaMenuLink => ({
  label,
  href: '#',
  isSubHeader: true,
});

const viewAll = (label: string, href: string, comingSoon = true): MegaMenuLink => ({
  label,
  href: comingSoon ? '/coming-soon' : href,
  isViewAll: true,
  comingSoon,
});

// ════════════════════════════════════════════════════════════
//  1. MBA
// ════════════════════════════════════════════════════════════
const mbaMenu: MegaMenuItem = {
  title: 'MBA',
  subcategories: [
    {
      title: 'Top Ranked Colleges',
      columns: [
        {
          links: [
            { label: 'Top MBA Colleges in India', href: '/streams/management' },
            { label: 'Top Private MBA Colleges in India', href: '/tools/colleges?stream=Management&ownership=Private' },
            { label: 'Top MBA Colleges in Bangalore', href: '/tools/colleges?search=MBA&city=Bangalore' },
            { label: 'Top MBA Colleges in Mumbai', href: '/tools/colleges?search=MBA&city=Mumbai' },
            { label: 'Top MBA Colleges in Pune', href: '/tools/colleges?search=MBA&city=Pune' },
            { label: 'Top MBA Colleges in Hyderabad', href: '/tools/colleges?search=MBA&city=Hyderabad' },
            { label: 'Top MBA Colleges in Delhi', href: '/tools/colleges?search=MBA&city=Delhi' },
            { label: 'Top MBA Colleges in Chennai', href: '/tools/colleges?search=MBA&city=Chennai' },
            { label: 'Top MBA Colleges in Maharashtra', href: '/tools/colleges?search=MBA&state=Maharashtra' },
            { label: 'Top MBA Colleges in Kolkata', href: '/tools/colleges?search=MBA&city=Kolkata' },
            { label: 'Top MBA Colleges in Kerala', href: '/tools/colleges?search=MBA&state=Kerala' },
          ],
        },
      ],
    },
    {
      title: 'Popular Courses',
      columns: [
        {
          links: [
            cs('MBA/PGDM'),
            cs('Executive MBA'),
            cs('Distance MBA'),
            cs('Online MBA'),
            cs('Part-Time MBA'),
          ],
        },
      ],
    },
    {
      title: 'Popular Specializations',
      columns: [
        {
          links: [
            cs('MBA in Finance'),
            cs('MBA in Healthcare Management'),
            cs('MBA in HR'),
            cs('MBA in IT'),
            cs('MBA in Operations Management'),
            cs('MBA in Marketing'),
            cs('MBA in International Business'),
            cs('MBA in Pharmaceutical Management'),
            cs('MBA in Digital Marketing'),
            cs('MBA in Data Analytics'),
          ],
        },
        {
          links: [
            cs('MBA in Entrepreneurship'),
            cs('MBA in Family Managed Business'),
            cs('MBA in Agriculture'),
            cs('MBA in Product Management'),
            cs('MBA in General Management'),
            cs('MBA in Data Science'),
          ],
        },
      ],
    },
    {
      title: 'Exams',
      columns: [
        {
          links: [
            hdr('Popular Exams'),
            cs('CAT'),
            cs('CMAT'),
            cs('SNAP'),
            cs('XAT'),
            cs('MAT'),
            cs('ATMA'),
            cs('NMAT by GMAC'),
            cs('IBSAT'),
            cs('KIITEE Management'),
            cs('UPCET'),
            viewAll('All MBA Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            cs('MBA Colleges in India'),
            cs('MBA Colleges in Bangalore'),
            cs('MBA Colleges in Chennai'),
            cs('MBA colleges in Delhi-NCR'),
            cs('MBA Colleges in Hyderabad'),
            cs('MBA Colleges in Kolkata'),
            cs('MBA Colleges in Mumbai'),
            cs('MBA Colleges in Pune'),
            viewAll('All Locations →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Compare Colleges',
      columns: [
        {
          links: [
            hdr('Popular Comparisons'),
            cs('IIM Ahmedabad Vs IIM Bangalore'),
            cs('IIM Ahmedabad Vs IIM Calcutta'),
            cs('SIBM Pune Vs SCMHRD Pune'),
            cs('SP Jain (SPJIMR) Vs MDI Gurgaon'),
            cs('NMIMS SBM Mumbai Vs SP Jain (SPJIMR)'),
            viewAll('Compare other MBA colleges →', '/tools/compare-colleges', false),
          ],
        },
      ],
    },
    {
      title: 'College Reviews',
      columns: [
        {
          links: [
            cs('IIM Ahmedabad Reviews'),
            cs('IIM Bangalore Reviews'),
            cs('IIM Calcutta Reviews'),
            cs('IIM Lucknow Reviews'),
            cs('IIM Kozhikode Reviews'),
            cs('IIM Indore Reviews'),
            cs('FMS Delhi Reviews'),
            cs('SP Jain Reviews'),
            cs('MDI Gurgaon Reviews'),
          ],
        },
      ],
    },
    {
      title: 'CAT Percentile Predictor',
      directLink: '/coming-soon',
      columns: [],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            cs('IIM & Non IIM Call Predictor'),
            cs('CAT College Predictor'),
            cs('MAH CET College Predictor'),
            cs('XAT College/ Call Predictor'),
            cs('IIFT College Predictor'),
            cs('NMAT College Predictor'),
            cs('SNAP College and Call Predictor'),
            cs('CMAT College Predictor'),
            viewAll('MBA College Predictor →', '/coming-soon'),
          ],
        },
        {
          links: [
            cs('MAT College Predictor'),
            cs('KMAT College Predictor'),
            cs('TANCET MBA College Predictor'),
            cs('TSICET College Predictor'),
            cs('IBSAT College Predictor'),
            cs('UPCET College Predictor'),
          ],
        },
      ],
    },
    {
      title: 'Resources',
      columns: [
        {
          links: [
            cs('MBA Alumni Salary Data'),
            cs('Ask a Question'),
            cs('Discussions'),
            cs('MBA News'),
            cs('MBA Articles'),
            cs('Apply to colleges'),
            cs('Trends in MBA'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  2. ENGINEERING
// ════════════════════════════════════════════════════════════
const engineeringMenu: MegaMenuItem = {
  title: 'Engineering',
  subcategories: [
    {
      title: 'Top Ranked Colleges',
      columns: [
        {
          links: [
            { label: 'Top Engineering Colleges in India', href: '/streams/engineering' },
            { label: 'Top Private Engineering Colleges in India', href: '/tools/colleges?stream=Engineering&ownership=Private' },
            { label: 'Top IITs in India', href: '/tools/colleges?search=Indian+Institute+of+Technology' },
            { label: 'Top NITs in India', href: '/tools/colleges?search=National+Institute+of+Technology' },
            { label: 'Top Engineering Colleges in Bangalore', href: '/tools/colleges?search=Engineering&city=Bangalore' },
            { label: 'Top Engineering Colleges in Karnataka', href: '/tools/colleges?search=Engineering&state=Karnataka' },
            { label: 'Top Engineering Colleges in Hyderabad', href: '/tools/colleges?search=Engineering&city=Hyderabad' },
            { label: 'Top Engineering Colleges in Pune', href: '/tools/colleges?search=Engineering&city=Pune' },
            { label: 'Top Engineering Colleges in Mumbai', href: '/tools/colleges?search=Engineering&city=Mumbai' },
            { label: 'Top Engineering Colleges in Maharashtra', href: '/tools/colleges?search=Engineering&state=Maharashtra' },
            { label: 'Top Engineering Colleges in Chennai', href: '/tools/colleges?search=Engineering&city=Chennai' },
            { label: 'Top Engineering Colleges in Kerala', href: '/tools/colleges?search=Engineering&state=Kerala' },
            { label: 'Top Engineering Colleges in Delhi', href: '/tools/colleges?search=Engineering&city=Delhi' },
            { label: 'Top Engineering Colleges in Telangana', href: '/tools/colleges?search=Engineering&state=Telangana' },
            { label: 'Top Engineering Colleges in Gujarat', href: '/tools/colleges?search=Engineering&state=Gujarat' },
            { label: 'Top Engineering Colleges in West Bengal', href: '/tools/colleges?search=Engineering&state=West+Bengal' },
          ],
        },
      ],
    },
    {
      title: 'Popular Courses',
      columns: [
        {
          links: [
            cs('B.E/B.Tech'),
            cs('M.E/M.Tech'),
            cs('Ph.D.'),
            cs('Diploma Courses'),
            cs('Distance Diploma Courses'),
            cs('Distance B.Tech'),
            viewAll('All Engineering Courses →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Popular Specializations',
      columns: [
        {
          links: [
            cs('Computer Science Engineering'),
            cs('Mechanical Engineering'),
            cs('Civil Engineering'),
            cs('Electronics & Communication Engineering'),
            cs('Aeronautical Engineering'),
            cs('Aerospace Engineering'),
            cs('Information Technology'),
            cs('Electrical Engineering'),
            cs('Electronics Engineering'),
            cs('Nanotechnology'),
            cs('Chemical Engineering'),
            cs('Automobile Engineering'),
            cs('Biomedical Engineering'),
            cs('Construction Engineering'),
            cs('Pulp & Paper Technology'),
          ],
        },
        {
          links: [
            cs('Marine Engineering'),
            cs('Genetic Engineering'),
            cs('Food Technology'),
            cs('Petroleum Engineering'),
            cs('Control Systems'),
            cs('Industrial Engineering'),
            cs('Production Engineering'),
            cs('Environmental Engineering'),
            cs('Robotics Engineering'),
            cs('Telecommunication Engineering'),
            cs('Materials Science'),
            cs('Structural Engineering'),
            cs('Aircraft Maintenance'),
            cs('RF & Microwave Engineering'),
          ],
        },
        {
          links: [
            cs('VLSI Design'),
            cs('Mechatronics Engineering'),
            cs('Mining Engineering'),
            cs('Biotechnology Engineering'),
            cs('Transportation Engineering'),
            cs('Metallurgical Engineering'),
            cs('Textile Engineering'),
            cs('Naval Architecture'),
            cs('Power Engineering'),
            cs('Dairy Technology'),
            cs('Microelectronics'),
            cs('Communications Engineering'),
            cs('Tool Engineering'),
            cs('Ceramic Engineering'),
            cs('Jute & Fiber Technology'),
          ],
        },
      ],
    },
    {
      title: 'Exams',
      columns: [
        {
          links: [
            hdr('Popular Exams'),
            cs('JEE Main'),
            cs('COMEDK'),
            cs('BITSAT'),
            cs('WBJEE'),
            cs('JEE Advanced'),
            cs('GATE'),
            cs('LPU-NEST'),
            cs('JET'),
            cs('CUCET Chandigarh University'),
            cs('CGCUET'),
            viewAll('All Engineering Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            cs('Engineering Colleges in India'),
            cs('Engineering Colleges in Bangalore'),
            cs('Engineering Colleges in Chennai'),
            cs('Engineering Colleges in Delhi-NCR'),
            cs('Engineering Colleges in Kolkata'),
            cs('Engineering Colleges in Mumbai'),
            cs('Engineering Colleges in Pune'),
            cs('Engineering Colleges in Hyderabad'),
            viewAll('All Locations →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Compare Colleges',
      columns: [
        {
          links: [
            hdr('Popular Comparisons'),
            cs('IIT Madras Vs IIT Kanpur'),
            cs('VNIT Nagpur Vs NIT Rourkela'),
            cs('Alliance University Vs Christ University'),
            cs('IIT Bombay Vs IIT Delhi'),
            cs('BITS Pilani Vs DTU Delhi'),
            viewAll('Compare other colleges →', '/tools/compare-colleges', false),
          ],
        },
      ],
    },
    {
      title: 'Rank Predictors',
      columns: [
        {
          links: [
            { label: 'COMEDK UGET Rank Predictor', href: '/coming-soon', comingSoon: true },
            { label: 'JEE Advanced Rank Predictor', href: '/predictors/rank-predictor', comingSoon: false },
            { label: 'JEE MAIN Rank Predictor', href: '/predictors/rank-predictor', comingSoon: false },
          ],
        },
      ],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            cs('CG PET College Predictor'),
            cs('COMEDK UGET College Predictor'),
            { label: 'JEE MAIN College Predictor', href: '/predictors/jee-main-predictor', comingSoon: false },
            { label: 'JEE Advanced College Predictor', href: '/predictors/predict-colleges', comingSoon: false },
            cs('KCET College Predictor'),
            cs('KEAM College Predictor'),
            cs('MHT CET College Predictor'),
            cs('MP BE College Predictor'),
            cs('PTU BTech College Predictor'),
            cs('JAC Chandigarh College Predictor'),
            cs('GATE College Predictor'),
            viewAll('Engineering College Predictor →', '/predictors', false),
          ],
        },
        {
          links: [
            cs('TNEA College Predictor'),
            cs('WBJEE College Predictor'),
            cs('AP EAMCET College Predictor'),
            cs('TS EAMCET College Predictor'),
            cs('BITSAT College Predictor'),
            cs('IPU CET College Predictor'),
            cs('OJEE College Predictor'),
            cs('GUJCET College Predictor'),
            cs('VITEEE College Predictor'),
            cs('SRMJEEE College Predictor'),
            cs('JAC Delhi College Predictor'),
          ],
        },
      ],
    },
    {
      title: 'College Reviews',
      columns: [
        {
          links: [
            cs('IIT Bombay Reviews'),
            cs('IIT Delhi Reviews'),
            cs('IIT Kanpur Reviews'),
            cs('IIIT Hyderabad Reviews'),
            cs('IIT Kharagpur Reviews'),
            cs('NIT Trichy Reviews'),
            cs('NIT Warangal Reviews'),
            cs('IIT Madras Reviews'),
            cs('BITS Pilani Reviews'),
            cs('IIT Hyderabad Reviews'),
          ],
        },
      ],
    },
    {
      title: 'Resources',
      columns: [
        {
          links: [
            cs('Ask a Question'),
            cs('Discussions'),
            cs('Engineering News'),
            cs('Engineering Articles'),
            cs('Apply to colleges'),
            cs('Trends in BTech'),
            cs('Trends in Engineering'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  3. MEDICAL
// ════════════════════════════════════════════════════════════
const medicalMenu: MegaMenuItem = {
  title: 'Medical',
  subcategories: [
    {
      title: 'Top Ranked Colleges',
      columns: [
        {
          links: [
            { label: 'Top Medical Colleges in India', href: '/streams/medicine' },
            { label: 'Top Medical Colleges in Karnataka', href: '/tools/colleges?search=Medical&state=Karnataka' },
            { label: 'Top Pharmacy Colleges in India', href: '/streams/pharmacy' },
            { label: 'Top Medical Colleges in Bangalore', href: '/tools/colleges?search=Medical&city=Bangalore' },
            { label: 'Top Dental Colleges in India', href: '/tools/colleges?search=Dental' },
            { label: 'Top Medical Colleges in Maharashtra', href: '/tools/colleges?search=Medical&state=Maharashtra' },
            { label: 'Top Medical Colleges in Mumbai', href: '/tools/colleges?search=Medical&city=Mumbai' },
            { label: 'Top Medical Colleges in Delhi', href: '/tools/colleges?search=Medical&city=Delhi' },
            { label: 'Top Pharmacy Colleges in Maharashtra', href: '/tools/colleges?search=Pharmacy&state=Maharashtra' },
          ],
        },
      ],
    },
    {
      title: 'Popular Courses',
      columns: [
        {
          links: [
            cs('MBBS'),
            cs('MD'),
            cs('BMLT'),
            cs('MPT'),
            cs('MPH'),
            viewAll('All Medical Courses →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Popular Specializations',
      columns: [
        {
          links: [
            cs('Alternative Medicine'),
            cs('Dental'),
            cs('Dietetics & Nutrition'),
            cs('Medicine'),
            cs('Paramedical'),
            cs('Pharmacy'),
            cs('Physiotherapy'),
            cs('Public Health & Management'),
            viewAll('All Medical Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            cs('Clinical Psychology'),
            cs('Clinical Research'),
          ],
        },
      ],
    },
    {
      title: 'Exams',
      columns: [
        {
          links: [
            cs('NEET UG'),
            cs('NEET PG'),
            cs('NEET SS'),
            cs('NEET MDS'),
            cs('INI CET'),
            cs('FMGE'),
            cs('AIAPGET'),
            viewAll('All Medicine Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            cs('Medical Colleges in India'),
            cs('Medical Colleges in Delhi'),
            cs('Medical Colleges in Bangalore'),
            cs('Medical Colleges in Chennai'),
            cs('Medical Colleges in Hyderabad'),
            cs('Medical Colleges in Mumbai'),
            cs('Medical Colleges in Kolkata'),
            cs('Medical Colleges in Pune'),
          ],
        },
      ],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            { label: 'NEET College Predictor', href: '/predictors/neet-predictor', comingSoon: false },
            cs('NEET PG College Predictor'),
            viewAll('Medicine College Predictor →', '/predictors', false),
          ],
        },
      ],
    },
    {
      title: 'Resources',
      columns: [
        {
          links: [
            cs('Ask a Question'),
            cs('Discussions'),
            cs('Medical News'),
            cs('Medical Articles'),
            cs('Trends in Medicine & Health Sciences'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  4. DESIGN
// ════════════════════════════════════════════════════════════
const designMenu: MegaMenuItem = {
  title: 'Design',
  subcategories: [
    {
      title: 'Top Ranked Colleges',
      columns: [
        {
          links: [
            { label: 'Top Fashion Designing Colleges in India', href: '/streams/design' },
            { label: 'Top Fashion Designing Colleges in Bangalore', href: '/tools/colleges?search=Design&city=Bangalore' },
            { label: 'Top Fashion Designing Colleges in Delhi/NCR', href: '/tools/colleges?search=Design&city=Delhi' },
          ],
        },
      ],
    },
    {
      title: 'Popular Specializations',
      columns: [
        {
          links: [
            cs('Fashion Designing'),
            cs('Interior Design'),
            cs('Graphic Design'),
            cs('Jewellery Design'),
            cs('Web Design'),
            cs('Furniture Design'),
            cs('Game Design'),
            cs('Product Design'),
            cs('Textile Design'),
            cs('Visual Merchandising'),
            cs('Ceramic & Glass Design'),
            cs('Film & Video Design'),
          ],
        },
        {
          links: [
            cs('UI / UX'),
            cs('Footwear Design'),
            cs('Automotive Design'),
            cs('Communication Design'),
            cs('Apparel Design'),
            cs('Exhibition Design'),
            cs('Information Design'),
            cs('Knitwear Design'),
            cs('Leather Design'),
            cs('Toy Design'),
            cs('Lifestyle Accessory Design'),
            viewAll('All Design Specializations →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Popular Courses',
      columns: [
        {
          links: [
            cs('B.Des'),
            cs('M.Des'),
            cs('B.Des in Fashion Design'),
            cs('B.Des in Interior Design'),
            cs('B.Sc in Fashion Design'),
            cs('B.Sc in Interior Design'),
            viewAll('All Design Courses →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Exams',
      columns: [
        {
          links: [
            hdr('Popular Exams'),
            cs('WUD Aptitude Test'),
            cs('Pearl Academy Entrance Exam'),
            cs('CEED'),
            cs('NID Entrance Exam'),
            cs('NIFT Entrance Exam'),
            cs('UCEED'),
            viewAll('All Design Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            cs('NID College Predictor'),
            cs('NIFT College Predictor'),
            viewAll('Design College Predictor →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            cs('Design Colleges in India'),
            cs('Design Colleges in Maharashtra'),
            cs('Design Colleges in Delhi'),
            cs('Design Colleges in Karnataka'),
            cs('Design Colleges in Punjab'),
            cs('Design Colleges in Telangana'),
            cs('Design Colleges in Gujarat'),
            cs('Design Colleges in Chandigarh'),
            cs('Design Colleges in Rajasthan'),
            cs('Design Colleges in Madhya Pradesh'),
            cs('Design Colleges in Uttar Pradesh'),
            cs('Design Colleges in Tamil Nadu'),
          ],
        },
        {
          links: [
            cs('Design Colleges in Pune'),
            cs('Design Colleges in Mumbai'),
            cs('Design Colleges in Bangalore'),
            cs('Design Colleges in Hyderabad'),
            cs('Design Colleges in Ahmedabad'),
            cs('Design Colleges in Ludhiana'),
            cs('Design Colleges in Jalandhar'),
            cs('Design Colleges in Jaipur'),
            cs('Design Colleges in Indore'),
            cs('Design Colleges in Gurgaon'),
          ],
        },
      ],
    },
    {
      title: 'Resources',
      columns: [
        {
          links: [
            cs('Ask a Question'),
            cs('Discussions'),
            cs('Design News'),
            cs('Design Articles'),
            cs('Trends in Design'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  5. MORE
// ════════════════════════════════════════════════════════════
const moreMenu: MegaMenuItem = {
  title: 'More',
  subcategories: [
    {
      title: 'Sarkari Exams',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Banking'),
            cs('IBPS Clerk'),
            cs('IBPS PO'),
            cs('SBI Clerk'),
            cs('SBI PO'),
            cs('IBPS RRB'),
            viewAll('All Banking Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Teaching'),
            cs('CTET'),
            cs('UPTET'),
            cs('UGC NET'),
            cs('CSIR NET'),
            cs('APSET'),
            viewAll('All Teaching Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('SSC'),
            cs('SSC CGL'),
            cs('SSC JE'),
            cs('SSC CHSL'),
            cs('SSC GD'),
            cs('SSC JHT'),
            viewAll('All SSC Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Defence'),
            cs('NDA'),
            cs('AFCAT'),
            cs('CDS'),
            cs('DRDO CEPTAM'),
            cs('RPF SI'),
            viewAll('All Defence Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Railway'),
            cs('RRB Group D'),
            cs('RRB NTPC'),
            cs('RRB JE'),
            cs('RPF Constable'),
            viewAll('All Railway Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('All Exams'),
            cs('All UPSC Exams'),
            cs('All State PSC Exams'),
            cs('All Scholarship Exams'),
            cs('All PSU Exams'),
            cs('All State Exams'),
            cs('All Insurance Exams'),
            cs('All Police Exams'),
            cs('All Sarkari Exams'),
          ],
        },
      ],
    },
    {
      title: 'Law',
      directLink: '/streams/law',
      columns: [
        {
          links: [
            hdr('Top Ranked Colleges'),
            cs('Top Law Colleges in India'),
            cs('Top Law Colleges in Bangalore'),
            cs('Top Law Colleges in Delhi'),
            cs('Top Law Colleges in Pune'),
            cs('Top Law Colleges in Hyderabad'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('B.A. LL.B.'),
            cs('BBA LL.B.'),
            cs('LL.B.'),
            cs('LL.M.'),
            cs('B.Sc. LL.B'),
            cs('B.Com LL.B'),
            cs('B.L.S. LL.B.'),
            viewAll('All Law Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Company Law'),
            cs('Business Law'),
            cs('Cyber Law'),
            cs('Corporate Law'),
            cs('Criminal Law'),
            cs('Administrative Law'),
            cs('Family Law'),
            cs('Constitutional Law'),
            cs('Environmental Law'),
            cs('Intellectual Property Law'),
            cs('Banking Law'),
            cs('Competition Law'),
            cs('Commercial Law'),
            cs('Immigration Law'),
            cs('Tax Law'),
            cs('Insurance Law'),
            cs('Energy Law'),
            cs('International Trade Law'),
            cs('Consumer Law'),
            cs('Arbitration Law'),
            cs('Real Estate / Infrastructure Law'),
            cs('Information Technology Law'),
            cs('Healthcare Law'),
            cs('Labor & Employment Law'),
            cs('Air & Space Law'),
            cs('Nuclear Law'),
            cs('Human Rights & International Humanitarian Law'),
            cs('Security & Investment Law'),
            cs('Entertainment & Media Law'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('CLAT'),
            cs('LSAT India'),
            cs('AILET'),
            cs('AIBE'),
            cs('DU LLB Exam'),
            cs('AMU Law Entrance Exam'),
            cs('ACLAT'),
            viewAll('All Law Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Colleges by Location'),
            cs('Law Colleges in India'),
            cs('Law Colleges in Punjab'),
            cs('Law Colleges in Delhi'),
            cs('Law Colleges in Chandigarh'),
            cs('Law Colleges in Maharashtra'),
            cs('Law Colleges in Orissa'),
            cs('Law Colleges in Uttarakhand'),
            cs('Law Colleges in West Bengal'),
            cs('Law Colleges in Karnataka'),
            cs('Law Colleges in Ludhiana'),
            cs('Law Colleges in Pune'),
            cs('Law Colleges in Jalandhar'),
            cs('Law Colleges in Bhubaneswar'),
            cs('Law Colleges in Roorkee'),
            cs('Law Colleges in Kolkata'),
            cs('Law Colleges in Udupi'),
          ],
        },
      ],
    },
    {
      title: 'Hospitality & Travel',
      directLink: '/streams/hospitality',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('BHM'),
            cs('Diploma in Hotel Management'),
            cs('B.Sc. In Hotel Management'),
            viewAll('All Hospitality Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            cs('Top Hotel Management Colleges in India'),
            cs('Top Hotel Management Colleges in Hyderabad'),
            cs('Top Hotel Management Colleges in Delhi'),
            cs('Top Hotel Management Colleges in Mumbai'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Catering'),
            cs('Culinary Arts'),
            cs('Event Management'),
            cs('Fares & Ticketing'),
            cs('Hotel / Hospitality Management'),
            cs('CBS'),
            cs('Travel & Tourism'),
            cs('Corporate Banking'),
            cs('Health Insurance'),
            cs('Investment Banking'),
            cs('Capital Markets'),
            viewAll('All Hospitality Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('IIHM eCHAT'),
            cs('NCHMCT JEE'),
            viewAll('All Hospitality Exams →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Colleges by Location'),
            cs('Culinary Arts colleges in India'),
            cs('Travel & Tourism colleges in India'),
            cs('Event Management colleges in India'),
          ],
        },
      ],
    },
    {
      title: 'Animation',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Sc. in Animation'),
            cs('M.Sc. in Animation'),
            cs('Diploma in Web/Graphic Design'),
            cs('Diploma in VFX'),
            cs('Diploma in Animation'),
            cs('B.Des Animation'),
            viewAll('All Animation Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            cs('Top Animation Colleges in India'),
            cs('Top Animation Colleges in Bangalore'),
            cs('Top Animation Colleges in Delhi'),
            cs('Top Animation Colleges in Kolkata'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('2D Animation'),
            cs('3D Animation'),
            cs('Animation Film Making'),
            cs('Animation Film Design'),
            cs('Digital Film Making'),
            cs('Game Design'),
            cs('Game Development'),
            cs('Graphic Designing'),
            cs('Graphic / Web Design'),
            cs('Motion Graphics'),
            cs('Sound & Video Editing'),
            cs('Stop Motion Animation'),
            cs('Visual Effects'),
            cs('VFX'),
            viewAll('All Animation Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('UCEED'),
            cs('NID DAT'),
            cs('NIFT Entrance Exam'),
            viewAll('All Animation Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Mass Communication & Media',
      directLink: '/streams/media',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.J.'),
            cs('B.J.M.C.'),
            cs('B.M.M.'),
            cs('M.A.'),
            cs('Diploma in Journalism'),
            cs('B.A. in Mass Communication'),
            viewAll('All Mass Communication Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            cs('Top Mass Communication Colleges in India'),
            cs('Top Mass Communication Colleges in Delhi'),
            cs('Top Mass Communication Colleges in Mumbai'),
            cs('Top Mass Communication Colleges in Kolkata'),
            cs('Top Mass Communication Colleges in Bangalore'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Advertising'),
            cs('Animation'),
            cs('Broadcasting'),
            cs('Communication'),
            cs('Corporate Communication'),
            cs('Digital Marketing'),
            cs('Event Management'),
            cs('Film & TV'),
            cs('Graphics & Multimedia'),
            cs('Journalism'),
            cs('Mass Communication'),
            cs('News Anchoring'),
            cs('Print & Electronic Media'),
            cs('Public Relations'),
            cs('Radio'),
            cs('Sports Journalism'),
            cs('Video Production'),
            viewAll('All Mass Communication Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('IIMC Entrance Exam'),
            cs('IPU CET'),
            cs('JNUEE'),
            cs('DUET'),
            viewAll('All Mass Communication Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Business & Management Studies',
      directLink: '/streams/management',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('BBA'),
            cs('Management Certifications'),
            cs('MBA/PGDM'),
            cs('Executive MBA/PGDM'),
            cs('Distance MBA'),
            cs('Online MBA'),
            cs('Part-Time MBA'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            cs('Top BBA Colleges in India'),
            cs('Top BBA Colleges in Delhi'),
            cs('Top BBA Colleges in Bangalore'),
            cs('Top BBA Colleges in Hyderabad'),
            cs('Top BBA Colleges in Pune'),
            cs('Top BBA Colleges in Kolkata'),
            cs('Top BBA Colleges in Mumbai'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('SET Exam'),
            cs('NPAT'),
            cs('SUAT BBA'),
            cs('DU JAT'),
            viewAll('All Management Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'IT & Software',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('BCA'),
            cs('B.Sc. in IT & Software'),
            cs('Distance BCA'),
            cs('MCA'),
            cs('M.Sc. in IT & Software'),
            cs('Part-Time MCA'),
            cs('Distance MCA'),
            cs('CCNA'),
            viewAll('All IT & Software Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            cs('Top BCA Colleges in India'),
            cs('Top BCA Colleges in Delhi'),
            cs('Top BCA Colleges in Bangalore'),
            cs('Top BCA Colleges in Mumbai'),
            cs('Top BCA Colleges in Pune'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Artificial Intelligence'),
            cs('Cloud Computing'),
            cs('Cyber Security'),
            cs('Data Analytics'),
            cs('Data Science'),
            cs('Database Management'),
            cs('Information Security'),
            cs('Information Technology'),
            cs('Machine Learning'),
            cs('Mobile Application Development'),
            cs('Network & Security'),
            cs('Programming'),
            cs('Software Development'),
            cs('Software Engineering'),
            cs('Web Designing'),
            cs('Web Development'),
            viewAll('All IT Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('NIMCET'),
            cs('MAH MCA CET'),
            cs('WBJEE JECA'),
            cs('IPU CET'),
            viewAll('All IT & Software Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Humanities & Social Sciences',
      directLink: '/streams/arts',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.A.'),
            cs('B.Sc. in Humanities & Social Sciences'),
            cs('B.S.W.'),
            cs('M.A.'),
            cs('M.Phil.'),
            cs('M.Sc. in Humanities & Social Sciences'),
            cs('MSW'),
            viewAll('All Humanities Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Anthropology'),
            cs('Archaeology'),
            cs('Communication Studies'),
            cs('Economics'),
            cs('Geography'),
            cs('History'),
            cs('Languages'),
            cs('Library & Information Science'),
            cs('Linguistics'),
            cs('Literature'),
            cs('Philosophy'),
            cs('Political Science'),
            cs('Psychology'),
            cs('Religious Studies'),
            cs('Rural Studies'),
            cs('Social Work'),
            cs('Sociology'),
            viewAll('All Humanities Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('JNUEE'),
            cs('DUET (CUET)'),
            cs('PUBDET'),
          ],
        },
      ],
    },
    {
      title: 'Arts (Fine/Visual/Performing)',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('BFA'),
            cs('MFA'),
            viewAll('All Arts Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            cs('Top Arts Colleges in India'),
            cs('Top Arts Colleges in Chennai'),
            cs('Top Arts Colleges in Mumbai'),
            cs('Top Colleges in Delhi for Arts'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Applied Arts'),
            cs('Art History & Aesthetics'),
            cs('Ceramics'),
            cs('Dance & Choreography'),
            cs('Decorative Arts'),
            cs('Film Making'),
            cs('Graphics Art'),
            cs('Muralist'),
            cs('Music'),
            cs('Painting & Drawing'),
            cs('Photography'),
            cs('Sculpture'),
            cs('Theatre'),
            viewAll('All Arts Specializations →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Science',
      directLink: '/streams/science',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Sc.'),
            cs('M.Sc.'),
            cs('Distance B.Sc.'),
            cs('Distance M.Sc.'),
            viewAll('All Science Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            cs('Top Science Colleges in Mumbai'),
            cs('Top Science Colleges in India'),
            cs('Top Science Colleges in Pune'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('MCAER CET'),
            cs('CUET UG'),
            cs('CUET PG'),
            cs('NEST'),
            cs('IIT JAM'),
            cs('JEST'),
            viewAll('All Science Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Architecture & Planning',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Arch.'),
            cs('M.Arch.'),
            cs('M.Plan'),
            cs('B.Plan'),
            cs('Diploma in Architecture'),
            viewAll('All Architecture Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            cs('Top Architecture Colleges in India'),
            cs('Top Architecture Colleges in Bangalore'),
            cs('Top Architecture Colleges in Mumbai'),
            cs('Top Architecture Colleges in Delhi'),
            cs('Top Architecture Colleges in Chennai'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Architectural Engineering'),
            cs('Building Construction & Materials'),
            cs('Building Economics and Estimation'),
            cs('Computer Aided Design'),
            cs('Construction Project Management'),
            cs('Environmental Planning'),
            cs('Habitat Planning'),
            cs('Housing Planning'),
            cs('Industrial Design'),
            cs('Landscape Architecture'),
            cs('Infrastructure Planning'),
            cs('Interior Architecture'),
            cs('Regional Planning'),
            cs('Sustainable Architecture'),
            cs('Transportation Planning'),
            cs('Urban Architecture'),
            cs('Urban Planning'),
            viewAll('All Architecture Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('AAT'),
            cs('NATA'),
            cs('UPAT'),
            cs('JEE Main Paper 2'),
            viewAll('All Architecture Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Accounting & Commerce',
      directLink: '/streams/commerce',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Com.'),
            cs('M.Com.'),
            cs('CA'),
            cs('CS'),
            cs('CMA'),
            cs('ACCA'),
            cs('Diploma in Accounting'),
            cs('Diploma in Taxation'),
            viewAll('All Commerce Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Colleges'),
            cs('Top Commerce Colleges in India'),
            cs('Top Commerce Colleges in Mumbai'),
            cs('Top Commerce Colleges in Delhi'),
            cs('Top Commerce Colleges in Pune'),
            cs('Top Commerce Colleges in Bangalore'),
            cs('Top Commerce Colleges in Kolkata'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Accounting'),
            cs('Auditing'),
            cs('Banking & Finance'),
            cs('Business Studies'),
            cs('Commerce'),
            cs('Cost & Management Accounting'),
            cs('Economics'),
            cs('Financial Reporting'),
            cs('GST'),
            cs('International Business'),
            cs('Taxation'),
            viewAll('All Commerce Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('ICAI'),
            cs('ICSI'),
            cs('CMA Exam'),
            cs('ACCA'),
            viewAll('All Accounting & Commerce Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Banking, Finance & Insurance',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('CFA'),
            cs('CFP'),
            cs('FRM'),
            cs('Diploma in Banking & Finance'),
            cs('B.Com. Banking & Finance'),
            cs('MBA Finance'),
            viewAll('All Banking & Finance Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Colleges'),
            cs('Top Finance Colleges in India'),
            cs('Top Banking Colleges in India'),
            cs('Top Insurance Colleges in India'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Banking'),
            cs('Capital Markets'),
            cs('CBS'),
            cs('Corporate Banking'),
            cs('Finance'),
            cs('Financial Management'),
            cs('Health Insurance'),
            cs('Insurance'),
            cs('Investment Banking'),
            cs('Life Insurance'),
            cs('Mutual Funds'),
            cs('Risk Management'),
            cs('Wealth Management'),
            viewAll('All Banking Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('IBPS PO'),
            cs('IBPS Clerk'),
            cs('SBI PO'),
            cs('RBI Grade B'),
            cs('IRDA'),
            viewAll('All Banking Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Aviation',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('BBA Aviation'),
            cs('MBA Aviation'),
            cs('B.Sc. Aviation'),
            cs('Diploma in Aviation'),
            cs('Commercial Pilot License'),
            viewAll('All Aviation Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Colleges'),
            cs('Top Aviation Colleges in India'),
            cs('Top Aviation Colleges in Delhi'),
            cs('Top Aviation Colleges in Mumbai'),
            cs('Top Aviation Colleges in Bangalore'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Cabin Crew / Air Hostess'),
            cs('Aircraft Maintenance Engineering'),
            cs('Airport Management'),
            cs('Cargo Management'),
            cs('Flying / Pilot Training'),
            cs('Ground Services'),
            cs('Aviation Management'),
            cs('Airport Operations'),
            viewAll('All Aviation Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('IGRUA Entrance Exam'),
            cs('AME CET'),
            viewAll('All Aviation Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Teaching & Education',
      directLink: '/streams/education',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Ed.'),
            cs('B.P.Ed.'),
            cs('B.Voc'),
            cs('M.Ed.'),
            cs('M.P.Ed.'),
            cs('D.Ed.'),
            cs('D.El.Ed.'),
            viewAll('All Education Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top Colleges'),
            cs('Top B.Ed. Colleges in India'),
            cs('Top B.Ed. Colleges in Delhi'),
            cs('Top B.Ed. Colleges in Mumbai'),
            cs('Top B.Ed. Colleges in Bangalore'),
            cs('Top B.Ed. Colleges in Kolkata'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Early Childhood Education'),
            cs('Educational Administration'),
            cs('Educational Psychology'),
            cs('Elementary Education'),
            cs('Physical Education'),
            cs('Secondary Education'),
            cs('Special Education'),
            cs('Teacher Training'),
            viewAll('All Education Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('CTET'),
            cs('TSTET'),
            cs('UGC NET'),
            cs('PTET'),
            cs('UP B.Ed JEE'),
            cs('MAH B.Ed. CET'),
            viewAll('All Education Exams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Nursing',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Sc. Nursing'),
            cs('M.Sc. in Nursing'),
            viewAll('All Nursing Courses →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Popular Specializations'),
            cs('Nursing & Midwifery'),
            viewAll('All Nursing Specializations →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Colleges by Location'),
            cs('Nursing Colleges in Uttar Pradesh'),
            cs('Nursing Colleges in Bihar'),
            cs('Nursing Colleges in Bangalore'),
            cs('Nursing Colleges in Kerala'),
            cs('Nursing Colleges in Kolkata'),
            cs('Nursing Colleges in Delhi NCR'),
          ],
        },
      ],
    },
    {
      title: 'Beauty & Fitness',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Popular Specializations'),
            cs('Beauty Culture & Cosmetology'),
            cs('Massage & Spa Therapy'),
            cs('Yoga'),
            viewAll('All Beauty & Fitness Courses →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Universities and Colleges',
      columns: [
        {
          links: [
            hdr('Top Central Universities'),
            cs('University of Delhi'),
            cs('JNU Delhi'),
            cs('IGNOU Delhi'),
            cs('Banaras Hindu University'),
          ],
        },
        {
          links: [
            hdr('Top State Universities'),
            cs('University of Mumbai'),
            cs('Anna University'),
            cs('Gujarat University'),
            cs('CCS University'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Universities'),
            cs('Top Universities in India'),
            cs('Top Colleges in India'),
            cs('Top Universities in Bangalore'),
            cs('Top Universities in Delhi'),
            cs('Top Universities in Punjab'),
          ],
        },
        {
          links: [
            hdr('Colleges by State'),
            cs('Colleges in Maharashtra'),
            cs('Colleges in Karnataka'),
            cs('Colleges in Uttar Pradesh'),
            cs('Colleges in Kerala'),
          ],
        },
        {
          links: [
            hdr('Colleges by City'),
            cs('Colleges in Delhi'),
            cs('Colleges in Bangalore'),
            cs('Colleges in Mumbai'),
            cs('Colleges in Hyderabad'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  6. STUDY ABROAD
// ════════════════════════════════════════════════════════════
const studyAbroadMenu: MegaMenuItem = {
  title: 'Study Abroad',
  subcategories: [
    {
      title: 'Countries',
      columns: [
        {
          links: [
            hdr('Top Countries'),
            { label: 'USA', href: '/tools/study-abroad', comingSoon: false },
            { label: 'UK', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Canada', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Australia', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Germany', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Ireland', href: '/tools/study-abroad', comingSoon: false },
            { label: 'France', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Singapore', href: '/tools/study-abroad', comingSoon: false },
            { label: 'New Zealand', href: '/tools/study-abroad', comingSoon: false },
            { label: 'Japan', href: '/tools/study-abroad', comingSoon: false },
            viewAll('View All Countries →', '/tools/study-abroad', false),
          ],
        },
        {
          links: [
            hdr('Top Universities'),
            cs('Top Universities in USA'),
            cs('Top Universities in UK'),
            cs('Top Universities in Canada'),
            cs('Top Universities in Australia'),
            cs('Top Universities in Germany'),
            cs('Top Universities in Ireland'),
            cs('Top Universities in France'),
            cs('Top Universities in Singapore'),
            viewAll('Top Universities Abroad →', '/tools/international-colleges', false),
          ],
        },
      ],
    },
    {
      title: 'Exams',
      columns: [
        {
          links: [
            hdr('Language Exams'),
            cs('IELTS'),
            cs('TOEFL'),
            cs('PTE'),
            cs('DET'),
            hdr('Aptitude Exams'),
            cs('GRE'),
            cs('GMAT'),
            cs('SAT'),
          ],
        },
        {
          links: [
            cs('Free IELTS Masterclass'),
            cs('IELTS Preparation Resource'),
            cs('IELTS Reading Test'),
            cs('IELTS Writing Test'),
            cs('IELTS Listening Test'),
            cs('IELTS Speaking Test'),
          ],
        },
      ],
    },
    {
      title: 'Popular Programs',
      columns: [
        {
          links: [
            hdr('Top MS Colleges'),
            cs('MS in USA'),
            cs('MS in UK'),
            cs('MS in Canada'),
            cs('MS in Australia'),
            cs('MS in Germany'),
            cs('MS in Ireland'),
            viewAll('Explore MS Abroad →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top MBA Colleges'),
            cs('MBA in USA'),
            cs('MBA in UK'),
            cs('MBA in Canada'),
            cs('MBA in Australia'),
            cs('MBA in Germany'),
            cs('MBA in Ireland'),
            viewAll('Explore MBA Abroad →', '/coming-soon'),
          ],
        },
        {
          links: [
            hdr('Top BE/BTech Colleges'),
            cs('BE/B.Tech in USA'),
            cs('BE/B.Tech in UK'),
            cs('BE/B.Tech in Canada'),
            cs('BE/B.Tech in Australia'),
            viewAll('Explore BE/B.Tech →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Student Visas',
      columns: [
        {
          links: [
            cs('Student Visa Canada'),
            cs('Student Visa USA'),
            cs('Student Visa Australia'),
            cs('Student Visa New Zealand'),
            cs('Student Visa UK'),
            cs('Student Visa Germany'),
            cs('Student Visa France'),
            cs('Student Visa Singapore'),
            cs('Student Visa Ireland'),
            cs('Student Visa Finland'),
          ],
        },
      ],
    },
    {
      title: 'SOP/LOR',
      columns: [
        {
          links: [
            hdr('SOP'),
            cs('What is SOP?'),
            cs('Common Mistakes in SOP'),
            cs('Sample SOP for MBA'),
            cs('Sample SOP for MS'),
            cs('Sample SOP for Bachelors'),
            cs('SOP for USA'),
            cs('SOP for UK'),
            cs('SOP for Canada'),
          ],
        },
        {
          links: [
            hdr('LOR'),
            cs('What is LOR?'),
            cs('Common Mistakes in LOR'),
            cs('Sample LOR for MBA'),
            cs('Sample LOR for MS'),
            cs('Sample LOR for Bachelors'),
            cs('Sample LOR for PhD'),
          ],
        },
      ],
    },
    {
      title: 'Scholarships',
      columns: [
        {
          links: [
            hdr('By Course'),
            cs('Scholarships for Bachelors'),
            cs('Scholarships for Masters'),
          ],
        },
        {
          links: [
            hdr('By Country'),
            cs('Scholarships for USA'),
            cs('Scholarships for Canada'),
            cs('Scholarships for Australia'),
            cs('Scholarships for UK'),
            cs('Scholarships for Germany'),
            cs('Scholarships for Singapore'),
          ],
        },
      ],
    },
    {
      title: 'Education Loan',
      columns: [
        {
          links: [
            hdr('Education Loan Guides'),
            cs('Step by Step Guide'),
            cs('Loan Eligibility Criteria'),
            cs('Documents Required for Loan'),
            cs('Student Loan Vs Self Finance'),
            cs('Best Education Loan Providers'),
            cs('Collateral for Education Loan'),
          ],
        },
        {
          links: [
            hdr('Guide for Countries'),
            cs('Education Loan for USA'),
            cs('Education Loan for UK'),
            cs('Education Loan for Canada'),
            cs('Education Loan for Australia'),
            cs('Education Loan for Germany'),
          ],
        },
      ],
    },
    {
      title: 'Services',
      columns: [
        {
          links: [
            hdr('Top Overseas Education Consultants'),
            cs('Consultants in Delhi'),
            cs('Consultants in Mumbai'),
            cs('Consultants in Pune'),
            cs('Consultants in Kochi'),
            cs('Consultants in Bangalore'),
            cs('Consultants in Kerala'),
            cs('Consultants in Chennai'),
            cs('Consultants in Hyderabad'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  7. COUNSELING
// ════════════════════════════════════════════════════════════
const counselingMenu: MegaMenuItem = {
  title: 'Counseling',
  subcategories: [
    {
      title: 'Get Expert Guidance',
      columns: [
        {
          links: [
            cs('Ask a Question'),
            cs('Discussions'),
          ],
        },
      ],
    },
    {
      title: 'Careers after 12th',
      columns: [
        {
          links: [
            hdr('By Stream'),
            cs('Science'),
            cs('Commerce'),
            cs('Humanities'),
          ],
        },
        {
          links: [
            hdr('Popular Careers'),
            cs('Aeronautical Engineer'),
            cs('Chartered Accountant'),
            cs('Computer Engineer'),
            cs('Doctor'),
            cs('Hotel Manager'),
            cs('Pilot'),
            viewAll('All other careers →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Courses after 12th',
      columns: [
        {
          links: [
            cs('Science Stream'),
            cs('Commerce Stream'),
            cs('Arts Stream'),
            viewAll('All Class 12th Streams →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Free Prep Material',
      columns: [
        {
          links: [
            hdr('NCERT Solutions'),
            cs('NCERT Solutions'),
            cs('NCERT Solutions for Class 12 Maths'),
            cs('NCERT Solutions for Class 12 Physics'),
            cs('NCERT Solutions for Class 12 Chemistry'),
            cs('NCERT Solutions for Class 11 Maths'),
            cs('NCERT Solutions for Class 11 Physics'),
            cs('NCERT Solutions for Class 11 Chemistry'),
          ],
        },
        {
          links: [
            hdr('NCERT Topics'),
            cs('NCERT Notes'),
            cs('NCERT Class 12 Notes'),
            cs('NCERT Class 11 Notes'),
            cs('NCERT Class 12 Maths'),
            cs('NCERT Class 12 Physics'),
            cs('NCERT Class 12 Chemistry'),
            cs('NCERT Class 11 Maths'),
            cs('NCERT Class 11 Physics'),
            cs('NCERT Class 11 Chemistry'),
          ],
        },
      ],
    },
    {
      title: 'National Boards',
      columns: [
        {
          links: [
            cs('CBSE'),
            cs('ICSE'),
            cs('NIOS'),
            viewAll('All Education Boards →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'State Boards',
      columns: [
        {
          links: [
            cs('UPMSP'),
            cs('BSEB'),
            cs('PSEB'),
            cs('RBSE'),
            cs('JKBOSE'),
          ],
        },
        {
          links: [
            cs('GSEB'),
            cs('HPBOSE'),
            cs('MPBSE'),
            cs('BIEAP'),
          ],
        },
        {
          links: [
            cs('BSEH'),
            cs('CGBSE'),
            cs('WBBSE'),
            cs('WBCHSE'),
            viewAll('All Education Boards →', '/coming-soon'),
          ],
        },
      ],
    },
    {
      title: 'Abroad Counseling Service',
      directLink: '/coming-soon',
      columns: [],
    },
    {
      title: 'Get Free Counselling',
      directLink: '/coming-soon',
      columns: [],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  8. ONLINE COURSES (Shiksha Online)
// ════════════════════════════════════════════════════════════
const onlineCoursesMenu: MegaMenuItem = {
  title: 'Online Courses',
  subcategories: [
    {
      title: 'Technology',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses In Technology'),
            cs('Big Data'),
            cs('Cloud Technologies'),
            cs('Cybersecurity'),
            cs('Databases'),
            cs('IT Services'),
            cs('Networking and Hardware'),
            cs('Operating System'),
            cs('Programming'),
            cs('QA and Testing'),
            cs('Web Development'),
            cs('Software Tools'),
          ],
        },
      ],
    },
    {
      title: 'Data Science',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses In Data Science'),
            cs('Data Science Basics'),
            cs('Data Science for HealthCare'),
            cs('Deep Learning'),
            cs('Machine Learning'),
          ],
        },
      ],
    },
    {
      title: 'Management',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses In Management'),
            cs('Business Analytics'),
            cs('Business Tools'),
            cs('Communication'),
            cs('Entrepreneurship'),
            cs('Human Resources'),
            cs('Logistics and Supply Chain'),
            cs('Marketing'),
            cs('Operations'),
            cs('Product Management'),
            cs('Strategy and Leadership'),
          ],
        },
      ],
    },
    {
      title: 'Finance',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('Accounting'),
            cs('Banking'),
            cs('Investing'),
            cs('Law'),
            cs('Insurance'),
          ],
        },
      ],
    },
    {
      title: 'Creativity & Design',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('Architecture'),
            cs('Fashion'),
            cs('Web Design'),
          ],
        },
      ],
    },
    {
      title: 'Emerging Technologies',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('AR VR and Gaming'),
            cs('BlockChain'),
            cs('Electric Vehicles'),
            cs('Internet of Things'),
            cs('Robotics'),
          ],
        },
      ],
    },
    {
      title: 'Healthcare',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('Fitness and Nutrition'),
            cs('Healthcare Research'),
            cs('Healthcare Management'),
          ],
        },
      ],
    },
    {
      title: 'Personal Development',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('Career Growth'),
            cs('Hobby And Passion'),
            cs('Languages'),
          ],
        },
      ],
    },
    {
      title: 'Degree Programs',
      directLink: '/coming-soon',
      columns: [
        {
          links: [
            hdr('Courses'),
            cs('Bachelors Program'),
            cs('Masters Program'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  EXPORT ALL MENU DATA
// ════════════════════════════════════════════════════════════
export const megaMenuItems: MegaMenuItem[] = [
  mbaMenu,
  engineeringMenu,
  medicalMenu,
  designMenu,
  moreMenu,
  studyAbroadMenu,
  counselingMenu,
  onlineCoursesMenu,
];
