import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
const AgentContext = createContext();

// API base URL
const API_URL = 'http://localhost:12001/api';

export const AgentContextProvider = ({ children }) => {
  // State
  const [selectedAgent, setSelectedAgent] = useState('whitepaper');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sharedContext, setSharedContext] = useState({
    history: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: 1
    }
  });

  // Fetch shared context on mount
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const response = await axios.get(`${API_URL}/agents/context`);
        setSharedContext(response.data);
      } catch (error) {
        console.error('Error fetching context:', error);
        setError('Failed to load context. Please refresh the page.');
      }
    };

    fetchContext();
  }, []);

  // Process prompt with selected agent
  const processPrompt = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/agents/process`, {
        agentType: selectedAgent,
        prompt,
        options: {}
      });

      setResponse(response.data.result);
      
      // Update local context
      const updatedContext = await axios.get(`${API_URL}/agents/context`);
      setSharedContext(updatedContext.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error processing prompt:', error);
      setError(error.response?.data?.error || 'Failed to process prompt');
      setLoading(false);
    }
  };

  // Clear context
  const clearContext = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_URL}/agents/context`);
      
      // Update local context
      const updatedContext = await axios.get(`${API_URL}/agents/context`);
      setSharedContext(updatedContext.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error clearing context:', error);
      setError(error.response?.data?.error || 'Failed to clear context');
      setLoading(false);
    }
  };

  // Context value
  const contextValue = {
    selectedAgent,
    setSelectedAgent,
    prompt,
    setPrompt,
    response,
    setResponse,
    loading,
    error,
    setError,
    sharedContext,
    processPrompt,
    clearContext
  };

  return (
    <AgentContext.Provider value={contextValue}>
      {children}
    </AgentContext.Provider>
  );
};

// Custom hook to use the agent context
export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgentContext must be used within an AgentContextProvider');
  }
  return context;
};