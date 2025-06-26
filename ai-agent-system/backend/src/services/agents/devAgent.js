const axios = require('axios');
const { callClaudeAPI } = require('../../utils/claudeAPI');

/**
 * Dev Agent - Specializes in technical development and code generation
 */
exports.process = async (prompt, context, options = {}) => {
  try {
    // Construct the system prompt for the Dev agent
    const systemPrompt = `You are a Dev Agent specializing in blockchain and AI development. 
    
Your expertise includes:
- Smart contract development (Solidity, Rust)
- Frontend and backend web development
- API integration
- System architecture design
- Code optimization and security

Format your code responses with proper syntax highlighting using markdown code blocks with the appropriate language specified.`;

    // Construct the user message with context
    const userMessage = constructUserMessage(prompt, context);
    
    // Call Claude API
    const response = await callClaudeAPI(systemPrompt, userMessage, options);
    
    return {
      content: response.content,
      format: 'markdown',
      metadata: {
        agentType: 'dev',
        timestamp: new Date().toISOString(),
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0
      }
    };
  } catch (error) {
    console.error('Error in Dev Agent:', error);
    throw new Error(`Dev Agent error: ${error.message}`);
  }
};

/**
 * Construct a user message with context
 */
function constructUserMessage(prompt, context) {
  // Extract relevant history from context
  const relevantHistory = context.relevantHistory || [];
  
  // Format the history as a string
  let historyText = '';
  if (relevantHistory.length > 0) {
    historyText = 'Previous interactions:\n\n' + 
      relevantHistory.map(item => 
        `Agent: ${item.agentType}\nPrompt: ${item.prompt}\nResponse: ${summarizeResponse(item.response)}\n`
      ).join('\n---\n\n');
  }
  
  // Combine history with the current prompt
  return `${historyText ? historyText + '\n\nCurrent request:\n' : ''}${prompt}`;
}

/**
 * Summarize a response for inclusion in context
 */
function summarizeResponse(response) {
  if (!response || !response.content) return 'No response';
  
  // For brevity in the context, limit the response summary
  const maxLength = 200;
  let content = response.content;
  
  if (content.length > maxLength) {
    content = content.substring(0, maxLength) + '...';
  }
  
  return content;
}

