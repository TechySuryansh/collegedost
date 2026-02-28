import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISiteSettings extends Document {
    googleTrackingCode?: string;
    metaTrackingCode?: string;
    createdAt: Date;
    updatedAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>({
    googleTrackingCode: { type: String, default: '' },
    metaTrackingCode: { type: String, default: '' }
}, {
    timestamps: true
});

const SiteSettings: Model<ISiteSettings> = mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);
export default SiteSettings;
