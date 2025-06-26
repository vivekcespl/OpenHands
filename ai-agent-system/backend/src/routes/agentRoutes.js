const express = require('express');
const agentController = require('../controllers/agentController');
const router = express.Router();

// Route to process a prompt with a specific agent
router.post('/process', agentController.processPrompt);

// Route to get the shared context
router.get('/context', agentController.getContext);

// Route to update the shared context
router.put('/context', agentController.updateContext);

// Route to clear the shared context
router.delete('/context', agentController.clearContext);

module.exports = router;