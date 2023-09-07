const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('..//models/user');
require('dotenv').config(); // Load environment variables from .env file



// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)

    // Check if all required fields are provided
    if ( !email || !password) {
      return res.send('All fields are required' ); //need to check(res.send or res.json)
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('Email is already registered' );
    }
  
    // Hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user
    const user = { email, password: encryptedPassword }
    await User.create(user);
    
    // Generate JWT token
    const token = jwt.sign({...user},process.env.JWT_SECRET,{expiresIn:"1h"})

    // Return success response
    res.json({ success: true, token, user:email});
  } 
  catch (error) {
      errorHandler(res, error);
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      // Check if email and password are provided
      if (!email || !password) {
        return res.send( 'Email and password are required' );
      }
  
      // Find user by email
      const userInDb = await User.findOne({ email });
      if (!userInDb) {
        return res.send('User doesnot exist');
      }
  
      // Compare password with stored hash
      const passwordMatch = await bcrypt.compare(password, userInDb.password);
      if (passwordMatch) {
        const jwtToken=jwt.sign({...userInDb},process.env.JWT_SECRET,{expiresIn:"1h"})
        res.send({message:"Login succesful",jwtToken})
      }
      else{
        res.send("Invalid password")
      }

  } catch (error) {
    errorHandler(res, error);
  }
});

// Middleware for error handling
const errorHandler = (res, error) => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  };

module.exports = router;