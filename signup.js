const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing
const mongoose = require('mongoose'); // For database storage
const cors = require('cors');
const jwt = require('jsonwebtoken');
const your_secret_key = process.env.SECRET_KEY;


// Replace with your actual MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/your_database_name';

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL; 
app.use(cors({ origin: 'https://github.com/cybercube10/CarboNfootprint' })); 

// Mongoose schema for user data (consider adding validation)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure email uniqueness
  phone: { type: Number, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Connect to MongoDB database
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Signup endpoint (POST request)
app.post('/signup', async (req, res) => {
  try {
    const { name, email, phone , password } = req.body;

    // Input validation (consider using a library like Joi)
    if (!name || !email || !phone ||!password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for existing user with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' }); // Conflict status
    }

    // Hash password securely before storing
    const saltRounds = 10; // Adjust salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user' }); // Generic error for security
  }
});
