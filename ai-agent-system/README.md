# AI Agent System

A multi-agent AI system with specialized agents that share context and work together to solve complex tasks.

## Features

- **Multiple Specialized Agents**:
  - **Whitepaper Agent**: Creates comprehensive, professional whitepapers for blockchain and AI projects
  - **Dev Agent**: Specializes in technical development and code generation
  - **Tokenomics Agent**: Designs token economics and distribution models

- **Shared Context**: All agents share a common context, allowing for cohesive multi-agent interactions

- **Claude 4 Sonnet Integration**: Powered by Anthropic's Claude 4 Sonnet via OpenHands

- **Clean UI**: React-based frontend with markdown rendering and syntax highlighting

## Architecture

### Frontend
- React application with context API for state management
- Agent selection interface
- Prompt input area
- Markdown-based response display
- Context management controls

### Backend
- Node.js/Express server
- Agent workflow management
- Shared context storage
- Claude API integration via OpenHands
- Validation and error handling

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-agent-system.git
cd ai-agent-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```
PORT=12001
NODE_ENV=development
CLAUDE_API_KEY=your_claude_api_key
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:12000
```

## Usage

1. Select an agent type (Whitepaper, Dev, or Tokenomics)
2. Enter your prompt in the input area
3. Submit the prompt to receive a response
4. View and manage the shared context in the context panel

## License

This project is licensed under the MIT License - see the LICENSE file for details.