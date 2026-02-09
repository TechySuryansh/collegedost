import React from 'react';
import { FaStar, FaQuoteLeft, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { CollegeData } from './types';

interface ReviewsSectionProps {
    college: CollegeData;
    sectionRef: React.RefObject<HTMLDivElement | null>;
    reviews: any[];
    isLoadingReviews: boolean;
    hasMoreReviews: boolean;
    onLoadMore: () => void;
    totalReviewCount?: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
    college,
    sectionRef,
    reviews,
    isLoadingReviews,
    hasMoreReviews,
    onLoadMore,
    totalReviewCount,
}) => {
    // Calculate average ratings from reviews if available
    const calculateCategoryRatings = () => {
        if (reviews.length === 0) return null;
        
        const categories = {
            Academics: reviews.reduce((sum, r) => sum + (r.academicsRating || 0), 0) / reviews.length || 0,
            Placements: reviews.reduce((sum, r) => sum + (r.placementsRating || 0), 0) / reviews.length || 0,
            Infrastructure: reviews.reduce((sum, r) => sum + (r.infrastructureRating || 0), 0) / reviews.length || 0,
            'Campus Life': reviews.reduce((sum, r) => sum + (r.campusLifeRating || 0), 0) / reviews.length || 0,
        };
        
        // Check if any category has valid data
        const hasValidData = Object.values(categories).some(val => val > 0);
        return hasValidData ? categories : null;
    };
    
    const categoryRatings = calculateCategoryRatings();

    return (
        <div 
            ref={sectionRef}
            id="reviews"
            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
        >
            <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-linear-to-b from-yellow-500 to-orange-500 rounded-full"></span>
                Student Reviews
            </h2>

            {/* Rating Overview */}
            <div className="flex flex-col md:flex-row gap-6 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-center md:border-r md:pr-6 border-gray-200">
                    <div className="text-5xl font-bold text-text-main-light mb-1">
                        {college.rating || 'N/A'}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                        {[1,2,3,4,5].map(i => (
                            <FaStar key={i} className={i <= Math.floor(Number(college.rating || 0)) ? '' : 'text-gray-300'} />
                        ))}
                    </div>
                    <div className="text-sm text-text-muted-light">
                        Based on {totalReviewCount || reviews.length} review{(totalReviewCount || reviews.length) !== 1 ? 's' : ''}
                    </div>
                </div>
                {categoryRatings ? (
                    <div className="flex-1 space-y-2">
                        {Object.entries(categoryRatings).map(([label, rating]) => (
                            <div key={label} className="flex items-center gap-3">
                                <span className="text-sm text-text-muted-light w-28">{label}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-linear-to-r from-primary to-secondary h-2 rounded-full" 
                                        style={{ width: `${(rating / 5) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold text-text-main-light w-8">{rating.toFixed(1)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 text-center text-text-muted-light text-sm">
                        Category ratings not available yet
                    </div>
                )}
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
                {isLoadingReviews && reviews.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto mb-2"></div>
                        <p className="text-text-muted-light text-sm">Loading reviews...</p>
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id || review.id} className="border border-gray-100 rounded-xl p-5 hover:border-primary/30 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                        {(review.authorName || review.user?.name || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-main-light">{review.authorName || review.user?.name || 'Anonymous'}</h4>
                                        <p className="text-xs text-text-muted-light">
                                            {review.courseName ? `${review.courseName}${review.graduationYear ? `, ${review.graduationYear}` : ''}` : 'Student'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {[1,2,3,4,5].map(i => (
                                        <FaStar key={i} className={`text-sm ${i <= (review.overallRating || 0) ? '' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-start gap-2 mb-4">
                                <FaQuoteLeft className="text-gray-200 text-xl shrink-0 mt-1" />
                                <p className="text-sm text-text-muted-light leading-relaxed">{review.reviewText || review.comment}</p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-text-muted-light">
                                <span>{review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date not available')}</span>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => console.log('Mark helpful:', review._id || review.id)}
                                        className="flex items-center gap-1 hover:text-primary transition-colors"
                                    >
                                        <FaThumbsUp /> {review.helpfulCount || 0} helpful
                                    </button>
                                    <button 
                                        onClick={() => console.log('Report review:', review._id || review.id)}
                                        className="flex items-center gap-1 hover:text-primary transition-colors"
                                    >
                                        <FaThumbsDown /> Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-text-muted-light">
                        <p>No reviews available for this college yet.</p>
                    </div>
                )}
            </div>

            {hasMoreReviews && (
                <button 
                    onClick={onLoadMore}
                    disabled={isLoadingReviews}
                    className="mt-6 w-full py-3 border border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoadingReviews ? 'Loading...' : 'Load More Reviews'}
                </button>
            )}
        </div>
    );
};

export default ReviewsSection;
