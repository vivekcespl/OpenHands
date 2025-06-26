/**
 * OpenHands Claude API Integration
 * 
 * This module provides Claude API integration using OpenHands' internal LLM interface
 * instead of making direct API calls to Anthropic. This leverages the existing
 * OpenHands configuration and setup.
 */

const { spawn } = require('child_process');
const path = require('path');

/**
 * Call Claude API through OpenHands Python interface
 * @param {string} systemPrompt - The system prompt for the agent
 * @param {string} userPrompt - The user's prompt/question
 * @param {Object} options - Optional parameters
 * @param {string} options.model - Claude model to use (default: claude-3-5-sonnet-20241022)
 * @param {number} options.maxTokens - Maximum tokens to generate (default: 4000)
 * @param {number} options.temperature - Temperature for generation (default: 0.7)
 * @returns {Promise<Object>} Response object with content and metadata
 */
async function callClaudeAPI(systemPrompt, userPrompt, options = {}) {
  const {
    model = 'claude-3-5-sonnet-20241022',
    maxTokens = 4000,
    temperature = 0.7
  } = options;

  return new Promise((resolve, reject) => {
    // Create a Python script that uses OpenHands LLM interface
    // We'll pass the prompts as command line arguments to avoid string escaping issues
    const pythonScript = `
import sys
import json
import os
from openhands.llm import LLM
from openhands.core.config.llm_config import LLMConfig
from openhands.core.message import Message, TextContent

def call_claude_via_openhands():
    try:
        # Get prompts from command line arguments
        system_prompt = sys.argv[1] if len(sys.argv) > 1 else ""
        user_prompt = sys.argv[2] if len(sys.argv) > 2 else ""
        
        # Create Claude configuration
        config = LLMConfig(
            model="${model}",
            temperature=${temperature},
            max_output_tokens=${maxTokens}
        )
        
        # Create LLM instance
        llm = LLM(config=config)
        
        # Create messages
        messages = []
        
        # Add system message if provided
        if system_prompt.strip():
            system_content = TextContent(text=system_prompt)
            system_message = Message(role="system", content=[system_content])
            messages.append(system_message)
        
        # Add user message
        user_content = TextContent(text=user_prompt)
        user_message = Message(role="user", content=[user_content])
        messages.append(user_message)
        
        # Format messages for LLM
        formatted_messages = llm.format_messages_for_llm(messages)
        
        # Call completion
        response = llm.completion(messages=formatted_messages)
        
        # Extract response content
        if hasattr(response, 'choices') and len(response.choices) > 0:
            content = response.choices[0].message.content
            
            # Extract usage information if available
            usage = {}
            if hasattr(response, 'usage'):
                usage = {
                    'prompt_tokens': getattr(response.usage, 'prompt_tokens', 0),
                    'completion_tokens': getattr(response.usage, 'completion_tokens', 0),
                    'total_tokens': getattr(response.usage, 'total_tokens', 0)
                }
            
            result = {
                'content': content,
                'usage': usage,
                'model': "${model}",
                'success': True
            }
        else:
            result = {
                'content': str(response),
                'usage': {},
                'model': "${model}",
                'success': True
            }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'error': str(e),
            'success': False,
            'model': "${model}"
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    call_claude_via_openhands()
`;

    // Write the Python script to a temporary file
    const fs = require('fs');
    const os = require('os');
    const tempFile = path.join(os.tmpdir(), `openhands_claude_${Date.now()}.py`);
    
    fs.writeFileSync(tempFile, pythonScript);

    // Execute the Python script with prompts as arguments
    const pythonProcess = spawn('python', [tempFile, systemPrompt || '', userPrompt || ''], {
      env: {
        ...process.env,
        PYTHONPATH: '/openhands/code'
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      // Clean up temporary file
      try {
        fs.unlinkSync(tempFile);
      } catch (e) {
        console.warn('Could not delete temporary file:', tempFile);
      }

      if (code === 0) {
        try {
          const result = JSON.parse(stdout.trim());
          if (result.success) {
            resolve({
              content: result.content,
              usage: result.usage,
              model: result.model
            });
          } else {
            reject(new Error(result.error || 'Unknown error from OpenHands Claude API'));
          }
        } catch (parseError) {
          reject(new Error(`Failed to parse response: ${parseError.message}. Output: ${stdout}`));
        }
      } else {
        reject(new Error(`Python process failed with code ${code}. Error: ${stderr}. Output: ${stdout}`));
      }
    });

    pythonProcess.on('error', (error) => {
      // Clean up temporary file
      try {
        fs.unlinkSync(tempFile);
      } catch (e) {
        console.warn('Could not delete temporary file:', tempFile);
      }
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
}

/**
 * Validate OpenHands Claude API connectivity
 * @returns {Promise<boolean>} True if API is accessible, false otherwise
 */
async function validateOpenHandsClaudeAPI() {
  try {
    const response = await callClaudeAPI(
      'You are a helpful assistant.',
      'Please respond with just the word "OK" to confirm you are working.',
      { maxTokens: 10 }
    );
    
    return response.content && response.content.toLowerCase().includes('ok');
  } catch (error) {
    console.error('OpenHands Claude API validation failed:', error.message);
    return false;
  }
}

/**
 * Get OpenHands Claude API status and configuration
 * @returns {Promise<Object>} Status object with configuration details
 */
async function getOpenHandsClaudeStatus() {
  try {
    const response = await callClaudeAPI(
      'You are a helpful assistant.',
      'Please respond with a brief status message.',
      { maxTokens: 50 }
    );
    
    return {
      status: 'connected',
      model: response.model,
      message: 'OpenHands Claude API is working correctly',
      lastResponse: response.content.substring(0, 100)
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      suggestion: 'Check that ANTHROPIC_API_KEY is set in OpenHands environment'
    };
  }
}

module.exports = {
  callClaudeAPI,
  validateOpenHandsClaudeAPI,
  getOpenHandsClaudeStatus
};