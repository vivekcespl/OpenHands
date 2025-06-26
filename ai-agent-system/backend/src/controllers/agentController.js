const agentService = require('../services/agentService');
const { validatePromptRequest } = require('../middleware/validation');

// Shared context storage
let sharedContext = {
  history: [],
  metadata: {
    lastUpdated: new Date().toISOString(),
    version: 1
  }
};

/**
 * Process a prompt with the specified agent
 */
exports.processPrompt = async (req, res) => {
  try {
    // Validate the request
    const validationError = validatePromptRequest(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { agentType, prompt, options } = req.body;
    
    // Process the prompt with the appropriate agent
    const result = await agentService.processWithAgent(
      agentType, 
      prompt, 
      sharedContext,
      options || {}
    );
    
    // Update shared context with the new interaction
    sharedContext.history.push({
      timestamp: new Date().toISOString(),
      agentType,
      prompt,
      response: result,
      id: `interaction-${sharedContext.history.length + 1}`
    });
    
    sharedContext.metadata.lastUpdated = new Date().toISOString();
    sharedContext.metadata.version += 1;
    
    return res.status(200).json({ 
      result,
      contextVersion: sharedContext.metadata.version
    });
  } catch (error) {
    console.error('Error processing prompt:', error);
    return res.status(500).json({ 
      error: 'Failed to process prompt',
      details: error.message
    });
  }
};

/**
 * Get the current shared context
 */
exports.getContext = (req, res) => {
  return res.status(200).json(sharedContext);
};

/**
 * Update the shared context
 */
exports.updateContext = (req, res) => {
  try {
    const { context } = req.body;
    
    if (!context) {
      return res.status(400).json({ error: 'Context is required' });
    }
    
    // Merge the provided context with the existing one
    sharedContext = {
      ...sharedContext,
      ...context,
      metadata: {
        ...sharedContext.metadata,
        lastUpdated: new Date().toISOString(),
        version: sharedContext.metadata.version + 1
      }
    };
    
    return res.status(200).json({ 
      message: 'Context updated successfully',
      context: sharedContext
    });
  } catch (error) {
    console.error('Error updating context:', error);
    return res.status(500).json({ 
      error: 'Failed to update context',
      details: error.message
    });
  }
};

/**
 * Clear the shared context
 */
exports.clearContext = (req, res) => {
  try {
    // Reset the shared context
    sharedContext = {
      history: [],
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: 1
      }
    };
    
    return res.status(200).json({ 
      message: 'Context cleared successfully',
      context: sharedContext
    });
  } catch (error) {
    console.error('Error clearing context:', error);
    return res.status(500).json({ 
      error: 'Failed to clear context',
      details: error.message
    });
  }
};