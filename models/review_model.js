const mongoose = require('mongoose'); // Import the mongoose module

// Define the review schema
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String, // The review content is stored as a string
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId, // The reviewer field stores a reference to a User object
      ref: 'User', // The reference is to the User model
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId, // The recipient field stores a reference to a User object
      ref: 'User', // The reference is to the User model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields to the schema with timestamps
  }
);

const Review = mongoose.model('Review', reviewSchema); // Create a model named 'Review' based on the reviewSchema

module.exports = Review; // Export the Review model