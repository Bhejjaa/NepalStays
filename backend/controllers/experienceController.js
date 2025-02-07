const Experience = require('../models/Experience');

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get experiences by category
// @route   GET /api/experiences/category/:category
// @access  Public
const getExperiencesByCategory = async (req, res) => {
  try {
    const experiences = await Experience.find({ category: req.params.category });
    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured experiences
// @route   GET /api/experiences/featured
// @access  Public
const getFeaturedExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ isFeatured: true });
    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
const getExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create experience
// @route   POST /api/experiences
// @access  Private/Admin
const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private
const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private/Admin
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
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
  getAllExperiences,
  getExperiencesByCategory,
  getFeaturedExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
}; 