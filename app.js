const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing
const mongoose = require('mongoose'); // For database storage

// Replace with your actual MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/your_database_name';

const app = express();
app.use(bodyParser.json());

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

// Login endpoint (POST request)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized status
    }

    // Compare hashed passwords securely
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Login successful (avoid sending sensitive information like password in response)
    res.json({ message: 'Login successful', user: { name: user.name, email: user.email } }); // Provide basic user details
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Error logging in' }); // Generic error for security
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
