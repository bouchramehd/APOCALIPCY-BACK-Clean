const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const Document = require('../models/Document');
const { summarizeWithLLM } = require('../services/llm.service');

exports.uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('[DEBUG] File received:', file.originalname, 'Path:', file.path);

    const ext = path.extname(file.originalname).toLowerCase();
    let plainText = ''; // Declare the variable properly

    // Extract text from the file first
    if (ext === '.docx') {
      const fileBuffer = fs.readFileSync(file.path);
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      plainText = result.value;

    } else if (ext === '.txt') {
      plainText = fs.readFileSync(file.path, 'utf-8');

    } else if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      plainText = pdfData.text;

    } else {
      return res.status(400).json({
        message: 'Unsupported file type. Only .docx, .txt, and .pdf are supported.'
      });
    }

    if (!plainText.trim()) {
      return res.status(400).json({ message: 'Document content is empty after extraction.' });
    }

    console.log('[DEBUG] Extracted text length:', plainText.length);
    console.log('[DEBUG] First 200 chars:', plainText.substring(0, 200));

    // Now call the LLM service with the extracted text
    const summaryResult = await summarizeWithLLM(file.path, ext);


    console.log('[DEBUG] LLM Result:', summaryResult);

    const newDoc = await Document.create({
      userId: req.body.userId || null,
      originalFileName: file.originalname,
      filePath: file.path,
      summary: summaryResult.summary,
      keyPoints: summaryResult.keyPoints,
      suggestedActions: summaryResult.suggestedActions,
    });

    // Clean up the uploaded file after processing
    try {
      fs.unlinkSync(file.path);
      console.log('[DEBUG] Cleaned up temporary file:', file.path);
    } catch (cleanupErr) {
      console.warn('[WARN] Could not clean up file:', cleanupErr.message);
    }

    res.status(201).json({
      message: 'Document uploaded and summarized',
      document: newDoc,
    });

  } catch (err) {
    console.error('[Upload Error]', err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
};