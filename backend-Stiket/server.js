const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const chatbotRoute = require('./routes/chatbot');
app.use('/api/chat', chatbotRoute);

// Health check
app.get('/', (req, res) => {
  res.send('StackIt Backend + n8n Connector Running ✅');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
