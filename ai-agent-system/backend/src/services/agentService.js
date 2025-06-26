const axios = require('axios');

/**
 * Process a prompt with the specified agent
 * @param {string} agentType - The type of agent to use (whitepaper, dev, tokenomics)
 * @param {string} prompt - The user's prompt
 * @param {Object} context - The shared context
 * @param {Object} options - Additional options for processing
 * @returns {Promise<Object>} - The processed result
 */
exports.processWithAgent = async (agentType, prompt, context, options = {}) => {
  try {
    // Determine which agent to use
    const agent = getAgentByType(agentType);
    
    // Prepare the context for the agent
    const agentContext = prepareContextForAgent(context, agentType);
    
    // Process the prompt with the agent
    const result = await agent.process(prompt, agentContext, options);
    
    return result;
  } catch (error) {
    console.error(`Error processing with ${agentType} agent:`, error);
    throw new Error(`Failed to process with ${agentType} agent: ${error.message}`);
  }
};

/**
 * Get the appropriate agent based on type
 * @param {string} agentType - The type of agent
 * @returns {Object} - The agent object
 */
function getAgentByType(agentType) {
  switch (agentType.toLowerCase()) {
    case 'whitepaper':
      return require('./agents/whitepaperAgent');
    case 'dev':
      return require('./agents/devAgent');
    case 'tokenomics':
      return require('./agents/tokenomicsAgent');
    default:
      throw new Error(`Unknown agent type: ${agentType}`);
  }
}

/**
 * Prepare the context for a specific agent
 * @param {Object} context - The shared context
 * @param {string} agentType - The type of agent
 * @returns {Object} - The prepared context
 */
function prepareContextForAgent(context, agentType) {
  // Clone the context to avoid modifying the original
  const agentContext = JSON.parse(JSON.stringify(context));
  
  // Filter history to only include relevant interactions
  // This could be customized based on the agent's needs
  agentContext.relevantHistory = context.history.filter(item => {
    // Include all interactions for now, but could be filtered by agent type
    return true;
  });
  
  return agentContext;
}