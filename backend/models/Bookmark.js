const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  isFavorite: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

bookmarkSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
