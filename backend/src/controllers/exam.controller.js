const Exam = require('../models/Exam.model');
const Parser = require('rss-parser');
const parser = new Parser();

// @desc    Get all exams
// @route   GET /api/exams
// @access  Public
exports.getExams = async (req, res) => {
    try {
        const { level, authority } = req.query;
        let query = {};

        if (level) query.examLevel = level;
        if (authority) query.conductingAuthority = { $regex: authority, $options: 'i' };

        const exams = await Exam.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: exams.length,
            data: exams
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single exam by slug
// @route   GET /api/exams/:slug
// @access  Public
exports.getExamBySlug = async (req, res) => {
    try {
        const exam = await Exam.findOne({ examSlug: req.params.slug });

        if (!exam) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private (Admin)
exports.createExam = async (req, res) => {
    try {
        // Basic user role check can be added here if req.user is available
        // if (req.user.role !== 'admin') ...

        const exam = await Exam.create(req.body);

        res.status(201).json({
            success: true,
            data: exam
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Exam already exists' });
        }
        res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
    }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private (Admin)
exports.deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }

        await exam.deleteOne();

        res.status(200).json({ success: true, message: 'Exam removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Refresh Exam News from RSS
// @route   POST /api/exams/:id/refresh-news
// @access  Private (Admin)
exports.refreshExamNews = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }

        if (!exam.rssFeedUrl) {
            return res.status(400).json({ success: false, message: 'No RSS Feed URL configured for this exam' });
        }

        try {
            const feed = await parser.parseURL(exam.rssFeedUrl);
            
            // Map items to schema
            // We take top 10 items
            const newsItems = feed.items.slice(0, 10).map(item => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate, // RSS parser often handles date parsing
                contentSnippet: item.contentSnippet || item.content,
                guid: item.guid || item.link
            }));

            // Merge or Replace? Let's Replace for now to keep it fresh and simple, 
            // or prepend new ones. Replacing is safer to avoid duplicates without complex check.
            exam.news = newsItems;
            
            await exam.save();

            res.status(200).json({
                success: true,
                message: `Successfully fetched ${newsItems.length} news items`,
                data: exam.news
            });
        } catch (rssError) {
            console.error("RSS Parsing Error:", rssError);
            return res.status(500).json({ success: false, message: 'Failed to parse RSS feed', error: rssError.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const axios = require('axios');
const cheerio = require('cheerio');
const slugify = require('slugify');

const POPULAR_EXAMS = [
    // --- Engineering / Popular ---
    { name: 'JEE Main', authority: 'NTA', level: 'National', website: 'https://jeemain.nta.ac.in/', rss: 'https://news.google.com/rss/search?q=JEE+Main+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'JEE Advanced', authority: 'IITs', level: 'National', website: 'https://jeeadv.ac.in/', rss: 'https://news.google.com/rss/search?q=JEE+Advanced+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NEET UG', authority: 'NTA', level: 'National', website: 'https://neet.nta.nic.in/', rss: 'https://news.google.com/rss/search?q=NEET+UG+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'BITSAT', authority: 'BITS Pilani', level: 'National', website: 'https://www.bitsadmission.com/', rss: 'https://news.google.com/rss/search?q=BITSAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'VITEEE', authority: 'VIT', level: 'University', website: 'https://viteee.vit.ac.in/', rss: 'https://news.google.com/rss/search?q=VITEEE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NIFT', authority: 'NTA', level: 'National', website: 'https://nift.nta.ac.in/', rss: 'https://news.google.com/rss/search?q=NIFT+Entrance+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CLAT', authority: 'Consortium of NLUs', level: 'National', website: 'https://consortiumofnlus.ac.in/', rss: 'https://news.google.com/rss/search?q=CLAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UPSC CSE', authority: 'UPSC', level: 'National', website: 'https://upsc.gov.in/', rss: 'https://news.google.com/rss/search?q=UPSC+Civil+Services+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'GATE', authority: 'IITs', level: 'National', website: 'https://gate.iitk.ac.in/', rss: 'https://news.google.com/rss/search?q=GATE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UPESEAT', authority: 'UPES', level: 'University', website: 'https://www.upes.ac.in/', rss: 'https://news.google.com/rss/search?q=UPESEAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'AEEE', authority: 'Amrita Vishwa Vidyapeetham', level: 'University', website: 'https://www.amrita.edu/', rss: 'https://news.google.com/rss/search?q=AEEE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- MBA National ---
    { name: 'CAT', authority: 'IIMs', level: 'National', website: 'https://iimcat.ac.in/', rss: 'https://news.google.com/rss/search?q=CAT+Exam+IIM&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'XAT', authority: 'XLRI', level: 'National', website: 'https://xatonline.in/', rss: 'https://news.google.com/rss/search?q=XAT+Exam+XLRI&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CMAT', authority: 'NTA', level: 'National', website: 'https://cmat.nta.nic.in/', rss: 'https://news.google.com/rss/search?q=CMAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NMAT by GMAC', authority: 'GMAC', level: 'National', website: 'https://www.nmat.org/', rss: 'https://news.google.com/rss/search?q=NMAT+by+GMAC+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'SNAP', authority: 'Symbiosis International', level: 'National', website: 'https://www.snaptest.org/', rss: 'https://news.google.com/rss/search?q=SNAP+Test+Symbiosis&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'MAT', authority: 'AIMA', level: 'National', website: 'https://mat.aima.in/', rss: 'https://news.google.com/rss/search?q=MAT+Exam+AIMA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'ATMA', authority: 'AIMS', level: 'National', website: 'https://www.atmaaims.com/', rss: 'https://news.google.com/rss/search?q=ATMA+Exam+AIMS&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'GMAT', authority: 'GMAC', level: 'International', website: 'https://www.mba.com/', rss: 'https://news.google.com/rss/search?q=GMAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'IBSAT', authority: 'ICFAI', level: 'University', website: 'https://ibsindia.org/', rss: 'https://news.google.com/rss/search?q=IBSAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'MICAT', authority: 'MICA', level: 'University', website: 'https://www.mica.ac.in/', rss: 'https://news.google.com/rss/search?q=MICAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CUET-PG (MBA)', authority: 'NTA', level: 'National', website: 'https://pgcuet.samarth.ac.in/', rss: 'https://news.google.com/rss/search?q=CUET+PG+MBA&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- MBA University / Institute ---
    { name: 'IIFT Entrance Exam', authority: 'NTA/IIFT', level: 'National', website: 'https://www.iift.ac.in/', rss: 'https://news.google.com/rss/search?q=IIFT+Entrance+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'TISSNET', authority: 'TISS', level: 'National', website: 'https://tiss.edu/', rss: 'https://news.google.com/rss/search?q=TISSNET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NMIMS NPAT', authority: 'NMIMS', level: 'University', website: 'https://npat.in/', rss: 'https://news.google.com/rss/search?q=NMIMS+NPAT&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'XGMT', authority: 'XIM University', level: 'University', website: 'https://xim.edu.in/', rss: 'https://news.google.com/rss/search?q=XGMT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'SPJIMR Profile-based', authority: 'SPJIMR', level: 'Institute', website: 'https://www.spjimr.org/', rss: 'https://news.google.com/rss/search?q=SPJIMR+Admission&hl=en-IN&gl=IN&ceid=IN:en' },
    
    // --- MBA State Level ---
    { name: 'MAH MBA CET', authority: 'State CET Cell, Maharashtra', level: 'State', website: 'https://cetcell.mahacet.org/', rss: 'https://news.google.com/rss/search?q=MAH+MBA+CET&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'MHT CET', authority: 'State Common Entrance Test Cell, Maharashtra', level: 'State', website: 'https://cetcell.mahacet.org/', rss: 'https://news.google.com/rss/search?q=MHT+CET+Exam&hl=en-IN&gl=IN&ceid=IN:en' }, // Kept compatible
    { name: 'KMAT Karnataka', authority: 'KPPGCA', level: 'State', website: 'http://kmatindia.com/', rss: 'https://news.google.com/rss/search?q=KMAT+Karnataka&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'KMAT Kerala', authority: 'CEE Kerala', level: 'State', website: 'https://kmatkerala.in/', rss: 'https://news.google.com/rss/search?q=KMAT+Kerala&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'TS ICET', authority: 'TSCHE', level: 'State', website: 'https://icet.tsche.ac.in/', rss: 'https://news.google.com/rss/search?q=TS+ICET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'AP ICET', authority: 'APSCHE', level: 'State', website: 'https://apicet.apsche.ap.gov.in/', rss: 'https://news.google.com/rss/search?q=AP+ICET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'TANCET (MBA)', authority: 'Anna University', level: 'State', website: 'https://tancet.annauniv.edu/', rss: 'https://news.google.com/rss/search?q=TANCET+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'HPCET (MBA)', authority: 'HPTU', level: 'State', website: 'https://www.himtu.ac.in/', rss: 'https://news.google.com/rss/search?q=HPCET+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'OJEE (MBA)', authority: 'OJEE Board', level: 'State', website: 'https://ojee.nic.in/', rss: 'https://news.google.com/rss/search?q=OJEE+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'RMAT Rajasthan', authority: 'RTU', level: 'State', website: 'https://rmat.rajasthan.gov.in/', rss: 'https://news.google.com/rss/search?q=RMAT+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'JKBOPEE MBA', authority: 'JKBOPEE', level: 'State', website: 'https://www.jkbopee.gov.in/', rss: 'https://news.google.com/rss/search?q=JKBOPEE+MBA&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Private / Other ---
    { name: 'AMU MBA Entrance', authority: 'AMU', level: 'University', website: 'https://www.amucontrollerexams.com/', rss: 'https://news.google.com/rss/search?q=AMU+MBA+Entrance&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'BHU MBA Entrance', authority: 'BHU', level: 'University', website: 'https://bhu.ac.in/', rss: 'https://news.google.com/rss/search?q=BHU+MBA+Admission&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'LPU NEST (MBA)', authority: 'LPU', level: 'University', website: 'https://nest.lpu.in/', rss: 'https://news.google.com/rss/search?q=LPU+NEST+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'KIITEE Management', authority: 'KIIT', level: 'University', website: 'https://ksom.ac.in/', rss: 'https://news.google.com/rss/search?q=KIITEE+Management&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UPESMET', authority: 'UPES', level: 'University', website: 'https://www.upes.ac.in/', rss: 'https://news.google.com/rss/search?q=UPESMET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'Christ University MBA', authority: 'Christ University', level: 'University', website: 'https://christuniversity.in/', rss: 'https://news.google.com/rss/search?q=Christ+University+MBA+Entrance&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- UG Medical & Allied ---
    // NEET UG is already top of list
    { name: 'AIIMS BSc Nursing', authority: 'AIIMS', level: 'National', website: 'https://www.aiimsexams.ac.in/', rss: 'https://news.google.com/rss/search?q=AIIMS+BSc+Nursing+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'JIPMER Nursing', authority: 'JIPMER', level: 'Institute', website: 'https://jipmer.edu.in/', rss: 'https://news.google.com/rss/search?q=JIPMER+Nursing+Admission&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'Indian Army BSc Nursing', authority: 'Join Indian Army', level: 'National', website: 'https://joinindianarmy.nic.in/', rss: 'https://news.google.com/rss/search?q=Indian+Army+BSc+Nursing+MNS&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'IPU CET (Medical)', authority: 'GGSIPU', level: 'University', website: 'http://www.ipu.ac.in/', rss: 'https://news.google.com/rss/search?q=IPU+CET+BSc+Nursing+Paramedical&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'RUHS Nursing', authority: 'RUHS', level: 'State', website: 'https://ruhsraj.org/', rss: 'https://news.google.com/rss/search?q=RUHS+Nursing+Entrance&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- PG Medical ---
    { name: 'NEET PG', authority: 'NBEMS', level: 'National', website: 'https://nbe.edu.in/', rss: 'https://news.google.com/rss/search?q=NEET+PG+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'INI CET', authority: 'AIIMS', level: 'National', website: 'https://www.aiimsexams.ac.in/', rss: 'https://news.google.com/rss/search?q=INI+CET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'AIAPGET', authority: 'NTA', level: 'National', website: 'https://aiapget.nta.nic.in/', rss: 'https://news.google.com/rss/search?q=AIAPGET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NEET MDS', authority: 'NBEMS', level: 'National', website: 'https://nbe.edu.in/', rss: 'https://news.google.com/rss/search?q=NEET+MDS+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'GPAT', authority: 'NBEMS', level: 'National', website: 'https://natboard.edu.in/', rss: 'https://news.google.com/rss/search?q=GPAT+Pharmacy+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Super Speciality & Foreign ---
    { name: 'NEET SS', authority: 'NBEMS', level: 'National', website: 'https://nbe.edu.in/', rss: 'https://news.google.com/rss/search?q=NEET+SS+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'INI SS', authority: 'AIIMS', level: 'National', website: 'https://www.aiimsexams.ac.in/', rss: 'https://news.google.com/rss/search?q=INI+SS+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'FMGE', authority: 'NBEMS', level: 'International', website: 'https://nbe.edu.in/', rss: 'https://news.google.com/rss/search?q=FMGE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NExT', authority: 'NMC', level: 'National', website: 'https://www.nmc.org.in/', rss: 'https://news.google.com/rss/search?q=National+Exit+Test+Medical+NExT&hl=en-IN&gl=IN&ceid=IN:en' }
];

const scrapeMetaDescription = async (url) => {
    try {
        const { data } = await axios.get(url, {
             headers: { 'User-Agent': 'Mozilla/5.0' },
             timeout: 5000,
             httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        const $ = cheerio.load(data);
        const metaDesc = $('meta[name="description"]').attr('content') || '';
        return metaDesc.substring(0, 490);
    } catch (e) {
        console.log(`Desc fetch failed for ${url}`);
        return '';
    }
};

// @desc    Auto Ingest/Seed Popular Exams
// @route   POST /api/exams/ingest
// @access  Public (protected by secret in future ideally)
exports.autoIngestExams = async (req, res) => {
    try {
        const results = [];
        for (const examData of POPULAR_EXAMS) {
            // 1. Fetch News
            let newsItems = [];
            try {
                const feed = await parser.parseURL(examData.rss);
                newsItems = feed.items.slice(0, 10).map(item => ({
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    contentSnippet: item.contentSnippet || item.content
                }));
            } catch (err) { console.error(`RSS fail ${examData.name}`); }

            // 2. Scrape Desc
            const scrapedDesc = await scrapeMetaDescription(examData.website);
            const description = scrapedDesc || `Official entrance exam conducted by ${examData.authority}.`;


            // 3. Upsert
            const slug = slugify(examData.name, { lower: true });
            
            const exam = await Exam.findOneAndUpdate(
                { examName: examData.name },
                {
                    examName: examData.name,
                    examSlug: slug,
                    conductingAuthority: examData.authority,
                    examLevel: examData.level,
                    registrationLink: examData.website,
                    rssFeedUrl: examData.rss,
                    description: description,
                    news: newsItems,
                    logoUrl: `https://ui-avatars.com/api/?name=${slugify(examData.name, {replacement:'+'})}&background=random&size=200`
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            results.push(exam.examName);
        }

        res.status(200).json({ success: true, message: 'Ingestion Complete', ingested: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Ingestion Failed', error: error.message });
    }
};
