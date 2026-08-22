import React, { useState } from 'react';
import './TopNav.css';

export default function TopNav() {
  const [activeTab, setActiveTab] = useState('Projects');
  const tabs = ['Projects', 'Assets', 'Team', 'Library'];

  return (
    <div className="aai-topnav glass-panel">
      <div className="aai-topnav__left">
        <button 
          className="aai-topnav__cineai-link"
          onClick={() => { window.location.hash = '#cineai'; }}
          title="Return to CineAI Hub"
        >
          <span className="cineai-dot"></span>
          <span>CineAI Hub</span>
        </button>
        <div className="aai-topnav__divider"></div>
        {tabs.map((tab) => (
          <button 
            key={tab}
            className={`aai-topnav__link ${activeTab === tab ? 'aai-topnav__link--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && <span className="aai-topnav__active-bubble"></span>}
          </button>
        ))}
      </div>
      <div className="aai-topnav__right">
        <button 
          className="aai-topnav__back-pill"
          onClick={() => { window.location.hash = '#cineai'; }}
          title="Back to CineAI Hub"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to CineAI</span>
        </button>
        <button className="aai-topnav__bell" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="aai-topnav__bell-indicator"></span>
        </button>
        <div className="aai-topnav__profile">
          <img src="https://i.pravatar.cc/150?img=32" alt="Profile" />
        </div>
      </div>
    </div>
  );
}
