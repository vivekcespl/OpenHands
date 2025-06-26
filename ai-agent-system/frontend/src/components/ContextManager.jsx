import React, { useState } from 'react';
import { useAgentContext } from '../context/AgentContext';

const ContextManager = () => {
  const { sharedContext, clearContext, loading } = useAgentContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="context-manager">
      <div className="card">
        <div className="context-header">
          <h2>Shared Context</h2>
          <div className="context-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={toggleExpand}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={clearContext}
              disabled={loading || sharedContext.history.length === 0}
            >
              Clear Context
            </button>
          </div>
        </div>
        
        <div className="context-summary">
          <p>
            <strong>Context Version:</strong> {sharedContext.metadata.version}
          </p>
          <p>
            <strong>Last Updated:</strong>{' '}
            {new Date(sharedContext.metadata.lastUpdated).toLocaleString()}
          </p>
          <p>
            <strong>Interaction Count:</strong> {sharedContext.history.length}
          </p>
        </div>
        
        {isExpanded && sharedContext.history.length > 0 && (
          <div className="context-history">
            <h3>Interaction History</h3>
            {sharedContext.history.map((item, index) => (
              <div key={item.id} className="history-item">
                <div className="history-header">
                  <span className="agent-badge">{item.agentType}</span>
                  <span className="timestamp">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="history-content">
                  <div className="prompt">
                    <strong>Prompt:</strong>
                    <p>{item.prompt}</p>
                  </div>
                  <div className="response-summary">
                    <strong>Response:</strong>
                    <p>{summarizeResponse(item.response)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {isExpanded && sharedContext.history.length === 0 && (
          <div className="empty-history">
            <p>No interaction history yet.</p>
          </div>
        )}
      </div>
      <style jsx>{`
        .context-manager {
          margin-bottom: 2rem;
        }
        
        .context-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .context-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
        }
        
        .btn-danger {
          background-color: var(--error-color);
          border-color: var(--error-color);
          color: white;
        }
        
        .btn-danger:hover {
          background-color: #c82333;
          border-color: #bd2130;
        }
        
        .context-summary {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .context-summary p {
          margin-bottom: 0.5rem;
        }
        
        .context-history {
          margin-top: 1rem;
        }
        
        .history-item {
          margin-bottom: 1rem;
          padding: 1rem;
          background-color: var(--light-color);
          border-radius: 4px;
        }
        
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .agent-badge {
          background-color: var(--primary-color);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          text-transform: uppercase;
        }
        
        .timestamp {
          font-size: 0.75rem;
          color: var(--secondary-color);
        }
        
        .history-content {
          margin-top: 0.5rem;
        }
        
        .prompt, .response-summary {
          margin-bottom: 0.5rem;
        }
        
        .prompt p, .response-summary p {
          margin-top: 0.25rem;
          font-size: 0.9rem;
        }
        
        .empty-history {
          text-align: center;
          padding: 1rem;
          color: var(--secondary-color);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

function summarizeResponse(response) {
  if (!response || !response.content) return 'No response';
  
  // For brevity in the context display, limit the response summary
  const maxLength = 100;
  let content = response.content;
  
  if (content.length > maxLength) {
    content = content.substring(0, maxLength) + '...';
  }
  
  return content;
}

export default ContextManager;