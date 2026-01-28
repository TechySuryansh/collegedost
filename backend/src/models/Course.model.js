const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String, // e.g., "B.Tech Computer Science"
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    shortName: {
        type: String // e.g. "B.Tech"
    },
    degreeLevel: {
        type: String,
        enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Doctorate', 'Certificate'],
        required: true
    },
    duration: {
        type: String, // e.g. "4 Years"
    },

    // Rich Content
    highlights: {
        type: Map,
        of: String
    },

    eligibility: {
        type: String // Markdown or HTML
    },
    overview: {
        type: String // HTML
    },
    admissionProcess: {
        type: String // HTML
    },

    subjects: [String], // List of major subjects

    syllabus: [{
        semester: String,
        subjects: [String]
    }],

    entranceExams: [{
        name: String,
        mode: String
    }],

    careerOptions: [String], // Simple list

    jobRoles: [{
        role: String,
        avgSalary: String
    }],

    topRecruiters: [String],

    averageStartingSalary: String,

    // Reverse mapping could be done virtually, but here we can define "Related Specializations"
    specialization: {
        type: String // "Computer Science and Engineering"
    },

    icon: {
        type: String // URL or icon class
    }
}, { timestamps: true });

// Slug generation
courseSchema.pre('save', async function () {
    if (!this.slug && this.courseName) {
        this.slug = slugify(this.courseName, { lower: true, strict: true });
    }
});

module.exports = mongoose.model('Course', courseSchema);
