const express = require('express');
const morgan = require('morgan'); 
const cors = require('cors'); 

const app = express(); 

const authRoutes = require('./routes/auth.routes');
const documentRoutes = require('./routes/document.routes');
const errorHandler = require('./utils/errorHandler');

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// 404 handler
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
