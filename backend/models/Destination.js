const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true
  },
  propertyCount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: [true, 'Destination image is required']
  },
  description: {
    type: String,
    trim: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Destination', destinationSchema);