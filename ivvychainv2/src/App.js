import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import HighlightsModal from './components/HighlightsModal';
import LoginModal from './components/LoginModal';

// Pages
import BusinessPerformance from './pages/BusinessPerformance';
import Environment from './pages/Environment';
import BusinessInsights from './pages/BusinessInsights';
import HomePage from './pages/HomePage';

// WHO Pages
import Accounts from './pages/who/Accounts';
import ChannelPartners from './pages/who/ChannelPartners';
import Consumers from './pages/who/Consumers';
import Leads from './pages/who/Leads';
import Segments from './pages/who/Segments';

// WHAT Pages
import IndustryGroup from './pages/what/IndustryGroup';
import ProductGroup from './pages/what/ProductGroup';
import Territories from './pages/what/Territories';

// HOW Pages
import Employee from './pages/how/Employee';
import Channel from './pages/how/Channel';
import Campaign from './pages/how/Campaign';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const [showHighlights, setShowHighlights] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [rightSidebarTab, setRightSidebarTab] = useState('chat'); // 'chat' | 'annotations' | null

  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('ivychain_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setShowLogin(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    localStorage.setItem('ivychain_authenticated', 'true');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'business-insights':
        return <BusinessInsights />;
      case 'business-performance':
        return <BusinessPerformance />;
      case 'environment':
        return <Environment />;

      // WHO pages
      case 'accounts':
        return <Accounts />;
      case 'channel-partners':
        return <ChannelPartners />;
      case 'consumers':
        return <Consumers />;
      case 'leads':
        return <Leads />;
      case 'segments':
        return <Segments />;

      // WHAT pages
      case 'industry-group':
        return <IndustryGroup />;
      case 'product-group':
        return <ProductGroup />;
      case 'territories':
        return <Territories />;

      // HOW pages
      case 'employee':
        return <Employee />;
      case 'channel':
        return <Channel />;
      case 'campaign':
        return <Campaign />;

      default:
        return <HomePage />;
    }
  };

  const handleRightSidebarTabClick = (tab) => {
    if (rightSidebarTab === tab && rightSidebarOpen) {
      // Close if clicking the same tab
      setRightSidebarOpen(false);
      setRightSidebarTab(null);
    } else {
      // Open and switch to the clicked tab
      setRightSidebarOpen(true);
      setRightSidebarTab(tab);
    }
  };

  const handleRightSidebarToggle = () => {
    setRightSidebarOpen(!rightSidebarOpen);
    if (rightSidebarOpen) {
      // Keep the active tab when closing, so it can be reopened
      // setRightSidebarTab(null);
    }
  };

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="wrapper bg-gray-100 min-h-screen">
        <LoginModal isOpen={showLogin} onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className={`wrapper bg-gray-100 min-h-screen ${sidebarCollapsed ? 'sidebar-collapse' : ''}`}>
      {/* Header */}
      <Header
        onHighlightsClick={() => setShowHighlights(true)}
        onIndustryChange={() => { }}
      />

      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content */}
        <div
          className="content-wrapper flex-1 transition-all duration-300"
          style={{
            marginTop: '50px',
            marginLeft: sidebarCollapsed ? '50px' : '250px',
            marginRight: rightSidebarOpen ? '320px' : '48px'
          }}
        >
          <div className="content">
            <div className="container-fluid p-4">
              {renderPage()}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar
          isOpen={rightSidebarOpen}
          activeTab={rightSidebarTab}
          onTabClick={handleRightSidebarTabClick}
          onToggle={handleRightSidebarToggle}
        />
      </div>

      {/* Highlights Modal */}
      <HighlightsModal
        isOpen={showHighlights}
        onClose={() => setShowHighlights(false)}
      />
    </div>
  );
}

export default App;
