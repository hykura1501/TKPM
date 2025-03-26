const mongoose = require('mongoose');
const seedData = require('./seed');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
    seedData();
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error: ', err);
});

