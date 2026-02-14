import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPredictorSettings extends Document {
    isEnabled: boolean;
    useAI: boolean;
    aiModel: string;
    openaiApiKey?: string;
    maxRequestsPerUser: number;
    cacheResultsMinutes: number;
    createdAt: Date;
    updatedAt: Date;
}

const predictorSettingsSchema = new Schema<IPredictorSettings>({
    isEnabled: { type: Boolean, default: false },
    useAI: { type: Boolean, default: true },
    aiModel: { type: String, default: 'gpt-4o' },
    openaiApiKey: { type: String, select: false }, // Don't return API key by default
    maxRequestsPerUser: { type: Number, default: 10 },
    cacheResultsMinutes: { type: Number, default: 60 }
}, {
    timestamps: true
});

const PredictorSettings: Model<IPredictorSettings> = mongoose.model<IPredictorSettings>('PredictorSettings', predictorSettingsSchema);
export default PredictorSettings;
