import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPredictorConfig extends Document {
    examName: string; // e.g., JEE Main, NEET
    year: number;
    enabled: boolean;
    weightingFactors: {
        category: string;
        factor: number;
    }[];
    cutoffBuffer: number; // Percentage or rank buffer
    createdAt: Date;
    updatedAt: Date;
}

const predictorConfigSchema = new Schema<IPredictorConfig>({
    examName: {
        type: String,
        required: true,
        unique: true
    },
    year: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    weightingFactors: [{
        category: String,
        factor: Number
    }],
    cutoffBuffer: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const PredictorConfig: Model<IPredictorConfig> = mongoose.model<IPredictorConfig>('PredictorConfig', predictorConfigSchema);
export default PredictorConfig;
