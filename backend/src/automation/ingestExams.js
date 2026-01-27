const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exam = require('../models/Exam.model');
const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const slugify = require('slugify');

dotenv.config();

const parser = new Parser();

const POPULAR_EXAMS = [
    {
        name: 'JEE Main',
        authority: 'NTA',
        level: 'National',
        website: 'https://jeemain.nta.ac.in/',
        rss: 'https://news.google.com/rss/search?q=JEE+Main+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    },
    {
        name: 'JEE Advanced',
        authority: 'IITs',
        level: 'National',
        website: 'https://jeeadv.ac.in/',
        rss: 'https://news.google.com/rss/search?q=JEE+Advanced+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    },
    {
        name: 'NEET UG',
        authority: 'NTA',
        level: 'National',
        website: 'https://neet.nta.nic.in/',
        rss: 'https://news.google.com/rss/search?q=NEET+UG+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    },
    {
        name: 'BITSAT',
        authority: 'BITS Pilani',
        level: 'National',
        website: 'https://www.bitsadmission.com/',
        rss: 'https://news.google.com/rss/search?q=BITSAT+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    },
    {
        name: 'VITEEE',
        authority: 'VIT',
        level: 'University',
        website: 'https://viteee.vit.ac.in/',
        rss: 'https://news.google.com/rss/search?q=VITEEE+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    },
    {
        name: 'CAT',
        authority: 'IIMs',
        level: 'National',
        website: 'https://iimcat.ac.in/',
        rss: 'https://news.google.com/rss/search?q=CAT+Exam+IIM&hl=en-IN&gl=IN&ceid=IN:en'
    },
    {
        name: 'NIFT',
        authority: 'NTA',
        level: 'National',
        website: 'https://nift.nta.ac.in/',
        rss: 'https://news.google.com/rss/search?q=NIFT+Entrance+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    },
    {
        name: 'CLAT',
        authority: 'Consortium of NLUs',
        level: 'National',
        website: 'https://consortiumofnlus.ac.in/',
        rss: 'https://news.google.com/rss/search?q=CLAT+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    },
    {
        name: 'UPSC CSE',
        authority: 'UPSC',
        level: 'National',
        website: 'https://upsc.gov.in/',
        rss: 'https://news.google.com/rss/search?q=UPSC+Civil+Services+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    },
    {
        name: 'GATE',
        authority: 'IITs',
        level: 'National',
        website: 'https://gate.iitk.ac.in/',
        rss: 'https://news.google.com/rss/search?q=GATE+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    },
    {
       name: 'UPESEAT',
       authority: 'UPES',
       level: 'University',
       website: 'https://www.upes.ac.in/',
       rss: 'https://news.google.com/rss/search?q=UPESEAT+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    },
    {
       name: 'AEEE',
       authority: 'Amrita Vishwa Vidyapeetham',
       level: 'University',
       website: 'https://www.amrita.edu/',
       rss: 'https://news.google.com/rss/search?q=AEEE+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    },
     {
       name: 'MHT CET',
       authority: 'State Common Entrance Test Cell, Maharashtra',
       level: 'State',
       website: 'https://cetcell.mahacet.org/',
       rss: 'https://news.google.com/rss/search?q=MHT+CET+Exam&hl=en-IN&gl=IN&ceid=IN:en'
    }
];

const scrapeMetaDescription = async (url) => {
    try {
        const { data } = await axios.get(url, {
             headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
             timeout: 5000,
             httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        const $ = cheerio.load(data);
        const metaDesc = $('meta[name="description"]').attr('content') || 
                         $('meta[property="og:description"]').attr('content') ||
                         '';
        return metaDesc.substring(0, 490) + (metaDesc.length > 490 ? '...' : '');
    } catch (e) {
        console.log(`Failed to scrape description for ${url}: ${e.message}`);
        return '';
    }
};

const ingestExams = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        for (const examData of POPULAR_EXAMS) {
            console.log(`Processing ${examData.name}...`);

            // 1. Fetch News
            let newsItems = [];
            try {
                const feed = await parser.parseURL(examData.rss);
                newsItems = feed.items.slice(0, 10).map(item => ({
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    contentSnippet: item.contentSnippet || item.content,
                    guid: item.guid || item.link || item.id
                }));
                console.log(`- Fetched ${newsItems.length} news items.`);
            } catch (err) {
                console.error(`- Failed to fetch news: ${err.message}`);
            }

            // 2. Try to scrape description if not provided?
            // Actually, let's use a generic description for now to be safe, or try scraping
            const scrapedDesc = await scrapeMetaDescription(examData.website);
            const description = scrapedDesc || `Official entrance exam conducted by ${examData.authority}. Check official website for latest updates.`;

            // 3. Upsert into DB
            const slug = slugify(examData.name, { lower: true });
            
            await Exam.findOneAndUpdate(
                { examSlug: slug },
                {
                    examName: examData.name,
                    examSlug: slug,
                    conductingAuthority: examData.authority,
                    examLevel: examData.level,
                    registrationLink: examData.website, // Usually the main site has the link
                    rssFeedUrl: examData.rss,
                    description: description,
                    news: newsItems,
                    logoUrl: `https://ui-avatars.com/api/?name=${slugify(examData.name, {replacement:'+'})}&background=random&size=200`
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`- Saved/Updated ${examData.name} in DB.`);
        }

        console.log('✅ Exam Ingestion Complete');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

ingestExams();
