import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} AI Agent System. All rights reserved.</p>
      </div>
      <style jsx>{`
        .footer {
          background-color: white;
          padding: 1.5rem 0;
          margin-top: 2rem;
          text-align: center;
          border-top: 1px solid var(--border-color);
        }
        
        .footer p {
          margin: 0;
          color: var(--secondary-color);
        }
      `}</style>
    </footer>
  );
};

export default Footer;