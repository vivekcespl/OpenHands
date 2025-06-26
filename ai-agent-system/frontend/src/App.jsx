import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AgentDashboard from './components/AgentDashboard';
import { useAgentContext } from './context/AgentContext';

function App() {
  const { loading } = useAgentContext();

  return (
    <div className="app">
      <Header />
      <main className="container">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Processing your request...</p>
          </div>
        )}
        <Routes>
          <Route path="/" element={<AgentDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;