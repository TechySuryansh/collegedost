// ──────────────────────────────────────────────────────────
// Mega Menu Data — with all working redirects resolved
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

// ─── Helpers ────────────────────────────────────────────────

/** Coming-soon placeholder */
const cs = (label: string): MegaMenuLink => ({
  label, href: '/coming-soon', comingSoon: true,
});

/** Section header (non-clickable) */
const hdr = (label: string): MegaMenuLink => ({
  label, href: '#', isHeader: true,
});

/** "View all" link */
const va = (label: string, href: string, comingSoon = false): MegaMenuLink => ({
  label,
  href: comingSoon ? '/coming-soon' : href,
  isViewAll: true,
  comingSoon,
});

/** Working link */
const lk = (label: string, href: string): MegaMenuLink => ({
  label, href, comingSoon: false,
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
            lk('Top MBA Colleges in India', '/tools/colleges?stream=Management'),
            lk('Top Private MBA Colleges in India', '/tools/colleges?stream=Management&ownership=Private'),
            lk('Top Govt MBA Colleges in India', '/tools/colleges?stream=Management&ownership=Government'),
            lk('Top MBA Colleges in Bangalore', '/tools/colleges?stream=Management&city=Bangalore'),
            lk('Top MBA Colleges in Mumbai', '/tools/colleges?stream=Management&city=Mumbai'),
            lk('Top MBA Colleges in Pune', '/tools/colleges?stream=Management&city=Pune'),
            lk('Top MBA Colleges in Hyderabad', '/tools/colleges?stream=Management&city=Hyderabad'),
            lk('Top MBA Colleges in Delhi', '/tools/colleges?stream=Management&city=Delhi'),
            lk('Top MBA Colleges in Chennai', '/tools/colleges?stream=Management&city=Chennai'),
            lk('Top MBA Colleges in Maharashtra', '/tools/colleges?stream=Management&state=Maharashtra'),
            lk('Top MBA Colleges in Kolkata', '/tools/colleges?stream=Management&city=Kolkata'),
            lk('Top MBA Colleges in Kerala', '/tools/colleges?stream=Management&state=Kerala'),
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
            lk('CAT', '/tools/exams'),
            lk('CMAT', '/tools/exams'),
            lk('SNAP', '/tools/exams'),
            lk('XAT', '/tools/exams'),
            lk('MAT', '/tools/exams'),
            cs('ATMA'),
            cs('NMAT by GMAC'),
            cs('IBSAT'),
            cs('KIITEE Management'),
            cs('UPCET'),
            va('All MBA Exams →', '/tools/exams'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            lk('MBA Colleges in India', '/tools/colleges?stream=Management'),
            lk('MBA Colleges in Bangalore', '/tools/colleges?stream=Management&city=Bangalore'),
            lk('MBA Colleges in Chennai', '/tools/colleges?stream=Management&city=Chennai'),
            lk('MBA Colleges in Delhi-NCR', '/tools/colleges?stream=Management&city=Delhi'),
            lk('MBA Colleges in Hyderabad', '/tools/colleges?stream=Management&city=Hyderabad'),
            lk('MBA Colleges in Kolkata', '/tools/colleges?stream=Management&city=Kolkata'),
            lk('MBA Colleges in Mumbai', '/tools/colleges?stream=Management&city=Mumbai'),
            lk('MBA Colleges in Pune', '/tools/colleges?stream=Management&city=Pune'),
            va('All Locations →', '/tools/colleges?stream=Management'),
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
            va('Compare other MBA colleges →', '/tools/compare-colleges'),
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
      title: 'CAT College Predictor',
      directLink: '/predictors/cat-predictor',
      columns: [],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            cs('IIM & Non IIM Call Predictor'),
            lk('CAT College Predictor', '/predictors/cat-predictor'),
            cs('MAH CET College Predictor'),
            cs('XAT College/Call Predictor'),
            cs('IIFT College Predictor'),
            cs('NMAT College Predictor'),
            cs('SNAP College and Call Predictor'),
            cs('CMAT College Predictor'),
            va('MBA College Predictor →', '/predictors'),
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
            lk('MBA News', '/tools/news'),
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
            lk('Top Engineering Colleges in India', '/tools/colleges?stream=Engineering'),
            lk('Top Private Engineering Colleges', '/tools/colleges?stream=Engineering&ownership=Private'),
            lk('Top Govt Engineering Colleges', '/tools/colleges?stream=Engineering&ownership=Government'),
            lk('Top IITs in India', '/tools/colleges?stream=Engineering&search=IIT'),
            lk('Top NITs in India', '/tools/colleges?stream=Engineering&search=NIT'),
            lk('Top Engineering Colleges in Bangalore', '/tools/colleges?stream=Engineering&city=Bangalore'),
            lk('Top Engineering Colleges in Karnataka', '/tools/colleges?stream=Engineering&state=Karnataka'),
            lk('Top Engineering Colleges in Hyderabad', '/tools/colleges?stream=Engineering&city=Hyderabad'),
            lk('Top Engineering Colleges in Pune', '/tools/colleges?stream=Engineering&city=Pune'),
            lk('Top Engineering Colleges in Mumbai', '/tools/colleges?stream=Engineering&city=Mumbai'),
            lk('Top Engineering Colleges in Maharashtra', '/tools/colleges?stream=Engineering&state=Maharashtra'),
            lk('Top Engineering Colleges in Chennai', '/tools/colleges?stream=Engineering&city=Chennai'),
            lk('Top Engineering Colleges in Kerala', '/tools/colleges?stream=Engineering&state=Kerala'),
            lk('Top Engineering Colleges in Delhi', '/tools/colleges?stream=Engineering&city=Delhi'),
            lk('Top Engineering Colleges in Telangana', '/tools/colleges?stream=Engineering&state=Telangana'),
            lk('Top Engineering Colleges in Gujarat', '/tools/colleges?stream=Engineering&state=Gujarat'),
            lk('Top Engineering Colleges in West Bengal', '/tools/colleges?stream=Engineering&state=West Bengal'),
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
            va('All Engineering Courses →', '/tools/courses'),
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
            cs('Microelectronics'),
            cs('Ceramic Engineering'),
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
            lk('JEE Main', '/tools/exams'),
            lk('JEE Advanced', '/tools/exams'),
            lk('BITSAT', '/tools/exams'),
            lk('GATE', '/tools/exams'),
            cs('COMEDK UGET'),
            cs('WBJEE'),
            cs('LPU-NEST'),
            cs('CGCUET'),
            va('All Engineering Exams →', '/tools/exams'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            lk('Engineering Colleges in India', '/tools/colleges?stream=Engineering'),
            lk('Engineering Colleges in Bangalore', '/tools/colleges?stream=Engineering&city=Bangalore'),
            lk('Engineering Colleges in Chennai', '/tools/colleges?stream=Engineering&city=Chennai'),
            lk('Engineering Colleges in Delhi-NCR', '/tools/colleges?stream=Engineering&city=Delhi'),
            lk('Engineering Colleges in Kolkata', '/tools/colleges?stream=Engineering&city=Kolkata'),
            lk('Engineering Colleges in Mumbai', '/tools/colleges?stream=Engineering&city=Mumbai'),
            lk('Engineering Colleges in Pune', '/tools/colleges?stream=Engineering&city=Pune'),
            lk('Engineering Colleges in Hyderabad', '/tools/colleges?stream=Engineering&city=Hyderabad'),
            va('All Locations →', '/tools/colleges?stream=Engineering'),
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
            cs('IIT Bombay Vs IIT Delhi'),
            cs('BITS Pilani Vs DTU Delhi'),
            va('Compare other colleges →', '/tools/compare-colleges'),
          ],
        },
      ],
    },
    {
      title: 'Rank Predictors',
      columns: [
        {
          links: [
            lk('JEE Main Rank Predictor', '/predictors/rank-predictor'),
            lk('JEE Advanced Rank Predictor', '/predictors/rank-predictor'),
            cs('COMEDK UGET Rank Predictor'),
          ],
        },
      ],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            lk('JEE Main College Predictor', '/predictors/jee-main-predictor'),
            lk('JEE Advanced College Predictor', '/predictors/predict-colleges'),
            lk('GATE College Predictor', '/predictors/gate-predictor'),
            lk('MHT CET College Predictor', '/predictors/mht-cet-predictor'),
            lk('BITSAT College Predictor', '/predictors/bitsat-predictor'),
            lk('VITEEE College Predictor', '/predictors/viteee-predictor'),
            cs('COMEDK UGET College Predictor'),
            cs('KCET College Predictor'),
            cs('KEAM College Predictor'),
            cs('AP EAMCET College Predictor'),
            cs('TS EAMCET College Predictor'),
            va('Engineering College Predictor →', '/predictors'),
          ],
        },
        {
          links: [
            cs('TNEA College Predictor'),
            cs('WBJEE College Predictor'),
            cs('IPU CET College Predictor'),
            cs('OJEE College Predictor'),
            cs('GUJCET College Predictor'),
            cs('SRMJEEE College Predictor'),
            cs('JAC Delhi College Predictor'),
            cs('JAC Chandigarh College Predictor'),
            cs('MP BE College Predictor'),
            cs('PTU BTech College Predictor'),
            cs('CG PET College Predictor'),
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
            lk('Engineering News', '/tools/news'),
            cs('Engineering Articles'),
            cs('Apply to colleges'),
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
            lk('Top Medical Colleges in India', '/tools/colleges?stream=Medicine'),
            lk('Top Private Medical Colleges in India', '/tools/colleges?stream=Medicine&ownership=Private'),
            lk('Top Govt Medical Colleges in India', '/tools/colleges?stream=Medicine&ownership=Government'),
            lk('Top Pharmacy Colleges in India', '/tools/colleges?stream=Pharmacy'),
            lk('Top Medical Colleges in Bangalore', '/tools/colleges?stream=Medicine&city=Bangalore'),
            lk('Top Medical Colleges in Karnataka', '/tools/colleges?stream=Medicine&state=Karnataka'),
            lk('Top Medical Colleges in Maharashtra', '/tools/colleges?stream=Medicine&state=Maharashtra'),
            lk('Top Medical Colleges in Mumbai', '/tools/colleges?stream=Medicine&city=Mumbai'),
            lk('Top Medical Colleges in Delhi', '/tools/colleges?stream=Medicine&city=Delhi'),
            lk('Top Medical Colleges in Tamil Nadu', '/tools/colleges?stream=Medicine&state=Tamil Nadu'),
            lk('Top Pharmacy Colleges in Maharashtra', '/tools/colleges?stream=Pharmacy&state=Maharashtra'),
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
            va('All Medical Courses →', '/tools/courses'),
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
            lk('Pharmacy', '/streams/pharmacy'),
            cs('Physiotherapy'),
            cs('Public Health & Management'),
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
            lk('NEET UG', '/tools/exams'),
            lk('NEET PG', '/tools/exams'),
            cs('NEET SS'),
            cs('NEET MDS'),
            lk('INI CET', '/tools/exams'),
            cs('FMGE'),
            cs('AIAPGET'),
            va('All Medicine Exams →', '/tools/exams'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            lk('Medical Colleges in India', '/tools/colleges?stream=Medicine'),
            lk('Medical Colleges in Delhi', '/tools/colleges?stream=Medicine&city=Delhi'),
            lk('Medical Colleges in Bangalore', '/tools/colleges?stream=Medicine&city=Bangalore'),
            lk('Medical Colleges in Chennai', '/tools/colleges?stream=Medicine&city=Chennai'),
            lk('Medical Colleges in Hyderabad', '/tools/colleges?stream=Medicine&city=Hyderabad'),
            lk('Medical Colleges in Mumbai', '/tools/colleges?stream=Medicine&city=Mumbai'),
            lk('Medical Colleges in Kolkata', '/tools/colleges?stream=Medicine&city=Kolkata'),
            lk('Medical Colleges in Pune', '/tools/colleges?stream=Medicine&city=Pune'),
          ],
        },
      ],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            lk('NEET College Predictor', '/predictors/neet-predictor'),
            lk('AIIMS Predictor', '/predictors/aiims-predictor'),
            cs('NEET PG College Predictor'),
            va('Medicine College Predictor →', '/predictors'),
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
            lk('Medical News', '/tools/news'),
            cs('Medical Articles'),
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
            lk('Top Design Colleges in India', '/tools/colleges?stream=Design'),
            lk('Top Fashion Design Colleges in India', '/tools/colleges?stream=Design'),
            lk('Top Design Colleges in Bangalore', '/tools/colleges?stream=Design&city=Bangalore'),
            lk('Top Design Colleges in Delhi/NCR', '/tools/colleges?stream=Design&city=Delhi'),
            lk('Top Design Colleges in Mumbai', '/tools/colleges?stream=Design&city=Mumbai'),
            lk('Top Design Colleges in Pune', '/tools/colleges?stream=Design&city=Pune'),
            lk('Top Design Colleges in Hyderabad', '/tools/colleges?stream=Design&city=Hyderabad'),
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
            va('All Design Courses →', '/tools/courses'),
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
            va('All Design Exams →', '/tools/exams'),
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
            va('Design College Predictor →', '/predictors'),
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            lk('Design Colleges in India', '/tools/colleges?stream=Design'),
            lk('Design Colleges in Maharashtra', '/tools/colleges?stream=Design&state=Maharashtra'),
            lk('Design Colleges in Delhi', '/tools/colleges?stream=Design&city=Delhi'),
            lk('Design Colleges in Karnataka', '/tools/colleges?stream=Design&state=Karnataka'),
            lk('Design Colleges in Gujarat', '/tools/colleges?stream=Design&state=Gujarat'),
            lk('Design Colleges in Rajasthan', '/tools/colleges?stream=Design&state=Rajasthan'),
            lk('Design Colleges in Tamil Nadu', '/tools/colleges?stream=Design&state=Tamil Nadu'),
          ],
        },
        {
          links: [
            lk('Design Colleges in Pune', '/tools/colleges?stream=Design&city=Pune'),
            lk('Design Colleges in Mumbai', '/tools/colleges?stream=Design&city=Mumbai'),
            lk('Design Colleges in Bangalore', '/tools/colleges?stream=Design&city=Bangalore'),
            lk('Design Colleges in Hyderabad', '/tools/colleges?stream=Design&city=Hyderabad'),
            lk('Design Colleges in Ahmedabad', '/tools/colleges?stream=Design&city=Ahmedabad'),
            lk('Design Colleges in Jaipur', '/tools/colleges?stream=Design&city=Jaipur'),
            lk('Design Colleges in Indore', '/tools/colleges?stream=Design&city=Indore'),
            lk('Design Colleges in Gurgaon', '/tools/colleges?stream=Design&city=Gurgaon'),
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
            lk('Design News', '/tools/news'),
            cs('Design Articles'),
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
      directLink: '/tools/exams',
      columns: [
        {
          links: [
            hdr('Banking'),
            cs('IBPS Clerk'),
            cs('IBPS PO'),
            cs('SBI Clerk'),
            cs('SBI PO'),
            cs('IBPS RRB'),
            va('All Banking Exams →', '/tools/exams'),
          ],
        },
        {
          links: [
            hdr('Teaching'),
            cs('CTET'),
            cs('UPTET'),
            cs('UGC NET'),
            cs('CSIR NET'),
            va('All Teaching Exams →', '/tools/exams'),
          ],
        },
        {
          links: [
            hdr('SSC'),
            cs('SSC CGL'),
            cs('SSC JE'),
            cs('SSC CHSL'),
            cs('SSC GD'),
            va('All SSC Exams →', '/tools/exams'),
          ],
        },
        {
          links: [
            hdr('Defence'),
            cs('NDA'),
            cs('AFCAT'),
            cs('CDS'),
            cs('DRDO CEPTAM'),
            va('All Defence Exams →', '/tools/exams'),
          ],
        },
        {
          links: [
            hdr('Railway'),
            cs('RRB Group D'),
            cs('RRB NTPC'),
            cs('RRB JE'),
            va('All Railway Exams →', '/tools/exams'),
          ],
        },
        {
          links: [
            hdr('All Exams'),
            cs('All UPSC Exams'),
            cs('All State PSC Exams'),
            cs('All Scholarship Exams'),
            cs('All PSU Exams'),
            cs('All Police Exams'),
            va('All Sarkari Exams →', '/tools/exams'),
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
            lk('Top Law Colleges in India', '/tools/colleges?stream=Law'),
            lk('Top Law Colleges in Bangalore', '/tools/colleges?stream=Law&city=Bangalore'),
            lk('Top Law Colleges in Delhi', '/tools/colleges?stream=Law&city=Delhi'),
            lk('Top Law Colleges in Pune', '/tools/colleges?stream=Law&city=Pune'),
            lk('Top Law Colleges in Hyderabad', '/tools/colleges?stream=Law&city=Hyderabad'),
            lk('Top Law Colleges in Mumbai', '/tools/colleges?stream=Law&city=Mumbai'),
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
            va('All Law Courses →', '/tools/courses'),
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
            cs('Constitutional Law'),
            cs('Environmental Law'),
            cs('Intellectual Property Law'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            lk('CLAT', '/predictors/clat-predictor'),
            cs('LSAT India'),
            cs('AILET'),
            cs('AIBE'),
            cs('DU LLB Exam'),
            va('All Law Exams →', '/tools/exams'),
          ],
        },
        {
          links: [
            hdr('Colleges by Location'),
            lk('Law Colleges in India', '/tools/colleges?stream=Law'),
            lk('Law Colleges in Delhi', '/tools/colleges?stream=Law&city=Delhi'),
            lk('Law Colleges in Maharashtra', '/tools/colleges?stream=Law&state=Maharashtra'),
            lk('Law Colleges in Karnataka', '/tools/colleges?stream=Law&state=Karnataka'),
            lk('Law Colleges in West Bengal', '/tools/colleges?stream=Law&state=West Bengal'),
            lk('Law Colleges in Kolkata', '/tools/colleges?stream=Law&city=Kolkata'),
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
            hdr('Top Ranked Colleges'),
            lk('Top Hotel Management Colleges in India', '/tools/colleges?stream=Hospitality'),
            lk('Top Hotel Management Colleges in Delhi', '/tools/colleges?stream=Hospitality&city=Delhi'),
            lk('Top Hotel Management Colleges in Mumbai', '/tools/colleges?stream=Hospitality&city=Mumbai'),
            lk('Top Hotel Management Colleges in Hyderabad', '/tools/colleges?stream=Hospitality&city=Hyderabad'),
            lk('Top Hotel Management Colleges in Bangalore', '/tools/colleges?stream=Hospitality&city=Bangalore'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('BHM'),
            cs('Diploma in Hotel Management'),
            cs('B.Sc. In Hotel Management'),
            va('All Hospitality Courses →', '/tools/courses'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('IIHM eCHAT'),
            cs('NCHMCT JEE'),
            va('All Hospitality Exams →', '/tools/exams'),
          ],
        },
      ],
    },
    {
      title: 'Animation',
      directLink: '/tools/colleges?search=Animation',
      columns: [
        {
          links: [
            hdr('Top Ranked Colleges'),
            lk('Top Animation Colleges in India', '/tools/colleges?search=Animation'),
            lk('Top Animation Colleges in Bangalore', '/tools/colleges?search=Animation&city=Bangalore'),
            lk('Top Animation Colleges in Delhi', '/tools/colleges?search=Animation&city=Delhi'),
            lk('Top Animation Colleges in Mumbai', '/tools/colleges?search=Animation&city=Mumbai'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Sc. in Animation'),
            cs('M.Sc. in Animation'),
            cs('Diploma in VFX'),
            cs('Diploma in Animation'),
            va('All Animation Courses →', '/tools/courses'),
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
            hdr('Top Ranked Colleges'),
            lk('Top Mass Communication Colleges in India', '/tools/colleges?stream=Media'),
            lk('Top Mass Communication Colleges in Delhi', '/tools/colleges?stream=Media&city=Delhi'),
            lk('Top Mass Communication Colleges in Mumbai', '/tools/colleges?stream=Media&city=Mumbai'),
            lk('Top Mass Communication Colleges in Kolkata', '/tools/colleges?stream=Media&city=Kolkata'),
            lk('Top Mass Communication Colleges in Bangalore', '/tools/colleges?stream=Media&city=Bangalore'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('B.J.'),
            cs('B.J.M.C.'),
            cs('B.M.M.'),
            cs('M.A.'),
            cs('Diploma in Journalism'),
            cs('B.A. in Mass Communication'),
            va('All Mass Communication Courses →', '/tools/courses'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('IIMC Entrance Exam'),
            cs('IPU CET'),
            cs('JNUEE'),
            va('All Mass Communication Exams →', '/tools/exams'),
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
            hdr('Top Ranked Colleges'),
            lk('Top BBA Colleges in India', '/tools/colleges?stream=Management'),
            lk('Top BBA Colleges in Delhi', '/tools/colleges?stream=Management&city=Delhi'),
            lk('Top BBA Colleges in Bangalore', '/tools/colleges?stream=Management&city=Bangalore'),
            lk('Top BBA Colleges in Hyderabad', '/tools/colleges?stream=Management&city=Hyderabad'),
            lk('Top BBA Colleges in Pune', '/tools/colleges?stream=Management&city=Pune'),
            lk('Top BBA Colleges in Mumbai', '/tools/colleges?stream=Management&city=Mumbai'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('BBA'),
            cs('Management Certifications'),
            cs('MBA/PGDM'),
            cs('Executive MBA/PGDM'),
            cs('Distance MBA'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('SET Exam'),
            cs('NPAT'),
            cs('DU JAT'),
            va('All Management Exams →', '/tools/exams'),
          ],
        },
      ],
    },
    {
      title: 'IT & Software',
      directLink: '/tools/colleges?stream=Computer Application',
      columns: [
        {
          links: [
            hdr('Top Ranked Colleges'),
            lk('Top BCA Colleges in India', '/tools/colleges?stream=Computer Application'),
            lk('Top BCA Colleges in Delhi', '/tools/colleges?stream=Computer Application&city=Delhi'),
            lk('Top BCA Colleges in Bangalore', '/tools/colleges?stream=Computer Application&city=Bangalore'),
            lk('Top BCA Colleges in Mumbai', '/tools/colleges?stream=Computer Application&city=Mumbai'),
            lk('Top BCA Colleges in Pune', '/tools/colleges?stream=Computer Application&city=Pune'),
            lk('Top BCA Colleges in Hyderabad', '/tools/colleges?stream=Computer Application&city=Hyderabad'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('BCA'),
            cs('B.Sc. in IT & Software'),
            cs('MCA'),
            cs('M.Sc. in IT & Software'),
            va('All IT & Software Courses →', '/tools/courses'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('NIMCET'),
            cs('MAH MCA CET'),
            cs('WBJEE JECA'),
            va('All IT & Software Exams →', '/tools/exams'),
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
            hdr('Top Ranked Colleges'),
            lk('Top Humanities Colleges in India', '/tools/colleges?stream=Arts'),
            lk('Top Humanities Colleges in Delhi', '/tools/colleges?stream=Arts&city=Delhi'),
            lk('Top Humanities Colleges in Mumbai', '/tools/colleges?stream=Arts&city=Mumbai'),
            lk('Top Humanities Colleges in Kolkata', '/tools/colleges?stream=Arts&city=Kolkata'),
            lk('Top Humanities Colleges in Bangalore', '/tools/colleges?stream=Arts&city=Bangalore'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('B.A.'),
            cs('B.S.W.'),
            cs('M.A.'),
            cs('MSW'),
            va('All Humanities Courses →', '/tools/courses'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('JNUEE'),
            cs('DUET (CUET)'),
            cs('PUBDET'),
            va('All Humanities Exams →', '/tools/exams'),
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
            hdr('Top Ranked Colleges'),
            lk('Top Science Colleges in India', '/tools/colleges?stream=Science'),
            lk('Top Science Colleges in Mumbai', '/tools/colleges?stream=Science&city=Mumbai'),
            lk('Top Science Colleges in Delhi', '/tools/colleges?stream=Science&city=Delhi'),
            lk('Top Science Colleges in Bangalore', '/tools/colleges?stream=Science&city=Bangalore'),
            lk('Top Science Colleges in Pune', '/tools/colleges?stream=Science&city=Pune'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Sc.'),
            cs('M.Sc.'),
            cs('Distance B.Sc.'),
            va('All Science Courses →', '/tools/courses'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('CUET UG'),
            cs('CUET PG'),
            cs('NEST'),
            cs('IIT JAM'),
            va('All Science Exams →', '/tools/exams'),
          ],
        },
      ],
    },
    {
      title: 'Architecture & Planning',
      directLink: '/tools/colleges?stream=Architecture',
      columns: [
        {
          links: [
            hdr('Top Ranked Colleges'),
            lk('Top Architecture Colleges in India', '/tools/colleges?stream=Architecture'),
            lk('Top Architecture Colleges in Bangalore', '/tools/colleges?stream=Architecture&city=Bangalore'),
            lk('Top Architecture Colleges in Mumbai', '/tools/colleges?stream=Architecture&city=Mumbai'),
            lk('Top Architecture Colleges in Delhi', '/tools/colleges?stream=Architecture&city=Delhi'),
            lk('Top Architecture Colleges in Chennai', '/tools/colleges?stream=Architecture&city=Chennai'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Arch.'),
            cs('M.Arch.'),
            cs('B.Plan'),
            cs('M.Plan'),
            va('All Architecture Courses →', '/tools/courses'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('NATA'),
            cs('JEE Main Paper 2'),
            va('All Architecture Exams →', '/tools/exams'),
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
            hdr('Top Ranked Colleges'),
            lk('Top Commerce Colleges in India', '/tools/colleges?stream=Commerce'),
            lk('Top Commerce Colleges in Mumbai', '/tools/colleges?stream=Commerce&city=Mumbai'),
            lk('Top Commerce Colleges in Delhi', '/tools/colleges?stream=Commerce&city=Delhi'),
            lk('Top Commerce Colleges in Pune', '/tools/colleges?stream=Commerce&city=Pune'),
            lk('Top Commerce Colleges in Bangalore', '/tools/colleges?stream=Commerce&city=Bangalore'),
            lk('Top Commerce Colleges in Kolkata', '/tools/colleges?stream=Commerce&city=Kolkata'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Com.'),
            cs('M.Com.'),
            cs('CA'),
            cs('CS'),
            cs('CMA'),
            cs('ACCA'),
            va('All Commerce Courses →', '/tools/courses'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('ICAI'),
            cs('ICSI'),
            cs('CMA Exam'),
            va('All Commerce Exams →', '/tools/exams'),
          ],
        },
      ],
    },
    {
      title: 'Banking, Finance & Insurance',
      directLink: '/tools/exams',
      columns: [
        {
          links: [
            hdr('Popular Exams'),
            cs('IBPS PO'),
            cs('IBPS Clerk'),
            cs('SBI PO'),
            cs('RBI Grade B'),
            va('All Banking Exams →', '/tools/exams'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('CFA'),
            cs('CFP'),
            cs('FRM'),
            cs('Diploma in Banking & Finance'),
            cs('MBA Finance'),
            va('All Finance Courses →', '/tools/courses'),
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
            hdr('Top Ranked Colleges'),
            lk('Top B.Ed. Colleges in India', '/tools/colleges?stream=Education'),
            lk('Top B.Ed. Colleges in Delhi', '/tools/colleges?stream=Education&city=Delhi'),
            lk('Top B.Ed. Colleges in Mumbai', '/tools/colleges?stream=Education&city=Mumbai'),
            lk('Top B.Ed. Colleges in Bangalore', '/tools/colleges?stream=Education&city=Bangalore'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Ed.'),
            cs('B.P.Ed.'),
            cs('M.Ed.'),
            cs('D.El.Ed.'),
            va('All Education Courses →', '/tools/courses'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('CTET'),
            cs('UGC NET'),
            cs('PTET'),
            va('All Education Exams →', '/tools/exams'),
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
            lk('University of Delhi', '/tools/colleges?search=University of Delhi'),
            lk('JNU Delhi', '/tools/colleges?search=JNU'),
            lk('IGNOU Delhi', '/tools/colleges?search=IGNOU'),
            lk('Banaras Hindu University', '/tools/colleges?search=Banaras'),
          ],
        },
        {
          links: [
            hdr('Top State Universities'),
            lk('University of Mumbai', '/tools/colleges?search=Mumbai University'),
            lk('Anna University', '/tools/colleges?search=Anna University'),
            lk('Gujarat University', '/tools/colleges?search=Gujarat University'),
          ],
        },
        {
          links: [
            hdr('Top Ranked Universities'),
            lk('Top Universities in India', '/tools/universities'),
            lk('Top Colleges in India', '/tools/colleges'),
          ],
        },
        {
          links: [
            hdr('Colleges by State'),
            lk('Colleges in Maharashtra', '/tools/colleges?state=Maharashtra'),
            lk('Colleges in Karnataka', '/tools/colleges?state=Karnataka'),
            lk('Colleges in Uttar Pradesh', '/tools/colleges?state=Uttar Pradesh'),
            lk('Colleges in Kerala', '/tools/colleges?state=Kerala'),
            lk('Colleges in Tamil Nadu', '/tools/colleges?state=Tamil Nadu'),
          ],
        },
        {
          links: [
            hdr('Colleges by City'),
            lk('Colleges in Delhi', '/tools/colleges?city=Delhi'),
            lk('Colleges in Bangalore', '/tools/colleges?city=Bangalore'),
            lk('Colleges in Mumbai', '/tools/colleges?city=Mumbai'),
            lk('Colleges in Hyderabad', '/tools/colleges?city=Hyderabad'),
            lk('Colleges in Pune', '/tools/colleges?city=Pune'),
            lk('Colleges in Chennai', '/tools/colleges?city=Chennai'),
          ],
        },
      ],
    },
    {
      title: 'Compare Colleges',
      directLink: '/tools/compare-colleges',
      columns: [],
    },
    {
      title: 'Pharmacy',
      directLink: '/streams/pharmacy',
      columns: [
        {
          links: [
            hdr('Top Ranked Colleges'),
            lk('Top Pharmacy Colleges in India', '/tools/colleges?stream=Pharmacy'),
            lk('Top Pharmacy Colleges in Maharashtra', '/tools/colleges?stream=Pharmacy&state=Maharashtra'),
            lk('Top Pharmacy Colleges in Karnataka', '/tools/colleges?stream=Pharmacy&state=Karnataka'),
            lk('Top Pharmacy Colleges in Gujarat', '/tools/colleges?stream=Pharmacy&state=Gujarat'),
          ],
        },
        {
          links: [
            hdr('Popular Courses'),
            cs('B.Pharm'),
            cs('M.Pharm'),
            cs('Pharm.D'),
            cs('D.Pharm'),
            va('All Pharmacy Courses →', '/tools/courses'),
          ],
        },
        {
          links: [
            hdr('Exams'),
            cs('GPAT'),
            va('All Pharmacy Exams →', '/tools/exams'),
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
            lk('Study in USA', '/tools/study-abroad'),
            lk('Study in UK', '/tools/study-abroad'),
            lk('Study in Canada', '/tools/study-abroad'),
            lk('Study in Australia', '/tools/study-abroad'),
            lk('Study in Germany', '/tools/study-abroad'),
            lk('Study in Ireland', '/tools/study-abroad'),
            lk('Study in France', '/tools/study-abroad'),
            lk('Study in Singapore', '/tools/study-abroad'),
            lk('Study in New Zealand', '/tools/study-abroad'),
            lk('Study in Japan', '/tools/study-abroad'),
            va('View All Countries →', '/tools/study-abroad'),
          ],
        },
        {
          links: [
            hdr('Top Universities'),
            lk('Top Universities Abroad', '/tools/international-colleges'),
            lk('Top Universities in USA', '/tools/international-colleges'),
            lk('Top Universities in UK', '/tools/international-colleges'),
            lk('Top Universities in Canada', '/tools/international-colleges'),
            lk('Top Universities in Australia', '/tools/international-colleges'),
            lk('Top Universities in Germany', '/tools/international-colleges'),
            va('All International Universities →', '/tools/international-colleges'),
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
            cs('Duolingo English Test'),
            hdr('Aptitude Exams'),
            cs('GRE'),
            cs('GMAT'),
            cs('SAT'),
            va('All Study Abroad Exams →', '/tools/exams'),
          ],
        },
      ],
    },
    {
      title: 'Popular Programs',
      columns: [
        {
          links: [
            hdr('Top MS Programs'),
            cs('MS in USA'),
            cs('MS in UK'),
            cs('MS in Canada'),
            cs('MS in Australia'),
            cs('MS in Germany'),
            va('Explore MS Abroad →', '/tools/international-colleges'),
          ],
        },
        {
          links: [
            hdr('Top MBA Programs'),
            cs('MBA in USA'),
            cs('MBA in UK'),
            cs('MBA in Canada'),
            cs('MBA in Australia'),
            va('Explore MBA Abroad →', '/tools/international-colleges'),
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
            cs('Student Visa UK'),
            cs('Student Visa Germany'),
          ],
        },
      ],
    },
    {
      title: 'Scholarships',
      columns: [
        {
          links: [
            cs('Scholarships for Bachelors'),
            cs('Scholarships for Masters'),
            cs('Scholarships for USA'),
            cs('Scholarships for Canada'),
            cs('Scholarships for Australia'),
            cs('Scholarships for UK'),
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
      title: 'AI Career Counseling',
      directLink: '/career-counseling',
      columns: [],
    },
    {
      title: 'Careers after 12th',
      columns: [
        {
          links: [
            hdr('By Stream'),
            lk('Science', '/streams/science'),
            lk('Commerce', '/streams/commerce'),
            lk('Humanities / Arts', '/streams/arts'),
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
            va('AI Career Guidance →', '/career-counseling'),
          ],
        },
      ],
    },
    {
      title: 'Courses after 12th',
      columns: [
        {
          links: [
            lk('After Science Stream', '/streams/science'),
            lk('After Commerce Stream', '/streams/commerce'),
            lk('After Arts Stream', '/streams/arts'),
            va('AI Career Guidance →', '/career-counseling'),
          ],
        },
      ],
    },
    {
      title: 'National Boards',
      columns: [
        {
          links: [
            lk('CBSE', '/boards/cbse'),
            lk('ICSE', '/boards/icse'),
            lk('NIOS', '/boards/nios'),
            va('All Education Boards →', '/coming-soon', true),
          ],
        },
      ],
    },
    {
      title: 'State Boards',
      columns: [
        {
          links: [
            lk('UP Board (UPMSP)', '/boards/upmsp'),
            lk('Bihar Board (BSEB)', '/boards/bseb'),
            lk('Punjab Board (PSEB)', '/boards/pseb'),
            lk('Rajasthan Board (RBSE)', '/boards/rbse'),
          ],
        },
        {
          links: [
            lk('Gujarat Board (GSEB)', '/boards/gseb'),
            lk('HP Board (HPBOSE)', '/boards/hpbose'),
            lk('MP Board (MPBSE)', '/boards/mpbse'),
            lk('Andhra Board (BIEAP)', '/boards/bieap'),
          ],
        },
        {
          links: [
            lk('Haryana Board (BSEH)', '/boards/bseh'),
            lk('CG Board (CGBSE)', '/boards/cgbse'),
            lk('WB Board (WBBSE)', '/boards/wbbse'),
            va('All State Boards →', '/coming-soon', true),
          ],
        },
      ],
    },
    {
      title: 'Get Free Counselling',
      directLink: '/career-counseling',
      columns: [],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  8. ONLINE COURSES
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
            cs('Cloud Computing'),
            cs('Cybersecurity'),
            cs('Data Science'),
            cs('Machine Learning'),
            cs('Web Development'),
            cs('Programming'),
            va('All Tech Courses →', '/tools/courses'),
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
            cs('Deep Learning'),
            cs('Machine Learning'),
            va('All Data Science Courses →', '/tools/courses'),
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
            cs('Entrepreneurship'),
            cs('Marketing'),
            cs('Product Management'),
            va('All Management Courses →', '/tools/courses'),
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
            cs('Insurance'),
            va('All Finance Courses →', '/tools/courses'),
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
            va('All Healthcare Courses →', '/tools/courses'),
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
            cs('Languages'),
            va('All Courses →', '/tools/courses'),
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════
//  EXPORT
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
