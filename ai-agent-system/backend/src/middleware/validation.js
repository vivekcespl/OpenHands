/**
 * Validates a prompt request
 * @param {Object} requestBody - The request body to validate
 * @returns {string|null} - Error message or null if valid
 */
exports.validatePromptRequest = (requestBody) => {
  const { agentType, prompt } = requestBody;
  
  // Check if required fields are present
  if (!agentType) {
    return 'Agent type is required';
  }
  
  if (!prompt) {
    return 'Prompt is required';
  }
  
  // Validate agent type
  const validAgentTypes = ['whitepaper', 'dev', 'tokenomics'];
  if (!validAgentTypes.includes(agentType.toLowerCase())) {
    return `Invalid agent type. Must be one of: ${validAgentTypes.join(', ')}`;
  }
  
  // Validate prompt length
  if (prompt.length < 3) {
    return 'Prompt must be at least 3 characters long';
  }
  
  if (prompt.length > 10000) {
    return 'Prompt exceeds maximum length of 10000 characters';
  }
  
  return null;
};