import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IYouTubeVideo extends Document {
    title: string;
    videoId: string;
    thumbnail?: string;
    category: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const youtubeVideoSchema = new Schema<IYouTubeVideo>({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    videoId: {
        type: String,
        required: [true, 'Please add a YouTube Video ID'],
        unique: true,
        trim: true
    },
    thumbnail: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for search
youtubeVideoSchema.index({ title: 'text', description: 'text' });

const YouTubeVideo: Model<IYouTubeVideo> = mongoose.model<IYouTubeVideo>('YouTubeVideo', youtubeVideoSchema);
export default YouTubeVideo;
