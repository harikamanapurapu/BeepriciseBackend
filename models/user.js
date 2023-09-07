const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Create and export User model
module.exports = mongoose.model('User', userSchema);