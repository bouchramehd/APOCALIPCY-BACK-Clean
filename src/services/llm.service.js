const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const axios = require('axios');
require('dotenv').config();

exports.summarizeWithLLM = async (filePath, ext) => {
  ext = ext || path.extname(filePath).toLowerCase();
  console.log('[LLM DEBUG] filePath:', filePath, 'ext:', ext);
  let text = '';
  try {
    // Extract text from file
    if (ext === '.txt') {
      text = fs.readFileSync(filePath, 'utf-8');
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else {
      throw new Error('Unsupported file type. Only .txt, .docx, and .pdf are supported.');
    }
    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from the document.');
    }
    console.log('[LLM DEBUG] Extracted text length:', text.length);
    const prompt = `Analyse ce document français et réponds exactement dans ce format :
DOCUMENT :
${text.slice(0, 2000)}
Tu dois répondre EXACTEMENT dans ce format :
RÉSUMÉ: [écris un résumé en 2-3 phrases]
POINTS CLÉS:
- [premier point important]
- [deuxième point important]
- [troisième point important]
ACTIONS SUGGÉRÉES:
- [première action recommandée]
- [deuxième action recommandée]
- [troisième action recommandée]
IMPORTANT : commence toujours par les mots RÉSUMÉ:, POINTS CLÉS: et ACTIONS SUGGÉRÉES: même si tu n'as pas d'informations.`;
    console.log('[LLM DEBUG] Sending request to Ollama...');
    let response;
    try {
      response = await axios.post(
        'http://ollama:11434/api/generate',
        {
          model: 'mistral',
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1000
          }
        },
        {
          timeout: 120000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        return {
          summary: 'Erreur: Impossible de se connecter au service LLM. Vérifiez qu\'Ollama est démarré.',
          keyPoints: ['Service LLM indisponible'],
          suggestedActions: ['Vérifier que Ollama est démarré', 'Redémarrer le service LLM']
        };
      }
      console.error('[LLM Error] Failed to contact Ollama:', err.message);
      throw err;
    }
    console.log('[LLM DEBUG] Ollama response status:', response.status);
    console.log('[LLM DEBUG] Ollama response data:', JSON.stringify(response.data, null, 2));
    let summaryText = '';
    if (response.data && typeof response.data.response === 'string') {
      summaryText = response.data.response.trim();
    } else if (response.data && response.data.message && typeof response.data.message.content === 'string') {
      summaryText = response.data.message.content.trim();
    } else {
      console.error('[LLM Response] Unexpected format:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid response format from Ollama');
    }
    if (!summaryText) {
      throw new Error('Empty response from Ollama');
    }
    const parsed = parseStructuredResponse(summaryText);
    console.log('[LLM DEBUG] Parsed result:', parsed);
    return parsed;
  } catch (err) {
    console.error('[LLM Error] Full error:', err);
    return {
      summary: `Erreur lors du traitement: ${err.message}`,
      keyPoints: ['Erreur de traitement du document'],
      suggestedActions: ['Vérifier le format du document', 'Réessayer l\'opération']
    };
  }
};
// Helper function to parse structured response
function parseStructuredResponse(text) {
  console.log('[Parse DEBUG] Raw LLM response:', text);
  const result = {
    summary: '',
    keyPoints: [],
    suggestedActions: []
  };
  try {
    const summaryMatch = text.match(/RÉSUMÉ:\s*([\s\S]*?)(?=\n{1,2}POINTS CLÉS:|$)/i);
    const keyPointsMatch = text.match(/POINTS CLÉS:\s*([\s\S]*?)(?=\n{1,2}ACTIONS SUGGÉRÉES:|$)/i);
    const actionsMatch = text.match(/ACTIONS SUGGÉRÉES:\s*([\s\S]*?)$/i);
    if (summaryMatch) {
      result.summary = summaryMatch[1].trim().replace(/\n/g, ' ');
      console.log('[Parse DEBUG] Found summary:', result.summary);
    }
    if (keyPointsMatch) {
      const pointsText = keyPointsMatch[1];
      console.log('[DEBUG] Raw keyPoints block:', pointsText);
      result.keyPoints = pointsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || /^\d+\./.test(line))
        .map(line => line.replace(/^[-\d+\.\s]*/, '').trim())
        .filter(Boolean);
      console.log('[Parse DEBUG] Parsed keyPoints:', result.keyPoints);
    }
    if (actionsMatch) {
      const actionsText = actionsMatch[1];
      console.log('[DEBUG] Raw actions block:', actionsText);
      result.suggestedActions = actionsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || /^\d+\./.test(line))
        .map(line => line.replace(/^[-\d+\.\s]*/, '').trim())
        .filter(Boolean);
      console.log('[Parse DEBUG] Parsed actions:', result.suggestedActions);
    }
    if (!result.summary) {
      const cleanText = text.replace(/RÉSUMÉ:|POINTS CLÉS:|ACTIONS SUGGÉRÉES:/gi, '').trim();
      result.summary = cleanText.substring(0, 300) + (cleanText.length > 300 ? '...' : '');
    }
    if (result.keyPoints.length === 0) {
      result.keyPoints = ['Document analysé avec succès', 'Contenu extrait et traité'];
    }
    if (result.suggestedActions.length === 0) {
      result.suggestedActions = ['Réviser le contenu du document', 'Partager avec l\'équipe concernée'];
    }
  } catch (parseErr) {
    console.error('[Parse Error]', parseErr);
    result.summary = text.substring(0, 200);
    result.keyPoints = ['Erreur lors du parsing'];
    result.suggestedActions = ['Vérifier le format de réponse'];
  }
  console.log('[Parse DEBUG] Final result:', result);
  return result;
}