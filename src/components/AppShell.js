import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useDynamicConfig } from '../contexts/DynamicConfigContext';

function AppShell({ children, currentScreen, onNavigate, onLogout }) {
  const { config } = useDynamicConfig();

  return (
    <div className="app-shell">
      {/* Sidebar - Fixed Left */}
      <Sidebar activeItem={currentScreen} onNavigate={onNavigate} />
      
      {/* Main Content Area */}
      <div className="app-main">
        {/* Header - Fixed Top */}
        <Header onLogout={onLogout} />
        
        {/* Dynamic Content - Scrollable */}
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
