const Property = require('../models/Property');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('destination', 'name');
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isFeatured: true })
      .populate('destination', 'name');
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('destination', 'name');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res) => {
  try {
    console.log('1. Starting property creation...');
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    console.log('2. Files received:', req.files.length, 'files');
    console.log('3. Request body:', req.body);

    // Upload all images to cloudinary with timeout
    console.log('4. Starting Cloudinary upload...');
    const uploadImage = async (file, index) => {
      console.log(`5. Processing file ${index + 1}...`);
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'properties',
            resource_type: 'auto',
            timeout: 60000 // 60 seconds timeout
          },
          (error, result) => {
            if (error) {
              console.error(`Cloudinary upload error for file ${index + 1}:`, error);
              reject(error);
            } else {
              console.log(`Upload successful for file ${index + 1}`);
              resolve(result.secure_url);
            }
          }
        );

        // Create readable stream from buffer
        const stream = Readable.from(file.buffer);
        
        // Handle stream errors
        stream.on('error', (error) => {
          console.error('Stream error:', error);
          reject(error);
        });

        // Pipe with error handling
        stream.pipe(uploadStream)
          .on('error', (error) => {
            console.error('Pipe error:', error);
            reject(error);
          });
      });
    };

    // Upload images with individual timeouts
    const imageUrls = [];
    for (let i = 0; i < req.files.length; i++) {
      try {
        const url = await uploadImage(req.files[i], i);
        imageUrls.push(url);
      } catch (error) {
        console.error(`Failed to upload image ${i + 1}:`, error);
        return res.status(500).json({
          success: false,
          message: `Failed to upload image ${i + 1}: ${error.message}`
        });
      }
    }

    console.log('8. All uploads completed. URLs:', imageUrls);

    // Create property with uploaded image URLs
    const propertyData = {
      name: req.body.name,
      description: req.body.description,
      destination: req.body.destination,
      location: req.body.location,
      price: Number(req.body.price),
      images: imageUrls,
      amenities: JSON.parse(req.body.amenities),
      beds: Number(req.body.beds),
      baths: Number(req.body.baths),
      maxGuests: Number(req.body.maxGuests),
      type: req.body.type
    };

    console.log('9. Creating property with data:', propertyData);
    const property = await Property.create(propertyData);
    console.log('10. Property created successfully:', property._id);

    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('ERROR in property creation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating property'
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
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
  getAllProperties,
  getFeaturedProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
}; 