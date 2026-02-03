const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Exam News', 'Results', 'College News', 'Admission Alert', 'Scholarship', 'Career', 'General']
    },
    summary: {
        type: String,
        required: [true, 'Please add a summary'],
        maxlength: 500
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    author: {
        type: String,
        default: 'CollegeDost Team'
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    links: [{
        title: { type: String, required: true },
        url: { type: String, required: true }
    }]
});

// Create slug from title
articleSchema.pre('save', function(next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }
    if (typeof next === 'function') {
        next();
    }
});

module.exports = mongoose.model('Article', articleSchema);
