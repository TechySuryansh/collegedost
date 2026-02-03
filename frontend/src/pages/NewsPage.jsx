import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag, FaArrowRight, FaNewspaper } from 'react-icons/fa';

// Indian education context images
const indianImages = [
    'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=400&fit=crop', // Indian students
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop', // Classroom
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop', // Students studying
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop', // Graduation
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop', // Education
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop', // Books
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop', // Study desk
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop', // Writing
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=400&fit=crop', // School
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=400&fit=crop'  // Library
];

// International/Foreign education context images  
const internationalImages = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop', // Western graduation
    'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop', // University campus
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop', // Graduation cap
    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&h=400&fit=crop', // University building
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=400&fit=crop', // Students outdoor
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop', // Group study
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop', // Lecture hall
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop', // Modern campus
    'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&h=400&fit=crop', // Students walking
    'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&h=400&fit=crop'  // Global education
];

// Keywords to detect Indian news
const indianKeywords = [
    'india', 'indian', 'iit', 'nit', 'iim', 'aiims', 'iiit', 'bits', 'neet', 'jee',
    'gate', 'upsc', 'ssc', 'cbse', 'icse', 'cuet', 'delhi', 'mumbai', 'bangalore',
    'chennai', 'kolkata', 'hyderabad', 'pune', 'nirf', 'ugc', 'aicte', 'ncert',
    'du', 'jnu', 'bhu', 'amu', 'bihar', 'uttar pradesh', 'maharashtra', 'karnataka',
    'rajasthan', 'madhya pradesh', 'tamil nadu', 'kerala', 'gujarat', 'west bengal',
    'lakh', 'crore', 'rupee', '₹', 'rs.', 'inr', 'josaa', 'csab', 'state board',
    'haryana', 'punjab', 'jharkhand', 'odisha', 'chhattisgarh', 'assam', 'manipur',
    'class 10', 'class 12', 'board exam', 'nta', 'admit card', 'counselling'
];

// Keywords to detect International/Foreign news
const internationalKeywords = [
    'usa', 'uk', 'us', 'united states', 'united kingdom', 'america', 'american',
    'europe', 'european', 'australia', 'australian', 'canada', 'canadian',
    'germany', 'german', 'france', 'french', 'abroad', 'overseas', 'international',
    'global', 'world', 'foreign', 'visa', 'ielts', 'toefl', 'gre', 'gmat', 'sat',
    'harvard', 'stanford', 'mit', 'oxford', 'cambridge', 'ivy league', 'princeton',
    'yale', 'columbia', 'berkeley', 'ucla', 'nyu', 'eu', 'china', 'chinese',
    'japan', 'japanese', 'singapore', 'hong kong', 'london', 'new york', 'dollar',
    'pound', 'euro', 'usd', 'gbp', 'immigration', 'study abroad', 'fta', 'trade'
];

// Detect if article is Indian or International
const detectContext = (title, summary = '') => {
    const text = `${title} ${summary}`.toLowerCase();
    
    let indianScore = 0;
    let internationalScore = 0;
    
    for (const keyword of indianKeywords) {
        if (text.includes(keyword)) indianScore++;
    }
    
    for (const keyword of internationalKeywords) {
        if (text.includes(keyword)) internationalScore++;
    }
    
    // Default to Indian if equal or no keywords found (since it's an Indian education portal)
    if (internationalScore > indianScore) return 'international';
    return 'indian';
};

// Simple hash function to get consistent index from title
const hashTitle = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        const char = title.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

const NewsPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const location = useLocation();
    
    // Initialize filter from URL or default to 'All'
    const [filter, setFilter] = useState(searchParams.get('category') || 'All');

    // ===== KEY FIX: Sync URL → State when external navigation occurs =====
    useEffect(() => {
        const newCategory = searchParams.get('category') || 'All';
        setFilter(newCategory);
        // Refetch articles when navigating to this page
        fetchArticles();
    }, [location.search, location.pathname]); // Triggered when URL changes

    // Also fetch on initial mount
    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const res = await api.get('/articles');
            if (res.data.success && Array.isArray(res.data.data)) {
                setArticles(res.data.data);
            } else {
                setArticles([]); // clear if invalid
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Get proper image URL with fallback - uses context detection for Indian vs International
    const getImageUrl = (article) => {
        if (article.image && article.image !== 'no-photo.jpg' && article.image.startsWith('http')) {
            return article.image;
        }
        
        // Detect if Indian or International news
        const context = detectContext(article.title, article.summary);
        const placeholders = context === 'international' ? internationalImages : indianImages;
        const index = hashTitle(article.title || 'default') % placeholders.length;
        return placeholders[index];
    };

    // Handle image error - replace with context-appropriate placeholder
    const handleImageError = (e, article) => {
        e.target.onerror = null; // Prevent infinite loop
        const context = detectContext(article.title, article.summary);
        const placeholders = context === 'international' ? internationalImages : indianImages;
        const index = (hashTitle(article.title || 'default') + 1) % placeholders.length;
        e.target.src = placeholders[index];
    };

    const categories = ['All', 'Exam News', 'Results', 'College News', 'Admission Alert', 'Scholarship', 'Career', 'General'];

    const filteredArticles = filter === 'All' 
        ? articles 
        : articles.filter(article => article.category === filter);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            
            {/* Header */}
            <div className="bg-white border-b border-gray-200 mb-10">
                <div className="container mx-auto px-4 py-12 text-center">
                    <span className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-2 block">Stay Updated</span>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">Education News & Articles</h1>
                    
                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-brand-blue text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-blue border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map(article => (
                                <article key={article._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-blue-50">
                                        <img 
                                            src={getImageUrl(article)} 
                                            alt={article.title} 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => handleImageError(e, article)}
                                            loading="lazy"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-blue shadow-sm">
                                            {article.category}
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(article.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><FaUser /> {article.author}</span>
                                        </div>
                                        
                                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
                                            <Link to={`/news/${article.slug}`}>{article.title}</Link>
                                        </h2>
                                        
                                        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                                            {article.summary}
                                        </p>

                                        <Link to={`/news/${article.slug}`} className="inline-flex items-center gap-2 text-brand-orange font-bold text-sm hover:gap-3 transition-all mt-auto">
                                            Read Article <FaArrowRight />
                                        </Link>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <FaNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-600">No articles found in this category.</h3>
                                <p className="text-gray-400 mt-2">Check back later for updates!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsPage;

