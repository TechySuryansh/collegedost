import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICourseEntity extends Document {
    courseName: string;
    shortName: string;
    slug: string;
    degreeLevel: 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Doctorate';
    duration: string;
    overview: string;
    careerOptions: string[];
    aiGuideContent?: any;
    aiGuideGeneratedAt?: Date;
    isTrending: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const courseSchema = new Schema<ICourseEntity>({
    courseName: {
        type: String,
        required: [true, 'Please add a course name'],
        trim: true
    },
    shortName: {
        type: String,
        required: [true, 'Please add a short name (e.g. B.Tech)']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    degreeLevel: {
        type: String,
        required: [true, 'Please add a degree level'],
        enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Doctorate'],
        default: 'Undergraduate'
    },
    duration: {
        type: String,
        required: [true, 'Please add duration (e.g. 4 Years)']
    },
    overview: {
        type: String,
        required: [true, 'Please add an overview']
    },
    careerOptions: [String],
    aiGuideContent: {
        type: Schema.Types.Mixed,
        default: null
    },
    aiGuideGeneratedAt: {
        type: Date,
        default: null
    },
    isTrending: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const CourseEntity: Model<ICourseEntity> = mongoose.model<ICourseEntity>('CourseEntity', courseSchema);
export default CourseEntity;
