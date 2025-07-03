const mongoose = require('mongoose');
const config = require('./index'); // Import your configuration settings

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Optional: Add more options if needed, e.g., serverSelectionTimeoutMS
        });
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit the process if the database connection fails
    }
};

module.exports = connectDB; // Export the connectDB function