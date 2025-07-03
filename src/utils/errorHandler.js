const errorHandler = (err, req, res, next) => {
  
    console.error(err.stack);

 
    let statusCode = err.statusCode || 500; 
    let message = err.message || 'Server Error'; 

    if (err.name === 'ValidationError') {
        statusCode = 400; // Bad Request
       
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }
    if (err.code === 11000) {
        statusCode = 400; // Bad Request
        const field = Object.keys(err.keyValue)[0]; 
        message = `Duplicate field value: '${field}' already exists.`;
    }
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404; // Not Found
        message = 'Resource not found.';
    }

    // Send the error response to the client
    res.status(statusCode).json({
        message: message,
    
       
    });
};

module.exports = errorHandler; 