"use client";

import React, { useState, useEffect } from 'react';
import { FaPlay, FaThumbsUp, FaEye, FaCalendarAlt } from 'react-icons/fa';
import api from '@/api/axios';

interface VideoItem {
    id: string;
    title: string;
    thumbnail: string;
    views: string;
    date: string;
    likes: string;
    youtubeId: string;
}

const fallbackVideos: VideoItem[] = [
    {
        id: '1',
        title: 'What Makes KLU Stand Out? An Exclusive Interview with Director Dr. M. Kishore Babu',
        thumbnail: 'https://img.youtube.com/vi/IhhQb20mHwI/maxresdefault.jpg',
        views: '1.2K',
        date: 'Mar 3, 2026',
        likes: '45',
        youtubeId: 'IhhQb20mHwI',
    },
    {
        id: '2',
        title: 'UID Campus Tour: Students Show the Real Campus Experience #studentlife #design #real #review',
        thumbnail: 'https://img.youtube.com/vi/cG7PywVPU1s/maxresdefault.jpg',
        views: '658',
        date: 'Feb 28, 2026',
        likes: '28',
        youtubeId: 'cG7PywVPU1s',
    },
    {
        id: '3',
        title: 'KL University Isn’t Just Engineering | Inside MHS at KLU Vijayawada',
        thumbnail: 'https://img.youtube.com/vi/aZs25dfxtQw/maxresdefault.jpg',
        views: '2.4K',
        date: 'Feb 21, 2026',
        likes: '112',
        youtubeId: 'aZs25dfxtQw',
    },
    {
        id: '4',
        title: 'Top 10 Things About NPSBCET Most Students Miss | Placements, Cutoffs & Fees',
        thumbnail: 'https://img.youtube.com/vi/f7iNGd-gnfQ/maxresdefault.jpg',
        views: '1.8K',
        date: 'Feb 15, 2026',
        likes: '74',
        youtubeId: 'f7iNGd-gnfQ',
    },
    {
        id: '5',
        title: 'What It’s REALLY Like to Study at UID | Campus Vibe, Faculty, Events & More (Unfiltered)',
        thumbnail: 'https://img.youtube.com/vi/pQ28QNObVQQ/maxresdefault.jpg',
        views: '1.1K',
        date: 'Feb 10, 2026',
        likes: '95',
        youtubeId: 'pQ28QNObVQQ',
    },
];

const VideoSection: React.FC = () => {
    const [videoList, setVideoList] = useState<VideoItem[]>(fallbackVideos);
    const [activeVideo, setActiveVideo] = useState<VideoItem>(fallbackVideos[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get('/youtube');
                if (response.data.success && response.data.data.length > 0) {
                    const fetchedVideos = response.data.data.map((v: any) => ({
                        id: v._id,
                        title: v.title,
                        thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`,
                        views: '0', // These could be dynamic later
                        date: new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        likes: '0',
                        youtubeId: v.videoId
                    }));
                    setVideoList(fetchedVideos);
                    setActiveVideo(fetchedVideos[0]);
                }
            } catch (error) {
                console.error('Error fetching videos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const handleVideoClick = (video: VideoItem) => {
        setActiveVideo(video);
        setIsPlaying(true);
    };

    if (loading && videoList === fallbackVideos) {
        // Just a subtle indicator or nothing to avoid flicker
    }

    return (
        <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Learn more about Colleges and Exams in these short Videos
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Video Player */}
                <div className="lg:col-span-2">
                    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg group">
                        {isPlaying ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                                title={activeVideo.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <>
                                <img
                                    src={activeVideo.thumbnail}
                                    alt={activeVideo.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Play Button Overlay */}
                                <div
                                    onClick={() => setIsPlaying(true)}
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 group-hover:bg-black/30 transition-all"
                                >
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                        <FaPlay className="text-gray-900 text-xl md:text-2xl ml-1" />
                                    </div>
                                </div>
                                {/* More Videos Badge */}
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-4 py-2 bg-black/70 text-white text-xs font-bold rounded-lg backdrop-blur-sm">
                                        MORE VIDEOS
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Video Info */}
                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-900 leading-snug">
                            {activeVideo.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <FaEye className="text-gray-400" />
                                {activeVideo.views} Views
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FaCalendarAlt className="text-gray-400" />
                                {activeVideo.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FaThumbsUp className="text-gray-400" />
                                {activeVideo.likes} Likes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Watch Next Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-900 text-sm">Watch Next Videos</h3>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
                            {videoList.map((video) => (
                                <div
                                    key={video.id}
                                    onClick={() => handleVideoClick(video)}
                                    className={`flex gap-3 p-4 cursor-pointer transition-colors hover:bg-purple-50 ${activeVideo.id === video.id ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                                        }`}
                                >
                                    <div className="relative w-28 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                                                <FaPlay className="text-gray-700 text-[8px] ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug mb-1.5">
                                            {video.title}
                                        </h4>
                                        <p className="text-[10px] text-gray-500 font-medium">
                                            {video.views} Views | {video.date} | {video.likes} Likes
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoSection;
