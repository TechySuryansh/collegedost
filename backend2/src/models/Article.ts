import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IArticle extends Document {
    title: string;
    slug: string;
    summary: string;
    content: string;
    category: 'Exam News' | 'College News' | 'Admission Alert' | 'General';
    author: string;
    image?: string;
    tags?: string[];
    links?: { title: string; url: string }[];
    createdAt: Date;
    updatedAt: Date;
}

const articleSchema = new Schema<IArticle>({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    summary: {
        type: String,
        required: [true, 'Please add a summary'],
        maxlength: [500, 'Summary cannot be more than 500 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Exam News', 'College News', 'Admission Alert', 'General'],
        default: 'General'
    },
    author: {
        type: String,
        required: [true, 'Please add an author'],
        default: 'Admin'
    },
    image: String,
    tags: [String],
    links: [{
        title: { type: String, required: true },
        url: { type: String, required: true }
    }]
}, {
    timestamps: true
});

// Index for search
articleSchema.index({ title: 'text', summary: 'text' });

const Article: Model<IArticle> = mongoose.model<IArticle>('Article', articleSchema);
export default Article;
