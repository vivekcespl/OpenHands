import React from 'react';
import { useAgentContext } from '../context/AgentContext';

const PromptInput = () => {
  const { prompt, setPrompt, processPrompt, loading, error } = useAgentContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    processPrompt();
  };

  return (
    <div className="prompt-input">
      <h2>Enter Your Prompt</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          rows={5}
          disabled={loading}
        ></textarea>
        <div className="button-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setPrompt('')}
            disabled={loading || !prompt.trim()}
          >
            Clear
          </button>
        </div>
      </form>
      <style jsx>{`
        .prompt-input {
          margin-bottom: 2rem;
        }
        
        .prompt-input h2 {
          margin-bottom: 1rem;
        }
        
        .form-control {
          margin-bottom: 1rem;
          resize: vertical;
        }
        
        .button-group {
          display: flex;
          gap: 1rem;
        }
        
        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default PromptInput;