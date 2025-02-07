const Destination = require('../models/Destination');
const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get popular destinations
// @route   GET /api/destinations/popular
// @access  Public
const getPopularDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({ isPopular: true });
    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
const getDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create destination
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    // Upload image to cloudinary
    const stream = Readable.from(req.file.buffer);
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'destinations',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    // Create destination with uploaded image URL
    const destination = await Destination.create({
      name: req.body.name,
      propertyCount: req.body.propertyCount,
      description: req.body.description,
      isPopular: req.body.isPopular === 'true',
      image: uploadResponse.secure_url
    });

    res.status(201).json({
      success: true,
      data: destination
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
      propertyCount: req.body.propertyCount,
      description: req.body.description,
      isPopular: req.body.isPopular === 'true'
    };

    // If new image is uploaded
    if (req.file) {
      const stream = Readable.from(req.file.buffer);
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'destinations',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });
      updateData.image = uploadResponse.secure_url;
    }

    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllDestinations,
  getPopularDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination
};