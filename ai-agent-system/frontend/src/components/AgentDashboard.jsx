import React from 'react';
import AgentSelector from './AgentSelector';
import PromptInput from './PromptInput';
import ResponseDisplay from './ResponseDisplay';
import ContextManager from './ContextManager';

const AgentDashboard = () => {
  return (
    <div className="agent-dashboard">
      <div className="dashboard-header">
        <h1>AI Agent System</h1>
        <p>
          Interact with specialized AI agents for different tasks. Each agent has unique capabilities
          and they share context to provide a cohesive experience.
        </p>
      </div>
      
      <div className="dashboard-grid">
        <div className="main-content">
          <AgentSelector />
          <PromptInput />
          <ResponseDisplay />
        </div>
        <div className="side-content">
          <ContextManager />
        </div>
      </div>
      <style jsx>{`
        .agent-dashboard {
          padding: 2rem 0;
        }
        
        .dashboard-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .dashboard-header h1 {
          margin-bottom: 1rem;
          color: var(--primary-color);
        }
        
        .dashboard-header p {
          max-width: 800px;
          margin: 0 auto;
          color: var(--secondary-color);
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        
        @media (max-width: 992px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentDashboard;