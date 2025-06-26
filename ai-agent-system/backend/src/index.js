require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const agentRoutes = require('./routes/agentRoutes');
const { validateOpenHandsClaudeAPI, getOpenHandsClaudeStatus } = require('./utils/openhandsClaudeAPI');

const app = express();
const PORT = process.env.PORT || 12001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/agents', agentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// OpenHands Claude API health check endpoint
app.get('/health/claude', async (req, res) => {
  try {
    const status = await getOpenHandsClaudeStatus();
    if (status.status === 'connected') {
      res.status(200).json({
        status: 'ok',
        message: status.message,
        model: status.model,
        lastResponse: status.lastResponse,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'error',
        message: status.message,
        suggestion: status.suggestion,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Failed to check OpenHands Claude API status',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;