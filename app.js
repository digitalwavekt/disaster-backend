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


// Hypothetical user data (replace with database integration)
const users = [
    {
      email: 'test@gmail.com',
      password: '$2y$10$JOvPQHf.XRuZVKVJwbXhOeOpLZLWuwsYWLfaN/.lnYWVWDNE2Ra4uO' // Hashed password for 'password123' (use bcrypt.hash to generate)
    }
  ];
  
  // Middleware for parsing incoming JSON data
  app.use(express.json());
  
  

export default LoginPage;
app.listen(port, () => console.log(`Server listening on port ${3000}`));
