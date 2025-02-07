const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Experience title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Experience description is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  price: {
    type: Number,
    required: [true, 'Price per person is required']
  },
  image: {
    type: String,
    required: [true, 'Experience image is required']
  },
  category: {
    type: String,
    enum: ['Adventure', 'Culinary', 'Cultural', 'Photography'],
    required: [true, 'Category is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Maximum group size is required']
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Experience', experienceSchema); 