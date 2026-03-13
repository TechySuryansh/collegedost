import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISpecialization extends Document {
    name: string;
    slug: string;
    stream: string;
    details?: any; // AI generated guide content
    generatedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const specializationSchema = new Schema<ISpecialization>({
    name: {
        type: String,
        required: [true, 'Please add a specialization name'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    stream: {
        type: String,
        required: true,
        default: 'Engineering'
    },
    details: {
        type: Schema.Types.Mixed,
        default: null
    },
    generatedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Specialization: Model<ISpecialization> = mongoose.model<ISpecialization>('Specialization', specializationSchema);
export default Specialization;
