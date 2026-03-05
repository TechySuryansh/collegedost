import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISyllabusSubject {
    subject: string;
    topics: string[];
}

export interface IImportantDate {
    event: string;
    date: Date;
    note?: string;
}

export interface IExamNews {
    title: string;
    link: string;
    pubDate: Date;
}

export interface IExam extends Document {
    examName: string;
    examSlug: string;
    conductingAuthority: string;
    examLevel: 'National' | 'State';
    description?: string;
    syllabus: ISyllabusSubject[];
    importantDates: IImportantDate[];
    news: IExamNews[];
    aiGuideContent?: any;
    aiGuideGeneratedAt?: Date;
    isTop: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const examSchema = new Schema<IExam>({
    examName: {
        type: String,
        required: [true, 'Please add an exam name'],
        trim: true
    },
    examSlug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    conductingAuthority: {
        type: String,
        required: [true, 'Please add a conducting authority']
    },
    examLevel: {
        type: String,
        enum: ['National', 'State'],
        default: 'National'
    },
    description: String,
    syllabus: [{
        subject: String,
        topics: [String]
    }],
    importantDates: [{
        event: String,
        date: Date,
        note: String
    }],
    news: [{
        title: String,
        link: String,
        pubDate: {
            type: Date,
            default: Date.now
        }
    }],
    aiGuideContent: {
        type: Schema.Types.Mixed,
        default: null
    },
    aiGuideGeneratedAt: {
        type: Date,
        default: null
    },
    isTop: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Exam: Model<IExam> = mongoose.model<IExam>('Exam', examSchema);
export default Exam;
