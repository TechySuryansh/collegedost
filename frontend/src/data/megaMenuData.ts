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
  directLink?: string;
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
  directLink: '/career-counseling',
  subcategories: [],
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
  // studyAbroadMenu,
  counselingMenu,
  // onlineCoursesMenu,
];
