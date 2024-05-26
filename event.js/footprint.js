const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Replace with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/your_database_name';

const app = express();
app.use(bodyParser.json());

// Mongoose schema for user footprint data
const FootprintSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Replace with actual user identifier
  date: { type: Date, required: true },
  footprint: { type: Number, required: true },
});

const Footprint = mongoose.model('Footprint', FootprintSchema);

// Connect to MongoDB database
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Store user's daily footprint (POST request)
app.post('/footprints', async (req, res) => {
  try {
    const { userId, footprint } = req.body;
    if (!userId || !footprint) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newFootprint = new Footprint({ userId, date: new Date(), footprint });
    await newFootprint.save();

    res.status(201).json({ message: 'Footprint stored successfully' });
  } catch (err) {
    console.error('Error storing footprint:', err);
    res.status(500).json({ message: 'Error storing footprint' });
  }
});

// Get top 5 lowest CO2 producers for a day (GET request)
app.get('/footprints/daily/top5', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight

    const top5 = await Footprint.aggregate([
      { $match: { date: today } }, // Filter entries for today
      { $group: { _id: '$userId', totalFootprint: { $sum: '$footprint' } } }, // Aggregate footprint by user
      { $sort: { totalFootprint: 1 } }, // Sort by ascending footprint (lowest CO2 producers)
      { $limit: 5 } // Limit to top 5 users
    ]);

    res.json(top5);
  } catch (err) {
    console.error('Error getting daily top 5:', err);
    res.status(500).json({ message: 'Error getting daily top 5' });
  }
});

// Get top 5 lowest CO2 producers for a month (GET request)
app.get('/footprints/monthly/top5', async (req, res) => {
  try {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0); // Set to first day of month at midnight

    const top5 = await Footprint.aggregate([
      { $match: { date: { $gte: monthStart, $lt: today } } }, // Filter entries for current month
      { $group: { _id: '$userId', totalFootprint: { $sum: '$footprint' } } }, // Aggregate footprint by user
      { $sort: { totalFootprint: 1 } }, // Sort by ascending footprint (lowest CO2 producers)
      { $limit: 5 } // Limit to top 5 users
    ]);

    res.json(top5);
  } catch (err) {
    console.error('Error getting monthly top 5:', err);
    res.status(500).json({ message: 'Error getting monthly top 5' });
  }
});

// Get year-to-date footprint data (GET request)
app.get('/footprints/year', async (req, res) => {
    try {
      const today = new Date();
      const yearStart = new Date(today.getFullYear(), 0, 1); // Set to January 1st of current year
      yearStart.setHours(0, 0, 0, 0);
  
      const yearData = await Footprint.aggregate([
        { $match: { date: { $gte: yearStart, $lt: today } } }, // Filter entries for current year
        { $group: { _id: null, totalFootprint: { $sum: '$footprint' } } } // Aggregate total footprint
      ]);
  
      const totalFootprint = yearData.length > 0 ? yearData[0].totalFootprint : 0; // Handle empty result case
  
      res.json({ totalFootprint });
    } catch (err) {
      console.error('Error getting year-to-date footprint:', err);
      res.status(500).json({ message: 'Error getting year-to-date footprint' });
    }
  });
  
  // ... other API endpoints (e.g., top 5 daily/monthly)
  
  app.listen(3000, () => console.log('Server listening on port 3000')); // Start server
