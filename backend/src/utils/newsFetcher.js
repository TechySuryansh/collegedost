const Parser = require('rss-parser');
const Article = require('../models/Article.model');

const parser = new Parser({
    timeout: 15000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
});

// Comprehensive list of education-focused RSS feeds
const RSS_FEEDS = [
    // Major News Outlets - Education Sections
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms',
        source: 'Times of India',
        priority: 1
    },
    {
        url: 'https://www.hindustantimes.com/feeds/rss/education/rssfeed.xml',
        source: 'Hindustan Times',
        priority: 1
    },
    {
        url: 'https://indianexpress.com/section/education/feed/',
        source: 'Indian Express',
        priority: 1
    },
    {
        url: 'https://www.ndtv.com/rss/education',
        source: 'NDTV',
        priority: 1
    },
    {
        url: 'https://www.thehindu.com/education/feeder/default.rss',
        source: 'The Hindu',
        priority: 1
    },
    // Education-specific portals
    {
        url: 'https://www.shiksha.com/rss/news.xml',
        source: 'Shiksha',
        priority: 2
    },
    {
        url: 'https://news.careers360.com/rss',
        source: 'Careers360',
        priority: 2
    },
    {
        url: 'https://www.indiatoday.in/rss/education',
        source: 'India Today',
        priority: 1
    },
    {
        url: 'https://economictimes.indiatimes.com/industry/services/education/rssfeeds/13358305.cms',
        source: 'Economic Times',
        priority: 2
    },
    // Google News - Education India
    {
        url: 'https://news.google.com/rss/search?q=india+education+exam+jee+neet+admission&hl=en-IN&gl=IN&ceid=IN:en',
        source: 'Google News',
        priority: 3
    }
];

// Enhanced category detection with keywords
const CATEGORY_KEYWORDS = {
    'Exam News': [
        'exam', 'jee', 'neet', 'gate', 'cat', 'upsc', 'ssc', 'cuet', 'clat', 
        'mat', 'xat', 'cmat', 'snap', 'bitsat', 'viteee', 'wbjee', 'mht-cet',
        'test', 'paper', 'question', 'answer key', 'syllabus', 'pattern',
        'admit card', 'hall ticket', 'exam date', 'schedule'
    ],
    'Results': [
        'result', 'scorecard', 'marks', 'rank', 'topper', 'merit list',
        'cutoff', 'cut-off', 'percentile', 'score', 'declared', 'announced',
        'pass percentage', 'qualify'
    ],
    'Admission Alert': [
        'admission', 'counselling', 'counseling', 'registration', 'apply',
        'application', 'last date', 'deadline', 'seat allotment', 'choice filling',
        'document verification', 'reporting', 'fee payment', 'spot round',
        'vacancy', 'vacant seats'
    ],
    'College News': [
        'college', 'university', 'iit', 'nit', 'iim', 'aiims', 'iiit', 'bits',
        'du', 'jnu', 'bhu', 'amu', 'campus', 'placement', 'convocation',
        'recruitment', 'faculty', 'professor', 'research', 'ranking', 'nirf'
    ],
    'Scholarship': [
        'scholarship', 'fellowship', 'stipend', 'financial aid', 'grant',
        'merit', 'bursary', 'education loan', 'fee waiver', 'free education'
    ],
    'Career': [
        'career', 'job', 'internship', 'employment', 'salary', 'package',
        'recruiter', 'interview', 'resume', 'skill', 'course', 'certification'
    ]
};

// Detect category based on title and content
const detectCategory = (title, content = '') => {
    const text = `${title} ${content}`.toLowerCase();
    
    // Priority order for category detection
    const categoryPriority = ['Results', 'Exam News', 'Admission Alert', 'Scholarship', 'College News', 'Career'];
    
    for (const category of categoryPriority) {
        const keywords = CATEGORY_KEYWORDS[category];
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) {
                return category;
            }
        }
    }
    
    return 'General';
};

// Extract image from RSS item
const extractImage = (item) => {
    // Try different image fields
    if (item.enclosure && item.enclosure.url) {
        return item.enclosure.url;
    }
    if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
        return item['media:content'].$.url;
    }
    if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
        return item['media:thumbnail'].$.url;
    }
    // Try to extract from content
    if (item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
            return imgMatch[1];
        }
    }
    return null;
};

