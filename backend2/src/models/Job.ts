import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IJob extends Document {
    type: 'aicte_ingestion' | 'nirf_check' | 'college_sync';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    year?: number;
    message?: string;
    progress: number;
    totalRows?: number;
    processedRows?: number;
    error?: string;
    createdAt: Date;
    updatedAt: Date;
}

const jobSchema = new Schema<IJob>({
    type: {
        type: String,
        required: true,
        enum: ['aicte_ingestion', 'nirf_check', 'college_sync']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    year: Number,
    message: String,
    progress: {
        type: Number,
        default: 0
    },
    totalRows: Number,
    processedRows: {
        type: Number,
        default: 0
    },
    error: String
}, {
    timestamps: true
});

const Job: Model<IJob> = mongoose.model<IJob>('Job', jobSchema);
export default Job;
