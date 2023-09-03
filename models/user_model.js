const mongoose = require('mongoose'); // Import the mongoose module
const bcrypt = require('bcryptjs'); // Import the bcryptjs module for password hashing

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['employee', 'admin'],
      default: 'employee',
      required: true,
    },
    assignedReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reviewsFromOthers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields to the schema with timestamps
  }
);

// Pre-save middleware to hash the password before saving it in the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10); // Hash the password using bcrypt
});

// Method to validate the password with the one provided by the user
userSchema.methods.isValidatedPassword = async function (userSentPassword) {
  return await bcrypt.compare(userSentPassword, this.password); // Compare the userSentPassword with the hashed password
};

const User = mongoose.model('User', userSchema); // Create a model named 'User' based on the userSchema

module.exports = User; // Export the User model