const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller'); // Fixed typo: controllerS -> controllers
const multer = require('multer');

// Setup file upload directory with better configuration
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file extension
    const allowedExtensions = ['.pdf', '.txt', '.docx'];
    const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, and DOCX files are allowed.'));
    }
  }
});

// Route: POST /api/documents/upload
router.post('/upload', upload.single('file'), documentController.uploadDocument);

// Error handling for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
  }
  next(err);
});

module.exports = router;