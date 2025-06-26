const axios = require('axios');
require('dotenv').config();

/**
 * Claude API utility for making requests to Anthropic's Claude API
 */

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'; // Latest Claude 3.5 Sonnet model
const MAX_TOKENS = 4000;

/**
 * Make a request to the Claude API
 * @param {string} systemPrompt - The system prompt to set the agent's behavior
 * @param {string} userMessage - The user's message/prompt
 * @param {Object} options - Additional options for the API call
 * @returns {Promise<Object>} - The API response
 */
async function callClaudeAPI(systemPrompt, userMessage, options = {}) {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY environment variable is not set');
    }

    // Prepare the request payload
    const payload = {
      model: options.model || CLAUDE_MODEL,
      max_tokens: options.maxTokens || MAX_TOKENS,
      temperature: options.temperature || 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    };

    // Make the API request
    const response = await axios.post(CLAUDE_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      timeout: options.timeout || 60000 // 60 second timeout
    });

    // Extract the response content
    const content = response.data.content[0]?.text || '';
    
    return {
      content: content,
      usage: {
        prompt_tokens: response.data.usage?.input_tokens || 0,
        completion_tokens: response.data.usage?.output_tokens || 0,
        total_tokens: (response.data.usage?.input_tokens || 0) + (response.data.usage?.output_tokens || 0)
      },
      model: response.data.model,
      stop_reason: response.data.stop_reason
    };

  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);
    
    // Handle specific error types
    if (error.response?.status === 401) {
      throw new Error('Invalid Claude API key. Please check your CLAUDE_API_KEY environment variable.');
    } else if (error.response?.status === 429) {
      throw new Error('Claude API rate limit exceeded. Please try again later.');
    } else if (error.response?.status === 400) {
      throw new Error(`Claude API request error: ${error.response.data?.error?.message || 'Invalid request'}`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Claude API request timed out. Please try again.');
    } else {
      throw new Error(`Claude API error: ${error.message}`);
    }
  }
}

/**
 * Validate that the Claude API is properly configured
 * @returns {Promise<boolean>} - True if the API is configured correctly
 */
async function validateClaudeAPI() {
  try {
    const testResponse = await callClaudeAPI(
      'You are a helpful assistant.',
      'Please respond with just the word "OK" to confirm the API is working.',
      { maxTokens: 10 }
    );
    
    return testResponse.content.trim().toLowerCase().includes('ok');
  } catch (error) {
    console.error('Claude API validation failed:', error.message);
    return false;
  }
}

module.exports = {
  callClaudeAPI,
  validateClaudeAPI
};