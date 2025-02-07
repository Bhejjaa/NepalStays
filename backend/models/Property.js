const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Property name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Property description is required']
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  location: {
    type: String,
    required: [true, 'Property location is required']
  },
  price: {
    type: Number,
    required: [true, 'Price per night is required']
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  amenities: [{
    type: String
  }],
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
  beds: {
    type: Number,
    required: [true, 'Number of beds is required']
  },
  baths: {
    type: Number,
    required: [true, 'Number of baths is required']
  },
  maxGuests: {
    type: Number,
    required: [true, 'Maximum number of guests is required']
  },
  type: {
    type: String,
    enum: ['Hotel', 'Resort', 'Homestay', 'Villa'],
    required: [true, 'Property type is required']
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

module.exports = mongoose.model('Property', propertySchema);