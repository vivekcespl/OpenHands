import React from 'react';
import { useAgentContext } from '../context/AgentContext';

const AgentSelector = () => {
  const { selectedAgent, setSelectedAgent } = useAgentContext();

  const agents = [
    {
      id: 'whitepaper',
      name: 'Whitepaper Agent',
      description: 'Creates comprehensive, professional whitepapers for blockchain and AI projects',
      icon: '📄'
    },
    {
      id: 'dev',
      name: 'Dev Agent',
      description: 'Specializes in technical development and code generation',
      icon: '💻'
    },
    {
      id: 'tokenomics',
      name: 'Tokenomics Agent',
      description: 'Designs token economics and distribution models',
      icon: '📊'
    }
  ];

  return (
    <div className="agent-selector">
      <h2>Select an Agent</h2>
      <div className="agent-cards">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`agent-card ${selectedAgent === agent.id ? 'selected' : ''}`}
            onClick={() => setSelectedAgent(agent.id)}
          >
            <div className="agent-icon">{agent.icon}</div>
            <h3>{agent.name}</h3>
            <p>{agent.description}</p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .agent-selector {
          margin-bottom: 2rem;
        }
        
        .agent-selector h2 {
          margin-bottom: 1rem;
        }
        
        .agent-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .agent-card {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }
        
        .agent-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .agent-card.selected {
          border-color: var(--primary-color);
          box-shadow: 0 5px 15px rgba(74, 108, 247, 0.2);
        }
        
        .agent-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .agent-card h3 {
          margin-bottom: 0.5rem;
        }
        
        .agent-card p {
          color: var(--secondary-color);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default AgentSelector;