import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <a href="https://www.openbrewerydb.org" target="_blank" rel="noopener noreferrer">
            Open Brewery DB
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;