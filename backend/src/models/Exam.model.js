const mongoose = require('mongoose');
const slugify = require('slugify');

const examSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: [true, 'Please add an exam name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  examSlug: {
    type: String,
    unique: true
  },
  conductingAuthority: {
    type: String,
    required: true
  },
  examLevel: {
    type: String,
    enum: ['National', 'State', 'University', 'International'],
    default: 'National'
  },
  description: {
    type: String, // Short summary for cards
    maxlength: 500
  },
  importantDates: [
    {
      title: String,
      date: Date,
      isTentative: {
        type: Boolean,
        default: false
      }
    }
  ],
  eligibility: {
    type: String, // Store HTML or Markdown
  },
  syllabus: {
    type: String
  },
  examPattern: {
    type: String
  },
  applicationProcess: {
      fee: String,
      steps: [String],
      websiteUrl: String
  },
  resultInfo: {
    type: String
  },
  cutoffInfo: {
    type: String
  },
  logoUrl: {
      type: String,
      default: 'https://via.placeholder.com/150'
  },
  rssFeedUrl: {
      type: String,
      trim: true
  },
  registrationLink: {
      type: String,
      trim: true
  },
  news: [{
      title: String,
      link: String,
      pubDate: Date,
      contentSnippet: String,
      guid: { type: String, unique: false } // guid might not be unique across ALL exams, so loosen constraint or just store
  }]
}, {
  timestamps: true
});

// Create exam slug from the name
examSchema.pre('save', function(next) {
  this.examSlug = slugify(this.examName, { lower: true });
  next();
});

module.exports = mongoose.model('Exam', examSchema);
