const axios = require('axios');

/**
 * Tokenomics Agent - Specializes in token economics and distribution models
 */
exports.process = async (prompt, context, options = {}) => {
  try {
    // Construct the system prompt for the Tokenomics agent
    const systemPrompt = `You are a Tokenomics Agent specializing in token economics for blockchain projects. 
    
Your expertise includes:
- Token distribution models
- Vesting schedules and lockups
- Incentive mechanisms
- Economic sustainability
- Market analysis and token valuation
- Governance models

Format your responses in Markdown with proper headings, bullet points, and include tables and charts descriptions where appropriate.`;

    // Construct the user message with context
    const userMessage = constructUserMessage(prompt, context);
    
    // Call Claude API via OpenHands
    const response = await callClaudeAPI(systemPrompt, userMessage, options);
    
    return {
      content: response.content,
      format: 'markdown',
      metadata: {
        agentType: 'tokenomics',
        timestamp: new Date().toISOString(),
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0
      }
    };
  } catch (error) {
    console.error('Error in Tokenomics Agent:', error);
    throw new Error(`Tokenomics Agent error: ${error.message}`);
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
      content: `# Tokenomics Model

## Token Distribution

| Allocation | Percentage | Tokens | Vesting |
|------------|------------|--------|---------|
| Team | 15% | 15,000,000 | 2-year linear vesting with 6-month cliff |
| Investors | 20% | 20,000,000 | 18-month linear vesting with 3-month cliff |
| Community | 40% | 40,000,000 | No vesting, allocated to rewards and ecosystem |
| Treasury | 15% | 15,000,000 | 3-year linear vesting |
| Advisors | 5% | 5,000,000 | 1-year linear vesting |
| Liquidity | 5% | 5,000,000 | Locked for 1 year |

## Emission Schedule

The token will follow a deflationary model with:
- Initial supply: 100,000,000 tokens
- Maximum supply: 100,000,000 tokens (no additional minting)
- Burn mechanism: 2% of transaction fees

## Governance

- Token holders can vote on proposals
- Voting power is proportional to token holdings
- Minimum holding period of 30 days required to vote
- Proposals require 60% majority to pass

## Economic Sustainability

The project will maintain economic sustainability through:
1. Transaction fees (2% total)
2. Premium service fees
3. Partnership revenue sharing
4. Treasury management`,
      usage: {
        prompt_tokens: 550,
        completion_tokens: 350
      }
    };
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error(`Claude API error: ${error.message}`);
  }
}