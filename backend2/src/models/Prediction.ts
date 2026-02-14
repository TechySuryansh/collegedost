import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPredictionInput {
    percentile?: number;
    score?: number;
    rank?: number;
    category: string;
    homeState: string;
    gender: string;
    exam: string;
}

export interface IPrediction extends Document {
    user?: mongoose.Schema.Types.ObjectId;
    input: IPredictionInput;
    results: any; // Flexible structure for storing prediction outcome
    createdAt: Date;
}

const predictionSchema = new Schema<IPrediction>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    input: {
        percentile: Number,
        score: Number,
        rank: Number,
        category: String,
        homeState: String,
        gender: String,
        exam: String
    },
    results: {
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Prediction: Model<IPrediction> = mongoose.model<IPrediction>('Prediction', predictionSchema);
export default Prediction;
