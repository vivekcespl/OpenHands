import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>AI Agent System</h1>
          </Link>
          <nav className="nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <a href="https://github.com/yourusername/ai-agent-system" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <style jsx>{`
        .header {
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo h1 {
          font-size: 1.5rem;
          color: var(--primary-color);
          margin: 0;
        }
        
        .nav ul {
          display: flex;
          list-style: none;
        }
        
        .nav li {
          margin-left: 1.5rem;
        }
        
        .nav a {
          color: var(--text-color);
          font-weight: 500;
        }
        
        .nav a:hover {
          color: var(--primary-color);
        }
      `}</style>
    </header>
  );
};

export default Header;