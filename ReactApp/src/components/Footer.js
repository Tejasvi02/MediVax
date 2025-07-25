import React from 'react';

const Footer = () => (
  <footer className="bg-light py-3 mt-auto">
    <div className="container text-center">
      <span className="text-muted">© {new Date().getFullYear()} MediVax. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;