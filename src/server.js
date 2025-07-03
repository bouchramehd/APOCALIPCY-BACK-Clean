require('dotenv').config();
const app = require('./app'); 
const connectDB = require('./config/db'); 
const config = require('./config'); // Import your configuration settings (including PORT)

// Connect to MongoDB
connectDB();

// Start the server
app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});