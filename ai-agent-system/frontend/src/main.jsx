import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AgentContextProvider } from './context/AgentContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AgentContextProvider>
        <App />
      </AgentContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);