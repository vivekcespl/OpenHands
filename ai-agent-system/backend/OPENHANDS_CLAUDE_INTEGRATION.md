# OpenHands Claude API Integration

This document describes the implementation of Claude API integration through OpenHands' internal LLM interface instead of direct Anthropic API calls.

## Overview

The OpenHands Claude API integration leverages the existing OpenHands LLM infrastructure to make Claude API calls. This approach provides several benefits:

- **Unified Configuration**: Uses OpenHands' existing LLM configuration system
- **Consistent Error Handling**: Leverages OpenHands' built-in error handling and retry logic
- **Better Integration**: Works seamlessly with the OpenHands environment
- **Simplified Setup**: No need for separate API key management

## Architecture

### Components

1. **openhandsClaudeAPI.js**: Main integration module that creates Python scripts to call OpenHands LLM interface
2. **Agent Services**: Updated to use OpenHands Claude API instead of direct Anthropic calls
3. **Health Check**: Endpoint to verify OpenHands Claude API connectivity

### Flow

```
Node.js Backend → Python Script → OpenHands LLM → LiteLLM → Anthropic Claude API
```

1. Node.js backend receives API request
2. Creates temporary Python script with OpenHands LLM calls
3. Executes Python script with prompts as command-line arguments
4. Python script uses OpenHands LLM interface to call Claude
5. Response is returned through the chain back to the client

## Configuration

### Environment Variables

The integration requires the `ANTHROPIC_API_KEY` environment variable to be set in the OpenHands environment:

```bash
export ANTHROPIC_API_KEY="your-anthropic-api-key-here"
```

### Model Configuration

Default configuration:
- **Model**: `claude-3-5-sonnet-20241022`
- **Temperature**: `0.7`
- **Max Tokens**: `4000`

These can be customized when calling the API:

```javascript
const response = await callClaudeAPI(
  systemPrompt,
  userPrompt,
  {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2000,
    temperature: 0.5
  }
);
```

## API Reference

### callClaudeAPI(systemPrompt, userPrompt, options)

Main function to call Claude through OpenHands.

**Parameters:**
- `systemPrompt` (string): System prompt for the agent
- `userPrompt` (string): User's prompt/question
- `options` (object): Optional configuration
  - `model` (string): Claude model to use
  - `maxTokens` (number): Maximum tokens to generate
  - `temperature` (number): Temperature for generation

**Returns:**
Promise resolving to:
```javascript
{
  content: "Claude's response",
  usage: {
    prompt_tokens: 123,
    completion_tokens: 456,
    total_tokens: 579
  },
  model: "claude-3-5-sonnet-20241022"
}
```

### validateOpenHandsClaudeAPI()

Validates that the OpenHands Claude API is accessible.

**Returns:**
Promise resolving to boolean indicating if API is working.

### getOpenHandsClaudeStatus()

Gets detailed status information about the OpenHands Claude API.

**Returns:**
Promise resolving to status object:
```javascript
{
  status: "connected" | "error",
  message: "Status message",
  model: "claude-3-5-sonnet-20241022",
  lastResponse: "Sample response...",
  suggestion: "Error resolution suggestion" // only on error
}
```

## Usage Examples

### Basic Usage

```javascript
const { callClaudeAPI } = require('./src/utils/openhandsClaudeAPI');

const response = await callClaudeAPI(
  'You are a helpful assistant.',
  'What is the capital of France?'
);

console.log(response.content); // "The capital of France is Paris."
```

### With Custom Options

```javascript
const response = await callClaudeAPI(
  'You are a technical writer.',
  'Explain quantum computing in simple terms.',
  {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1000,
    temperature: 0.3
  }
);
```

### Health Check

```javascript
const { getOpenHandsClaudeStatus } = require('./src/utils/openhandsClaudeAPI');

const status = await getOpenHandsClaudeStatus();
if (status.status === 'connected') {
  console.log('Claude API is working!');
} else {
  console.error('Claude API error:', status.message);
}
```

