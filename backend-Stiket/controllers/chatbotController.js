const fetch = require('node-fetch'); // install this if not present
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

const sendToN8nAgent = async (req, res) => {
  const { query, questions = [], sessionId = 'guest' } = req.body;

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, questions, sessionId })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error sending to n8n:', error);
    return res.status(500).json({ error: 'Failed to contact AI Agent' });
  }
};

module.exports = { sendToN8nAgent };