// Extract tags from content
const extractTags = (title, category) => {
    const tags = [category];
    const text = title.toLowerCase();
    
    const examTags = ['JEE Main', 'JEE Advanced', 'NEET', 'GATE', 'CAT', 'CUET', 'UPSC', 'CLAT', 'MAT', 'XAT'];
    const collegeTags = ['IIT', 'NIT', 'IIM', 'AIIMS', 'IIIT', 'DU', 'JNU', 'BITS'];
    
    for (const tag of [...examTags, ...collegeTags]) {
        if (text.includes(tag.toLowerCase())) {
            tags.push(tag);
        }
    }
    
    // Year tags
    const yearMatch = text.match(/20[2-3][0-9]/);
    if (yearMatch) {
        tags.push(yearMatch[0]);
    }
    
    return [...new Set(tags)]; // Remove duplicates
};

// Clean HTML content
const cleanContent = (html) => {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
};

// Main fetch function
const fetchAndStoreNews = async () => {
    console.log('🔄 Starting Enhanced News Fetch...');
    let newArticlesCount = 0;
    let errorCount = 0;

    for (const feedConfig of RSS_FEEDS) {
        try {
            console.log(`📡 Fetching from ${feedConfig.source}...`);
            const feed = await parser.parseURL(feedConfig.url);
            
            let feedArticles = 0;

            for (const item of feed.items) {
                // Skip if no title
                if (!item.title) continue;

                // Duplicate Check by Title (case-insensitive)
                const exists = await Article.findOne({ 
                    title: { $regex: new RegExp(`^${item.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                });
                if (exists) continue;

                // Detect category
                const category = detectCategory(item.title, item.contentSnippet || item.content);
                
                // Skip general news if we have too much
                if (category === 'General' && feedConfig.priority > 2) continue;

                // Clean and prepare content
                let summary = cleanContent(item.contentSnippet || item.content || '');
                if (summary.length > 497) {
                    summary = summary.substring(0, 497) + '...';
                }
                if (summary.length < 20) {
                    summary = `Read the full article about "${item.title}" from ${feedConfig.source}.`;
                }

                let content = cleanContent(item.content || item.contentSnippet || '');
                if (content.length < 50) {
                    content = summary;
                }

                // Extract image
                const image = extractImage(item);

                // Extract tags
                const tags = extractTags(item.title, category);

                // Create Article
                try {
                    await Article.create({
                        title: item.title.trim(),
                        summary: summary,
                        content: content,
                        category: category,
                        author: feedConfig.source,
                        isPublished: true, // Auto-publish news
                        image: image || 'no-photo.jpg',
                        tags: tags,
                        links: [{ title: 'Read Full Article', url: item.link }],
                        createdAt: item.pubDate ? new Date(item.pubDate) : new Date()
                    });

                    newArticlesCount++;
                    feedArticles++;
                } catch (createError) {
                    // Handle duplicate slug or other creation errors
                    if (createError.code !== 11000) { // Not a duplicate key error
                        console.error(`Error creating article: ${createError.message}`);
                    }
                }
            }

            console.log(`   ✅ Added ${feedArticles} articles from ${feedConfig.source}`);

        } catch (error) {
            errorCount++;
            console.error(`   ❌ Error fetching from ${feedConfig.source}: ${error.message}`);
        }
    }

    console.log(`\n📊 News Fetch Complete:`);
    console.log(`   - New articles: ${newArticlesCount}`);
    console.log(`   - Errors: ${errorCount}`);
    
    return { newArticlesCount, errorCount };
};

// Fetch news with retry logic
const fetchNewsWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetchAndStoreNews();
        } catch (error) {
            console.error(`Attempt ${i + 1} failed: ${error.message}`);
            if (i === retries - 1) throw error;
            await new Promise(r => setTimeout(r, 5000)); // Wait 5 seconds before retry
        }
    }
};

module.exports = fetchAndStoreNews;
module.exports.fetchNewsWithRetry = fetchNewsWithRetry;
