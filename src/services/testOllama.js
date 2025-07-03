const axios = require('axios');

(async () => {
  try {
    const res = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral',
      prompt: 'Explique la Révolution française en 3 phrases.',
      stream: false
    });

    console.log('Success:', res.data);
  } catch (err) {
    console.error('FAILED:', err.code, err.message);
  }
})();
