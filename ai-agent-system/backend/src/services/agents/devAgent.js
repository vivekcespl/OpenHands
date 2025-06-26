const axios = require('axios');

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
    
    // Call Claude API via OpenHands
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

/**
 * Call the Claude API via OpenHands
 */
async function callClaudeAPI(systemPrompt, userMessage, options = {}) {
  try {
    // This is a placeholder for the actual Claude API integration
    // In a real implementation, this would make an API call to Claude via OpenHands
    
    // Simulate API response for now
    return {
      content: `# Development Solution

Here's a sample smart contract implementation:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenDistribution {
    address public owner;
    mapping(address => uint256) public balances;
    
    event Distribution(address indexed recipient, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    function distribute(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays must be same length");
        
        for (uint i = 0; i < recipients.length; i++) {
            balances[recipients[i]] += amounts[i];
            emit Distribution(recipients[i], amounts[i]);
        }
    }
}
\`\`\`

## Implementation Notes
- This contract allows for batch distribution of tokens
- Events are emitted for each distribution for transparency
- Only the owner can perform distributions

## Next Steps
1. Add token transfer functionality
2. Implement access control for different admin roles
3. Add unit tests for all functions`,
      usage: {
        prompt_tokens: 600,
        completion_tokens: 400
      }
    };
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error(`Claude API error: ${error.message}`);
  }
}