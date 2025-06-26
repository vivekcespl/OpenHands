# Claude API Integration via OpenHands

This document describes the Claude API integration implemented for the AI Agent System using OpenHands' internal LLM interface.

## Overview

The Claude API integration has been implemented using OpenHands' LLM class instead of direct Anthropic API calls. This provides better integration with the existing OpenHands environment and configuration. The integration supports all three specialized agents:

- **Whitepaper Agent**: Specializes in creating comprehensive whitepapers
- **Dev Agent**: Focuses on technical development and code generation  
- **Tokenomics Agent**: Handles token economics and distribution models

## Implementation Details

### Core Components

1. **OpenHands Claude API Utility** (`src/utils/openhandsClaudeAPI.js`)
   - Leverages OpenHands' LLM class for Claude API calls
   - Uses Python scripts to interface with OpenHands LLM
   - Handles authentication through OpenHands configuration
   - Uses Claude 3.5 Sonnet model by default
   - Configurable parameters (model, max_tokens, temperature)

2. **Agent Integration**
   - All three agent files updated to use the OpenHands Claude API
   - Maintained existing agent-specific system prompts and context handling
   - Seamless migration from direct API calls

3. **Health Check Endpoint**
   - Updated `/health/claude` endpoint to validate OpenHands Claude API connectivity
   - Provides detailed status information and error diagnostics

### Architecture

```
Node.js Backend → Python Script → OpenHands LLM → LiteLLM → Anthropic Claude API
```

### Configuration

The integration requires a valid Claude API key set in the environment:

```bash
CLAUDE_API_KEY=your_anthropic_api_key_here
```

### API Specifications

**Model**: `claude-3-5-sonnet-20241022` (Latest Claude 3.5 Sonnet)
**Max Tokens**: 4000 (configurable)
**Temperature**: 0.7 (configurable)
**Timeout**: 60 seconds (configurable)

### Error Handling

The integration includes comprehensive error handling for:
- Invalid API keys (401)
- Rate limiting (429) 
- Bad requests (400)
- Network timeouts
- General API errors

### Usage Examples

#### Health Check
```bash
curl -X GET http://localhost:12001/health/claude
```

#### Process with Whitepaper Agent
```bash
curl -X POST http://localhost:12001/api/agents/process \
  -H "Content-Type: application/json" \
  -d '{
    "agentType": "whitepaper",
    "prompt": "Create a brief introduction for a blockchain project whitepaper",
    "options": {}
  }'
```

#### Process with Dev Agent
```bash
curl -X POST http://localhost:12001/api/agents/process \
  -H "Content-Type: application/json" \
  -d '{
    "agentType": "dev",
    "prompt": "Create a smart contract for token distribution",
    "options": {}
  }'
```

#### Process with Tokenomics Agent
```bash
curl -X POST http://localhost:12001/api/agents/process \
  -H "Content-Type: application/json" \
  -d '{
    "agentType": "tokenomics",
    "prompt": "Design a tokenomics model for a DeFi protocol",
    "options": {}
  }'
```

### Response Format

All agents return responses in the following format:

```json
{
  "result": {
    "content": "Generated content in Markdown format",
    "format": "markdown",
    "metadata": {
      "agentType": "whitepaper|dev|tokenomics",
      "timestamp": "2025-06-26T12:00:00.000Z",
      "promptTokens": 500,
      "completionTokens": 300
    }
  },
  "contextVersion": 2
}
```

### Context Management

The system maintains a shared context across all agents, including:
- Interaction history
- Agent responses
- Metadata (timestamps, versions)

This allows agents to reference previous interactions and maintain continuity across conversations.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd ai-agent-system/backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Update .env file with your Claude API key
   CLAUDE_API_KEY=your_actual_api_key_here
   PORT=12001
   NODE_ENV=development
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Verify Integration**
   ```bash
   curl -X GET http://localhost:12001/health/claude
   ```

## Security Considerations

- API keys are loaded from environment variables
- No API keys are logged or exposed in responses
- Proper error handling prevents sensitive information leakage
- Request timeouts prevent hanging connections

## Monitoring

- Use the `/health/claude` endpoint for API connectivity monitoring
- Check server logs for detailed error information
- Monitor token usage through response metadata

## Troubleshooting

### Common Issues

1. **Invalid API Key Error**
   - Verify `CLAUDE_API_KEY` is set correctly in `.env`
   - Ensure the API key is valid and active

2. **Rate Limiting**
   - Implement request throttling if needed
   - Monitor usage against Anthropic's rate limits

3. **Timeout Errors**
   - Increase timeout value in options if needed
   - Check network connectivity

4. **Model Not Found**
   - Verify the model name is correct
   - Update to a supported model version if needed

## Future Enhancements

- Add support for streaming responses
- Implement request caching
- Add metrics and analytics
- Support for different Claude models per agent
- Implement retry logic with exponential backoff