import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAgentContext } from '../context/AgentContext';

const ResponseDisplay = () => {
  const { response, selectedAgent } = useAgentContext();

  if (!response) {
    return (
      <div className="response-display empty">
        <div className="card">
          <h2>Response</h2>
          <p className="empty-message">
            Submit a prompt to see the response from the {getAgentName(selectedAgent)} here.
          </p>
        </div>
        <style jsx>{`
          .response-display {
            margin-bottom: 2rem;
          }
          
          .empty-message {
            color: var(--secondary-color);
            font-style: italic;
            text-align: center;
            padding: 2rem 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="response-display">
      <div className="card">
        <div className="response-header">
          <h2>Response from {getAgentName(selectedAgent)}</h2>
          <div className="response-meta">
            <span className="timestamp">
              {new Date(response.metadata.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="markdown-content">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {response.content}
          </ReactMarkdown>
        </div>
      </div>
      <style jsx>{`
        .response-display {
          margin-bottom: 2rem;
        }
        
        .response-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .response-meta {
          font-size: 0.9rem;
          color: var(--secondary-color);
        }
        
        .timestamp {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background-color: var(--light-color);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

function getAgentName(agentType) {
  switch (agentType) {
    case 'whitepaper':
      return 'Whitepaper Agent';
    case 'dev':
      return 'Dev Agent';
    case 'tokenomics':
      return 'Tokenomics Agent';
    default:
      return 'Agent';
  }
}

export default ResponseDisplay;