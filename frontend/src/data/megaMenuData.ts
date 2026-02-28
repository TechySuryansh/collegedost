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
            { label: 'Top MBA Colleges in India', href: '/tools/colleges?stream=Management' },
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
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            { label: 'MBA Colleges in India', href: '/tools/colleges?stream=Management' },
            { label: 'MBA Colleges in Bangalore', href: '/tools/colleges?stream=Management&city=Bangalore' },
            { label: 'MBA Colleges in Chennai', href: '/tools/colleges?stream=Management&city=Chennai' },
            { label: 'MBA Colleges in Delhi-NCR', href: '/tools/colleges?stream=Management&city=Delhi' },
            { label: 'MBA Colleges in Hyderabad', href: '/tools/colleges?stream=Management&city=Hyderabad' },
            { label: 'MBA Colleges in Kolkata', href: '/tools/colleges?stream=Management&city=Kolkata' },
            { label: 'MBA Colleges in Mumbai', href: '/tools/colleges?stream=Management&city=Mumbai' },
            { label: 'MBA Colleges in Pune', href: '/tools/colleges?stream=Management&city=Pune' },
            { label: 'All Locations →', href: '/tools/colleges?stream=Management', isViewAll: true },
          ],
        },
      ],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            { label: 'CAT College Predictor', href: '/predictors/cat-predictor' },
            viewAll('MBA College Predictor →', '/predictors', false),
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
            { label: 'Top Engineering Colleges in India', href: '/tools/colleges?stream=Engineering' },
            { label: 'Top Private Engineering Colleges', href: '/tools/colleges?stream=Engineering&ownership=Private' },
            { label: 'Top IITs in India', href: '/tools/colleges?search=Indian+Institute+of+Technology' },
            { label: 'Top NITs in India', href: '/tools/colleges?search=National+Institute+of+Technology' },
            { label: 'Top Engineering Colleges in Bangalore', href: '/tools/colleges?search=Engineering&city=Bangalore' },
            { label: 'Top Engineering Colleges in Hyderabad', href: '/tools/colleges?search=Engineering&city=Hyderabad' },
            { label: 'Top Engineering Colleges in Pune', href: '/tools/colleges?search=Engineering&city=Pune' },
            { label: 'Top Engineering Colleges in Mumbai', href: '/tools/colleges?search=Engineering&city=Mumbai' },
            { label: 'Top Engineering Colleges in Chennai', href: '/tools/colleges?search=Engineering&city=Chennai' },
            { label: 'Top Engineering Colleges in Delhi', href: '/tools/colleges?search=Engineering&city=Delhi' },
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            { label: 'Engineering Colleges in India', href: '/tools/colleges?stream=Engineering' },
            { label: 'Engineering Colleges in Bangalore', href: '/tools/colleges?stream=Engineering&city=Bangalore' },
            { label: 'Engineering Colleges in Chennai', href: '/tools/colleges?stream=Engineering&city=Chennai' },
            { label: 'Engineering Colleges in Delhi-NCR', href: '/tools/colleges?stream=Engineering&city=Delhi' },
            { label: 'Engineering Colleges in Kolkata', href: '/tools/colleges?stream=Engineering&city=Kolkata' },
            { label: 'Engineering Colleges in Mumbai', href: '/tools/colleges?stream=Engineering&city=Mumbai' },
            { label: 'Engineering Colleges in Pune', href: '/tools/colleges?stream=Engineering&city=Pune' },
            { label: 'Engineering Colleges in Hyderabad', href: '/tools/colleges?stream=Engineering&city=Hyderabad' },
            { label: 'All Locations →', href: '/tools/colleges?stream=Engineering', isViewAll: true },
          ],
        },
      ],
    },
    {
      title: 'Rank Predictors',
      columns: [
        {
          links: [
            { label: 'JEE Advanced Rank Predictor', href: '/predictors/rank-predictor' },
            { label: 'JEE MAIN Rank Predictor', href: '/predictors/rank-predictor' },
          ],
        },
      ],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            { label: 'JEE MAIN College Predictor', href: '/predictors/jee-main-predictor' },
            { label: 'JEE Advanced College Predictor', href: '/predictors/predict-colleges' },
            { label: 'GATE College Predictor', href: '/predictors/gate-predictor' },
            { label: 'BITSAT College Predictor', href: '/predictors/bitsat-predictor' },
            { label: 'VITEEE College Predictor', href: '/predictors/viteee-predictor' },
            viewAll('Engineering College Predictor →', '/predictors', false),
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
            { label: 'Top Medical Colleges in India', href: '/tools/colleges?stream=Medicine' },
            { label: 'Top Pharmacy Colleges in India', href: '/streams/pharmacy' },
            { label: 'Top Medical Colleges in Karnataka', href: '/tools/colleges?search=Medical&state=Karnataka' },
            { label: 'Top Medical Colleges in Bangalore', href: '/tools/colleges?search=Medical&city=Bangalore' },
            { label: 'Top Dental Colleges in India', href: '/tools/colleges?search=Dental' },
            { label: 'Top Medical Colleges in Maharashtra', href: '/tools/colleges?search=Medical&state=Maharashtra' },
            { label: 'Top Medical Colleges in Mumbai', href: '/tools/colleges?search=Medical&city=Mumbai' },
            { label: 'Top Medical Colleges in Delhi', href: '/tools/colleges?search=Medical&city=Delhi' },
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            { label: 'Medical Colleges in India', href: '/tools/colleges?stream=Medicine' },
            { label: 'Medical Colleges in Delhi', href: '/tools/colleges?stream=Medicine&city=Delhi' },
            { label: 'Medical Colleges in Bangalore', href: '/tools/colleges?stream=Medicine&city=Bangalore' },
            { label: 'Medical Colleges in Chennai', href: '/tools/colleges?stream=Medicine&city=Chennai' },
            { label: 'Medical Colleges in Hyderabad', href: '/tools/colleges?stream=Medicine&city=Hyderabad' },
            { label: 'Medical Colleges in Mumbai', href: '/tools/colleges?stream=Medicine&city=Mumbai' },
            { label: 'Medical Colleges in Kolkata', href: '/tools/colleges?stream=Medicine&city=Kolkata' },
            { label: 'Medical Colleges in Pune', href: '/tools/colleges?stream=Medicine&city=Pune' },
          ],
        },
      ],
    },
    {
      title: 'College Predictors',
      columns: [
        {
          links: [
            { label: 'NEET College Predictor', href: '/predictors/neet-predictor' },
            { label: 'AIIMS INI-CET Predictor', href: '/predictors/aiims-predictor' },
            viewAll('Medicine College Predictor →', '/predictors', false),
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
            { label: 'Top Design Colleges in India', href: '/tools/colleges?stream=Design' },
            { label: 'Top Design Colleges in Bangalore', href: '/tools/colleges?search=Design&city=Bangalore' },
            { label: 'Top Design Colleges in Delhi/NCR', href: '/tools/colleges?search=Design&city=Delhi' },
          ],
        },
      ],
    },
    {
      title: 'Colleges by Location',
      columns: [
        {
          links: [
            { label: 'Design Colleges in India', href: '/tools/colleges?stream=Design' },
            { label: 'Design Colleges in Maharashtra', href: '/tools/colleges?stream=Design&state=Maharashtra' },
            { label: 'Design Colleges in Delhi', href: '/tools/colleges?stream=Design&city=Delhi' },
            { label: 'Design Colleges in Karnataka', href: '/tools/colleges?stream=Design&state=Karnataka' },
            { label: 'Design Colleges in Pune', href: '/tools/colleges?stream=Design&city=Pune' },
            { label: 'Design Colleges in Mumbai', href: '/tools/colleges?stream=Design&city=Mumbai' },
            { label: 'Design Colleges in Bangalore', href: '/tools/colleges?stream=Design&city=Bangalore' },
            { label: 'Design Colleges in Hyderabad', href: '/tools/colleges?stream=Design&city=Hyderabad' },
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
      title: 'Law',
      directLink: '/streams/law',
      columns: [
        {
          links: [
            { label: 'Top Law Colleges in India', href: '/tools/colleges?stream=Law' },
            { label: 'Top Law Colleges in Bangalore', href: '/tools/colleges?stream=Law&city=Bangalore' },
            { label: 'Top Law Colleges in Delhi', href: '/tools/colleges?stream=Law&city=Delhi' },
            { label: 'Top Law Colleges in Pune', href: '/tools/colleges?stream=Law&city=Pune' },
            { label: 'Top Law Colleges in Hyderabad', href: '/tools/colleges?stream=Law&city=Hyderabad' },
          ],
        },
        {
          links: [
            hdr('Predictors'),
            { label: 'CLAT College Predictor', href: '/predictors/clat-predictor' },
            { label: 'CLAT Rank Predictor', href: '/predictors/rank-predictor?exam=CLAT' },
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
            { label: 'Top Hotel Management Colleges', href: '/tools/colleges?stream=Hospitality' },
            { label: 'Colleges in Hyderabad', href: '/tools/colleges?stream=Hospitality&city=Hyderabad' },
            { label: 'Colleges in Delhi', href: '/tools/colleges?stream=Hospitality&city=Delhi' },
            { label: 'Colleges in Mumbai', href: '/tools/colleges?stream=Hospitality&city=Mumbai' },
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
            { label: 'Top Media Colleges in India', href: '/tools/colleges?stream=Media' },
            { label: 'Media Colleges in Delhi', href: '/tools/colleges?stream=Media&city=Delhi' },
            { label: 'Media Colleges in Mumbai', href: '/tools/colleges?stream=Media&city=Mumbai' },
            { label: 'Media Colleges in Bangalore', href: '/tools/colleges?stream=Media&city=Bangalore' },
          ],
        },
      ],
    },
    {
      title: 'Business & Management',
      directLink: '/streams/management',
      columns: [
        {
          links: [
            { label: 'Top BBA Colleges in India', href: '/tools/colleges?stream=Management&search=BBA' },
            { label: 'BBA Colleges in Delhi', href: '/tools/colleges?stream=Management&search=BBA&city=Delhi' },
            { label: 'BBA Colleges in Bangalore', href: '/tools/colleges?stream=Management&search=BBA&city=Bangalore' },
            { label: 'BBA Colleges in Pune', href: '/tools/colleges?stream=Management&search=BBA&city=Pune' },
          ],
        },
      ],
    },
    {
      title: 'IT & Software',
      directLink: '/tools/colleges?stream=Computer+Application',
      columns: [
        {
          links: [
            { label: 'Top BCA Colleges in India', href: '/tools/colleges?stream=Computer+Application' },
            { label: 'BCA Colleges in Delhi', href: '/tools/colleges?stream=Computer+Application&city=Delhi' },
            { label: 'BCA Colleges in Bangalore', href: '/tools/colleges?stream=Computer+Application&city=Bangalore' },
            { label: 'BCA Colleges in Mumbai', href: '/tools/colleges?stream=Computer+Application&city=Mumbai' },
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
            { label: 'Top Science Colleges', href: '/tools/colleges?stream=Science' },
            { label: 'Science Colleges in Mumbai', href: '/tools/colleges?stream=Science&city=Mumbai' },
            { label: 'Science Colleges in Pune', href: '/tools/colleges?stream=Science&city=Pune' },
          ],
        },
      ],
    },
    {
      title: 'Architecture',
      directLink: '/tools/colleges?stream=Architecture',
      columns: [
        {
          links: [
            { label: 'Top Architecture Colleges', href: '/tools/colleges?stream=Architecture' },
            { label: 'Architecture Colleges in Bangalore', href: '/tools/colleges?stream=Architecture&city=Bangalore' },
            { label: 'Architecture Colleges in Mumbai', href: '/tools/colleges?stream=Architecture&city=Mumbai' },
            { label: 'Architecture Colleges in Delhi', href: '/tools/colleges?stream=Architecture&city=Delhi' },
          ],
        },
      ],
    },
    {
      title: 'Commerce',
      directLink: '/streams/commerce',
      columns: [
        {
          links: [
            { label: 'Top Commerce Colleges', href: '/tools/colleges?stream=Commerce' },
            { label: 'Commerce Colleges in Mumbai', href: '/tools/colleges?stream=Commerce&city=Mumbai' },
            { label: 'Commerce Colleges in Delhi', href: '/tools/colleges?stream=Commerce&city=Delhi' },
            { label: 'Commerce Colleges in Pune', href: '/tools/colleges?stream=Commerce&city=Pune' },
          ],
        },
      ],
    },
    {
      title: 'Education',
      directLink: '/streams/education',
      columns: [],
    },
    {
      title: 'Pharmacy',
      directLink: '/streams/pharmacy',
      columns: [],
    },
    {
      title: 'Browse All Colleges',
      directLink: '/tools/colleges',
      columns: [
        {
          links: [
            { label: 'Colleges in Delhi', href: '/tools/colleges?city=Delhi' },
            { label: 'Colleges in Bangalore', href: '/tools/colleges?city=Bangalore' },
            { label: 'Colleges in Chennai', href: '/tools/colleges?city=Chennai' },
            { label: 'Colleges in Pune', href: '/tools/colleges?city=Pune' },
            { label: 'Colleges in Mumbai', href: '/tools/colleges?city=Mumbai' },
            { label: 'Colleges in Hyderabad', href: '/tools/colleges?city=Hyderabad' },
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
            { label: 'USA', href: '/tools/study-abroad' },
            { label: 'UK', href: '/tools/study-abroad' },
            { label: 'Canada', href: '/tools/study-abroad' },
            { label: 'Australia', href: '/tools/study-abroad' },
            { label: 'Germany', href: '/tools/study-abroad' },
            { label: 'Ireland', href: '/tools/study-abroad' },
            { label: 'France', href: '/tools/study-abroad' },
            { label: 'Singapore', href: '/tools/study-abroad' },
            { label: 'New Zealand', href: '/tools/study-abroad' },
            { label: 'Japan', href: '/tools/study-abroad' },
            viewAll('View All Countries →', '/tools/study-abroad', false),
          ],
        },
        {
          links: [
            hdr('International Colleges'),
            { label: 'Browse International Colleges', href: '/tools/international-colleges' },
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
      title: 'Career Guidance',
      directLink: '/coming-soon',
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
      title: 'Coming Soon',
      directLink: '/coming-soon',
      columns: [],
    },
  ],
};

// ──────────────────────────────────────────────────────────
// Mega Menu Data — extracted from reference navigation HTML
// ──────────────────────────────────────────────────────────

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
