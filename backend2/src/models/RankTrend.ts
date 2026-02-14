import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IRankTrend extends Document {
    exam: string;
    year: number;
    score: number;
    rank: number;
}

const rankTrendSchema = new Schema<IRankTrend>({
    exam: {
        type: String,
        required: true,
        index: true
    },
    year: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    rank: {
        type: Number,
        required: true
    }
});

// Compound index for efficient searching
rankTrendSchema.index({ exam: 1, score: -1 });

const RankTrend: Model<IRankTrend> = mongoose.model<IRankTrend>('RankTrend', rankTrendSchema);
export default RankTrend;