## Error Handling

The integration provides comprehensive error handling:

### Common Errors

1. **Missing API Key**
   ```
   Error: litellm.AuthenticationError: Missing Anthropic API Key
   Solution: Set ANTHROPIC_API_KEY environment variable
   ```

2. **Invalid Model**
   ```
   Error: Model not found
   Solution: Use a valid Claude model name
   ```

3. **Rate Limiting**
   ```
   Error: Rate limit exceeded
   Solution: Implement retry logic or reduce request frequency
   ```

### Error Response Format

```javascript
{
  error: "Error message",
  success: false,
  model: "claude-3-5-sonnet-20241022"
}
```

## Testing

### Manual Testing

1. **Start the server:**
   ```bash
   cd ai-agent-system/backend
   npm start
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:12001/health/claude
   ```

3. **Test agent endpoint:**
   ```bash
   curl -X POST http://localhost:12001/api/agents/process \
     -H "Content-Type: application/json" \
     -d '{
       "agentType": "whitepaper",
       "prompt": "Create a brief introduction",
       "options": {}
     }'
   ```

### Automated Testing

Run the integration test script:
```bash
node test-claude-integration.js
```

## Migration from Direct API

### Changes Made

1. **Updated imports** in all agent files:
   ```javascript
   // Before
   const { callClaudeAPI } = require('../../utils/claudeAPI');
   
   // After
   const { callClaudeAPI } = require('../../utils/openhandsClaudeAPI');
   ```

2. **Updated health check** in main server:
   ```javascript
   // Before
   const { validateClaudeAPI } = require('./utils/claudeAPI');
   
   // After
   const { validateOpenHandsClaudeAPI, getOpenHandsClaudeStatus } = require('./utils/openhandsClaudeAPI');
   ```

3. **Updated test script** to use new functions

### API Compatibility

The new OpenHands integration maintains the same API interface as the direct Anthropic integration, so no changes are needed in:
- Agent logic
- Response handling
- Error handling patterns

## Troubleshooting

### Common Issues

1. **Python script execution fails**
   - Check that Python is available in PATH
   - Verify PYTHONPATH is set to `/openhands/code`
   - Ensure OpenHands modules are properly installed

2. **Authentication errors**
   - Verify ANTHROPIC_API_KEY is set in environment
   - Check API key is valid and has sufficient credits
   - Ensure key has access to the specified Claude model

3. **Timeout issues**
   - Increase timeout values for long-running requests
   - Check network connectivity
   - Verify OpenHands service is running

### Debug Mode

Enable debug logging by setting environment variable:
```bash
export DEBUG=openhands:claude
```

## Performance Considerations

### Overhead

The OpenHands integration adds minimal overhead:
- Python script creation: ~1ms
- Process spawning: ~10-50ms
- OpenHands LLM initialization: ~100-200ms (cached after first call)

### Optimization

- Python scripts are temporary and cleaned up automatically
- LLM instances are created per request (stateless)
- Consider implementing connection pooling for high-volume usage

## Security

### Best Practices

1. **API Key Management**: Store API keys securely in environment variables
2. **Input Validation**: Validate prompts before sending to Claude
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Logging**: Log requests for monitoring and debugging (without sensitive data)

### Temporary Files

- Python scripts are created in system temp directory
- Files are automatically cleaned up after execution
- Unique filenames prevent conflicts

## Future Enhancements

### Planned Improvements

1. **Connection Pooling**: Reuse LLM instances for better performance
2. **Caching**: Cache responses for identical prompts
3. **Streaming**: Support streaming responses for real-time applications
4. **Metrics**: Add detailed metrics and monitoring
5. **Configuration**: Support for more OpenHands LLM configuration options

### Extension Points

The integration is designed to be extensible:
- Support for other LLM providers through OpenHands
- Custom message formatting
- Advanced error recovery strategies
- Integration with OpenHands agent framework