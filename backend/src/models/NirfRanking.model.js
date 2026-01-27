const mongoose = require('mongoose');

const NirfRankingSchema = new mongoose.Schema({
  collegeSlug: {
    type: String,
    required: true,
    index: true
  },
  instituteName: { 
    type: String, 
    trim: true 
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Engineering', 
      'Management', 
      'Medical', 
      'Law', 
      'Pharmacy', 
      'Overall', 
      'University', 
      'College', 
      'Research', 
      'Architecture', 
      'Dental', 
      'Agriculture', 
      'Innovation'
    ]
  },
  year: {
    type: Number,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  score: {
    type: Number
  },
  source: {
    type: String,
    default: "NIRF"
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate entries for the same college + category + year
NirfRankingSchema.index({ collegeSlug: 1, category: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('NirfRanking', NirfRankingSchema);
