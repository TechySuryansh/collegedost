import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
    title, 
    description, 
    keywords, 
    image, 
    article = false,
    author
}) => {
    const location = useLocation();
    const siteUrl = 'https://collegedost.com'; // Replace with actual domain in production
    const currentUrl = `${siteUrl}${location.pathname}`;
    const defaultImage = `${siteUrl}/og-image.jpg`; // Ensure this image exists in public folder
    
    // Construct title
    const fullTitle = title ? `${title} | CollegeDost` : 'CollegeDost - The Education Hub';

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || 'CollegeDost helps students make informed career decisions with data-driven insights on colleges, exams, and courses.'} />
            <meta name="keywords" content={keywords || 'college, university, exam, result, jee main, neet, cutoff, rank predictor, education'} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={article ? 'article' : 'website'} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || 'CollegeDost helps students make informed career decisions.'} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:site_name" content="CollegeDost" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || 'CollegeDost helps students make informed career decisions.'} />
            <meta name="twitter:image" content={image || defaultImage} />

            {/* Article Specific */}
            {article && author && <meta name="author" content={author} />}
        </Helmet>
    );
};

export default SEO;
