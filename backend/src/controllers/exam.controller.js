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

        // Logic to support Category filtering via 'level' param (backward compatible)
        const knownCategories = ['Engineering', 'Medical', 'Management', 'Law', 'Pharmacy', 'Finance', 'Computer Application and IT', 'Media', 'Hospitality and Tourism', 'Competition', 'School', 'Study Abroad', 'Arts, Commerce & Sciences'];

        if (level) {
            if (knownCategories.includes(level)) {
                query.category = level;
            } else {
                query.examLevel = level;
            }
        }
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
    { name: 'JEE Main', authority: 'NTA', level: 'National', category: 'Engineering', website: 'https://jeemain.nta.ac.in/', rss: 'https://news.google.com/rss/search?q=JEE+Main+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'JEE Advanced', authority: 'IITs', level: 'National', category: 'Engineering', website: 'https://jeeadv.ac.in/', rss: 'https://news.google.com/rss/search?q=JEE+Advanced+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NEET UG', authority: 'NTA', level: 'National', category: 'Medical', website: 'https://neet.nta.nic.in/', rss: 'https://news.google.com/rss/search?q=NEET+UG+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'BITSAT', authority: 'BITS Pilani', level: 'National', category: 'Engineering', website: 'https://www.bitsadmission.com/', rss: 'https://news.google.com/rss/search?q=BITSAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'VITEEE', authority: 'VIT', level: 'University', category: 'Engineering', website: 'https://viteee.vit.ac.in/', rss: 'https://news.google.com/rss/search?q=VITEEE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NIFT', authority: 'NTA', level: 'National', category: 'Design', website: 'https://nift.nta.ac.in/', rss: 'https://news.google.com/rss/search?q=NIFT+Entrance+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CLAT', authority: 'Consortium of NLUs', level: 'National', category: 'Law', website: 'https://consortiumofnlus.ac.in/', rss: 'https://news.google.com/rss/search?q=CLAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UPSC CSE', authority: 'UPSC', level: 'National', category: 'Competition', website: 'https://upsc.gov.in/', rss: 'https://news.google.com/rss/search?q=UPSC+Civil+Services+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'GATE', authority: 'IITs', level: 'National', category: 'Engineering', website: 'https://gate.iitk.ac.in/', rss: 'https://news.google.com/rss/search?q=GATE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UPESEAT', authority: 'UPES', level: 'University', category: 'Engineering', website: 'https://www.upes.ac.in/', rss: 'https://news.google.com/rss/search?q=UPESEAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'AEEE', authority: 'Amrita Vishwa Vidyapeetham', level: 'University', category: 'Engineering', website: 'https://www.amrita.edu/', rss: 'https://news.google.com/rss/search?q=AEEE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- MBA National ---
    { name: 'CAT', authority: 'IIMs', level: 'National', category: 'Management', website: 'https://iimcat.ac.in/', rss: 'https://news.google.com/rss/search?q=CAT+Exam+IIM&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'XAT', authority: 'XLRI', level: 'National', category: 'Management', website: 'https://xatonline.in/', rss: 'https://news.google.com/rss/search?q=XAT+Exam+XLRI&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CMAT', authority: 'NTA', level: 'National', category: 'Management', website: 'https://cmat.nta.nic.in/', rss: 'https://news.google.com/rss/search?q=CMAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NMAT by GMAC', authority: 'GMAC', level: 'National', category: 'Management', website: 'https://www.nmat.org/', rss: 'https://news.google.com/rss/search?q=NMAT+by+GMAC+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'SNAP', authority: 'Symbiosis International', level: 'National', category: 'Management', website: 'https://www.snaptest.org/', rss: 'https://news.google.com/rss/search?q=SNAP+Test+Symbiosis&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'MAT', authority: 'AIMA', level: 'National', category: 'Management', website: 'https://mat.aima.in/', rss: 'https://news.google.com/rss/search?q=MAT+Exam+AIMA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'ATMA', authority: 'AIMS', level: 'National', category: 'Management', website: 'https://www.atmaaims.com/', rss: 'https://news.google.com/rss/search?q=ATMA+Exam+AIMS&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'GMAT', authority: 'GMAC', level: 'International', category: 'Management', website: 'https://www.mba.com/', rss: 'https://news.google.com/rss/search?q=GMAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'IBSAT', authority: 'ICFAI', level: 'University', category: 'Management', website: 'https://ibsindia.org/', rss: 'https://news.google.com/rss/search?q=IBSAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'MICAT', authority: 'MICA', level: 'University', category: 'Management', website: 'https://www.mica.ac.in/', rss: 'https://news.google.com/rss/search?q=MICAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CUET-PG (MBA)', authority: 'NTA', level: 'National', category: 'Management', website: 'https://pgcuet.samarth.ac.in/', rss: 'https://news.google.com/rss/search?q=CUET+PG+MBA&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- MBA University / Institute ---
    { name: 'IIFT Entrance Exam', authority: 'NTA/IIFT', level: 'National', category: 'Management', website: 'https://www.iift.ac.in/', rss: 'https://news.google.com/rss/search?q=IIFT+Entrance+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'TISSNET', authority: 'TISS', level: 'National', category: 'Management', website: 'https://tiss.edu/', rss: 'https://news.google.com/rss/search?q=TISSNET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NMIMS NPAT', authority: 'NMIMS', level: 'University', category: 'Management', website: 'https://npat.in/', rss: 'https://news.google.com/rss/search?q=NMIMS+NPAT&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'XGMT', authority: 'XIM University', level: 'University', category: 'Management', website: 'https://xim.edu.in/', rss: 'https://news.google.com/rss/search?q=XGMT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'SPJIMR Profile-based', authority: 'SPJIMR', level: 'Institute', category: 'Management', website: 'https://www.spjimr.org/', rss: 'https://news.google.com/rss/search?q=SPJIMR+Admission&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- MBA State Level ---
    { name: 'MAH MBA CET', authority: 'State CET Cell, Maharashtra', level: 'State', category: 'Management', website: 'https://cetcell.mahacet.org/', rss: 'https://news.google.com/rss/search?q=MAH+MBA+CET&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'MHT CET', authority: 'State Common Entrance Test Cell, Maharashtra', level: 'State', category: 'Engineering', website: 'https://cetcell.mahacet.org/', rss: 'https://news.google.com/rss/search?q=MHT+CET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'KMAT Karnataka', authority: 'KPPGCA', level: 'State', category: 'Management', website: 'http://kmatindia.com/', rss: 'https://news.google.com/rss/search?q=KMAT+Karnataka&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'KMAT Kerala', authority: 'CEE Kerala', level: 'State', category: 'Management', website: 'https://kmatkerala.in/', rss: 'https://news.google.com/rss/search?q=KMAT+Kerala&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'TS ICET', authority: 'TSCHE', level: 'State', category: 'Management', website: 'https://icet.tsche.ac.in/', rss: 'https://news.google.com/rss/search?q=TS+ICET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'AP ICET', authority: 'APSCHE', level: 'State', category: 'Management', website: 'https://apicet.apsche.ap.gov.in/', rss: 'https://news.google.com/rss/search?q=AP+ICET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'TANCET (MBA)', authority: 'Anna University', level: 'State', category: 'Management', website: 'https://tancet.annauniv.edu/', rss: 'https://news.google.com/rss/search?q=TANCET+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'HPCET (MBA)', authority: 'HPTU', level: 'State', category: 'Management', website: 'https://www.himtu.ac.in/', rss: 'https://news.google.com/rss/search?q=HPCET+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'OJEE (MBA)', authority: 'OJEE Board', level: 'State', category: 'Management', website: 'https://ojee.nic.in/', rss: 'https://news.google.com/rss/search?q=OJEE+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'RMAT Rajasthan', authority: 'RTU', level: 'State', category: 'Management', website: 'https://rmat.rajasthan.gov.in/', rss: 'https://news.google.com/rss/search?q=RMAT+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'JKBOPEE MBA', authority: 'JKBOPEE', level: 'State', category: 'Management', website: 'https://www.jkbopee.gov.in/', rss: 'https://news.google.com/rss/search?q=JKBOPEE+MBA&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Private / Other ---
    { name: 'AMU MBA Entrance', authority: 'AMU', level: 'University', category: 'Management', website: 'https://www.amucontrollerexams.com/', rss: 'https://news.google.com/rss/search?q=AMU+MBA+Entrance&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'BHU MBA Entrance', authority: 'BHU', level: 'University', category: 'Management', website: 'https://bhu.ac.in/', rss: 'https://news.google.com/rss/search?q=BHU+MBA+Admission&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'LPU NEST (MBA)', authority: 'LPU', level: 'University', category: 'Management', website: 'https://nest.lpu.in/', rss: 'https://news.google.com/rss/search?q=LPU+NEST+MBA&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'KIITEE Management', authority: 'KIIT', level: 'University', category: 'Management', website: 'https://ksom.ac.in/', rss: 'https://news.google.com/rss/search?q=KIITEE+Management&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UPESMET', authority: 'UPES', level: 'University', category: 'Management', website: 'https://www.upes.ac.in/', rss: 'https://news.google.com/rss/search?q=UPESMET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'Christ University MBA', authority: 'Christ University', level: 'University', category: 'Management', website: 'https://christuniversity.in/', rss: 'https://news.google.com/rss/search?q=Christ+University+MBA+Entrance&hl=en-IN&gl=IN&ceid=IN:en' },




    // --- Pharmacy ---
    { name: 'NIPER JEE', authority: 'NIPER', level: 'National', category: 'Pharmacy', website: 'https://niperguwahati.ac.in/', rss: 'https://news.google.com/rss/search?q=NIPER+JEE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'RUHS Pharmacy Admission Test', authority: 'RUHS', level: 'State', category: 'Pharmacy', website: 'https://ruhsraj.org/', rss: 'https://news.google.com/rss/search?q=RUHS+Pharmacy+Admission+Test&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'KAHER-AIET', authority: 'KAHER', level: 'University', category: 'Pharmacy', website: 'https://kledeemeduniversity.edu.in/', rss: 'https://news.google.com/rss/search?q=KAHER+AIET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UPESPAT', authority: 'UPES', level: 'University', category: 'Pharmacy', website: 'https://www.upes.ac.in/', rss: 'https://news.google.com/rss/search?q=UPESPAT+Pharmacy+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Hospitality and Tourism ---
    { name: 'NCHMCT JEE 2025', authority: 'NTA', level: 'National', category: 'Hospitality and Tourism', website: 'https://nchmjee.nta.nic.in/', rss: 'https://news.google.com/rss/search?q=NCHMCT+JEE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'Mah BHMCT CET', authority: 'State CET Cell, Maharashtra', level: 'State', category: 'Hospitality and Tourism', website: 'https://cetcell.mahacet.org/', rss: 'https://news.google.com/rss/search?q=MAH+BHMCT+CET&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'MAH HM CET', authority: 'State CET Cell, Maharashtra', level: 'State', category: 'Hospitality and Tourism', website: 'https://cetcell.mahacet.org/', rss: 'https://news.google.com/rss/search?q=MAH+HM+CET&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'PUTHAT', authority: 'Panjab University', level: 'University', category: 'Hospitality and Tourism', website: 'https://puthat.puchd.ac.in/', rss: 'https://news.google.com/rss/search?q=PUTHAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'IHM-A', authority: 'IHM Aurangabad', level: 'Institute', category: 'Hospitality and Tourism', website: 'https://ihmaurangabad.ac.in/', rss: 'https://news.google.com/rss/search?q=IHM+Aurangabad+Admission&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Competition / Government Exams ---
    { name: 'NDA Exam', authority: 'UPSC', level: 'National', category: 'Competition', website: 'https://upsc.gov.in/examinations/nda-na-examination', rss: 'https://news.google.com/rss/search?q=NDA+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UPSC IAS Exam', authority: 'UPSC', level: 'National', category: 'Competition', website: 'https://upsc.gov.in/', rss: 'https://news.google.com/rss/search?q=UPSC+Civil+Services+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CDS Exam', authority: 'UPSC', level: 'National', category: 'Competition', website: 'https://upsc.gov.in/examinations/cds-examination', rss: 'https://news.google.com/rss/search?q=CDS+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'AFCAT Exam', authority: 'Indian Air Force', level: 'National', category: 'Competition', website: 'https://afcat.cdac.in/', rss: 'https://news.google.com/rss/search?q=AFCAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'SSC CGL Exam', authority: 'SSC', level: 'National', category: 'Competition', website: 'https://ssc.nic.in/', rss: 'https://news.google.com/rss/search?q=SSC+CGL+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'IBPS RRB Exam', authority: 'IBPS', level: 'National', category: 'Competition', website: 'https://www.ibps.in/', rss: 'https://news.google.com/rss/search?q=IBPS+RRB+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CTET Exam', authority: 'CBSE', level: 'National', category: 'Competition', website: 'https://ctet.nic.in/', rss: 'https://news.google.com/rss/search?q=CTET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- School / Board Exams ---
    { name: 'CBSE Class 10th', authority: 'CBSE', level: 'National', category: 'School', website: 'https://cbse.gov.in/', rss: 'https://news.google.com/rss/search?q=CBSE+Class+10+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CBSE Class 12th', authority: 'CBSE', level: 'National', category: 'School', website: 'https://cbse.gov.in/', rss: 'https://news.google.com/rss/search?q=CBSE+Class+12+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UP Board 10th', authority: 'UP Board', level: 'State', category: 'School', website: 'https://upmsp.edu.in/', rss: 'https://news.google.com/rss/search?q=UP+Board+Class+10+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UP Board 12th', authority: 'UP Board', level: 'State', category: 'School', website: 'https://upmsp.edu.in/', rss: 'https://news.google.com/rss/search?q=UP+Board+Class+12+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'Bihar Board 10th', authority: 'BSEB', level: 'State', category: 'School', website: 'https://biharboardonline.bihar.gov.in/', rss: 'https://news.google.com/rss/search?q=Bihar+Board+Class+10+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'Bihar Board 12th', authority: 'BSEB', level: 'State', category: 'School', website: 'https://biharboardonline.bihar.gov.in/', rss: 'https://news.google.com/rss/search?q=Bihar+Board+Class+12+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Study Abroad / International Exams ---
    { name: 'TOEFL', authority: 'ETS', level: 'International', category: 'Study Abroad', website: 'https://www.ets.org/toefl.html', rss: 'https://news.google.com/rss/search?q=TOEFL+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'PTE', authority: 'Pearson', level: 'International', category: 'Study Abroad', website: 'https://www.pearsonpte.com/', rss: 'https://news.google.com/rss/search?q=PTE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'IELTS', authority: 'British Council', level: 'International', category: 'Study Abroad', website: 'https://www.ielts.org/', rss: 'https://news.google.com/rss/search?q=IELTS+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'GRE', authority: 'ETS', level: 'International', category: 'Study Abroad', website: 'https://www.ets.org/gre.html', rss: 'https://news.google.com/rss/search?q=GRE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'SAT', authority: 'College Board', level: 'International', category: 'Study Abroad', website: 'https://collegereadiness.collegeboard.org/sat', rss: 'https://news.google.com/rss/search?q=SAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'LNAT UK', authority: 'LNAT Consortium', level: 'International', category: 'Study Abroad', website: 'https://www.lnat.ac.uk/', rss: 'https://news.google.com/rss/search?q=LNAT+UK+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

    // --- Arts, Commerce & Sciences ---
    { name: 'CUET Exam', authority: 'NTA', level: 'National', category: 'Arts, Commerce & Sciences', website: 'https://cuet.samarth.ac.in/', rss: 'https://news.google.com/rss/search?q=CUET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'CUET PG', authority: 'NTA', level: 'National', category: 'Arts, Commerce & Sciences', website: 'https://pgcuet.samarth.ac.in/', rss: 'https://news.google.com/rss/search?q=CUET+PG+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NFAT', authority: 'NTA', level: 'National', category: 'Arts, Commerce & Sciences', website: 'https://nfat.nta.nic.in/', rss: 'https://news.google.com/rss/search?q=NFAT+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'NEST', authority: 'NISER', level: 'National', category: 'Arts, Commerce & Sciences', website: 'https://www.nestexam.in/', rss: 'https://news.google.com/rss/search?q=NEST+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'UP BEd JEE', authority: 'LKOUNIV', level: 'State', category: 'Arts, Commerce & Sciences', website: 'https://lkouniv.ac.in/', rss: 'https://news.google.com/rss/search?q=UP+BEd+JEE+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'TS EDCET Exam', authority: 'Osmania University', level: 'State', category: 'Arts, Commerce & Sciences', website: 'https://tsedcet.org/', rss: 'https://news.google.com/rss/search?q=TS+EDCET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'IIT JAM', authority: 'IITs', level: 'National', category: 'Arts, Commerce & Sciences', website: 'https://jam.iitr.ac.in/', rss: 'https://news.google.com/rss/search?q=IIT+JAM+Exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'AP PGCET Exam', authority: 'Andhra University', level: 'State', category: 'Arts, Commerce & Sciences', website: 'https://sche.ap.gov.in/pgcet', rss: 'https://news.google.com/rss/search?q=AP+PGCET+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

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
    { name: 'GPAT', authority: 'NBEMS', level: 'National', category: 'Pharmacy', website: 'https://natboard.edu.in/', rss: 'https://news.google.com/rss/search?q=GPAT+Pharmacy+Exam&hl=en-IN&gl=IN&ceid=IN:en' },

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
                    category: examData.category || 'General',
                    registrationLink: examData.website,
                    rssFeedUrl: examData.rss,
                    description: description,
                    news: newsItems,
                    logoUrl: `https://ui-avatars.com/api/?name=${slugify(examData.name, { replacement: '+' })}&background=random&size=200`
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
