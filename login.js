const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing
const mongoose = require('mongoose'); // For database storage
const cors = require('cors');
const jwt = require('jsonwebtoken');
const your_secret_key = process.env.SECRET_KEY;

const users = [
    {
      email: 'test@gmail.com',
      password: '$2y$10$JOvPQHf.XRuZVKVJwbXhOeOpLZLWuwsYWLfaN/.lnYWVWDNE2Ra4uO' // Hashed password for 'password123' (use bcrypt.hash to generate)
    }
  ];
  
  // Middleware for parsing incoming JSON data
  app.use(express.json());
  
  // Login endpoint (POST request)
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Find user by email
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // Compare password hash (use bcrypt.compare to compare)
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // Generate JWT token with user ID (replace with actual user data)
    const token = jwt.sign({ userId: user.email }, 'your_secret_key', { expiresIn: '30m' }); // Replace 'your_secret_key' with a strong secret key
  
    res.json({ token });
  });
  
  // ... other API endpoints for your application

export default LoginPage;
app.listen(port, () => console.log(`Server listening on port ${3000}`));