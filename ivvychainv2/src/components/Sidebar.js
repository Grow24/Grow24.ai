import React, { useState } from 'react';

const Sidebar = ({ activePage, setActivePage, collapsed = false, onToggle }) => {
  const [expandedSections, setExpandedSections] = useState({
    evps: false,
    who: false,
    what: false,
    how: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    {
      id: 'home',
      label: 'HOME',
      icon: 'fa-home',
      href: '#shiny-tab-home',
      hasSubmenu: false,
    },
    {
      id: 'business-insights',
      label: 'Business Insights :',
      icon: 'fa-chart-bar',
      href: '#shiny-tab-BI',
      hasSubmenu: false,
    },
    {
      id: 'evps',
      label: 'EVPS',
      icon: 'fa-file-alt',
      href: '#shiny-tab-evps',
      hasSubmenu: true,
      submenu: [
        { id: 'business-performance', label: 'Business Performance', href: '#shiny-tab-evps_bp' },
        { id: 'environment', label: 'Environment', href: '#shiny-tab-evps_env' },
      ],
    },
    {
      id: 'who',
      label: 'WHO',
      icon: 'fa-question-circle',
      href: '#shiny-tab-who',
      hasSubmenu: true,
      submenu: [
        { id: 'accounts', label: 'Accounts', href: '#shiny-tab-acc' },
        { id: 'channel-partners', label: 'Channel Partners', href: '#shiny-tab-cp' },
        { id: 'consumers', label: 'Consumers', href: '#shiny-tab-cons' },
        { id: 'leads', label: 'Leads', href: '#shiny-tab-leads' },
        { id: 'segments', label: 'Segments', href: '#shiny-tab-sg' },
      ],
    },
    {
      id: 'what',
      label: 'WHAT',
      icon: 'fa-question-circle',
      href: '#shiny-tab-what',
      hasSubmenu: true,
      submenu: [
        { id: 'industry-group', label: 'Industry Group', href: '#shiny-tab-subitem1' },
        { id: 'product-group', label: 'Product Group', href: '#shiny-tab-sb3' },
        { id: 'territories', label: 'Territories', href: '#shiny-tab-subitem2' },
      ],
    },
    {
      id: 'how',
      label: 'HOW',
      icon: 'fa-question-circle',
      href: '#shiny-tab-how',
      hasSubmenu: true,
      submenu: [
        { id: 'employee', label: 'Employee', href: '#shiny-tab-employee' },
        { id: 'channel', label: 'Channel', href: '#shiny-tab-channel' },
        { id: 'campaign', label: 'Campaign', href: '#shiny-tab-campaign' },
      ],
    },
    {
      id: 'separator-1',
      type: 'separator',
    },
    {
      id: 'market-mix',
      label: 'Market Mix Modeling',
      icon: 'fa-external-link-alt',
      href: 'https://ivychain.shinyapps.io/marketmixmodeling/',
      external: true,
    },
    {
      id: 'bayesian',
      label: 'Bayesian Network',
      icon: 'fa-external-link-alt',
      href: 'http://166.62.86.154:3838/app/BayesianNetwork-master/inst/bn/',
      external: true,
    },
    {
      id: 'campaign-planner',
      label: 'Campaign Planner',
      icon: 'fa-external-link-alt',
      href: 'http://166.62.86.154:3838/app/CampaignPlanner_v3-master/',
      external: true,
    },
    {
      id: 'separator-2',
      type: 'separator',
    },
    {
      id: 'workbook',
      label: 'Workbook',
      icon: 'fa-book',
      href: '#shiny-tab-workbook',
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: 'fa-images',
      href: '#shiny-tab-gallery',
    },
  ];

  const handleItemClick = (item) => {
    if (item.external) {
      window.open(item.href, '_blank');
    } else if (item.hasSubmenu) {
      toggleSection(item.id);
    } else {
      setActivePage(item.id);
    }
  };

  const isActive = (itemId) => {
    if (itemId === activePage) return true;
    const item = menuItems.find(m => m.id === itemId);
    if (item?.submenu) {
      return item.submenu.some(sub => sub.id === activePage);
    }
    return false;
  };

  return (
    <>
      {/* Hamburger Toggle Button - Fixed on left edge, outside sidebar */}
      {onToggle && (
                <button
          onClick={onToggle}
          className="sidebar-toggle-btn bg-blue-600 text-white p-2 fixed rounded-r-lg focus:outline-none z-40 hover:bg-blue-700 transition-colors"
          style={{ 
            width: '40px', 
            height: '40px',
            top: '50px',
            left: collapsed ? '0' : '250px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
            transition: 'left 0.3s ease-in-out'
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i className="fa fa-bars"></i>
                </button>
      )}

      <aside 
        className={`main-sidebar sidebar-dark-primary elevation-4 bg-gray-800 text-white h-screen flex flex-col fixed left-0 top-12 z-30 transition-all duration-300 ${
          collapsed ? 'sidebar-collapse' : ''
        }`}
        style={{ width: collapsed ? '50px' : '250px', top: '50px' }}
      >
        {/* Brand Logo */}
        <div className="brand-link bg-blue-600 flex items-center justify-center transition-all" style={{ padding: collapsed ? '8px' : '16px' }}>
          {!collapsed ? (
            <span className="brand-text font-weight-light text-white text-lg font-semibold">
              IVYCHAIN
            </span>
          ) : (
            <i className="fa fa-home text-white text-lg"></i>
          )}
        </div>

      {/* Sidebar Menu */}
      <nav className="mt-2 flex-1 overflow-y-auto">
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
          {menuItems.map((item) => {
            if (item.type === 'separator') {
              return <li key={item.id} className={`nav-header my-2 ${collapsed ? 'hidden' : ''}`}></li>;
            }

            const active = isActive(item.id);
            const expanded = expandedSections[item.id];

            return (
              <li
                key={item.id}
                className={`nav-item ${item.hasSubmenu ? 'has-treeview' : ''} ${expanded ? 'menu-open' : ''} ${active ? 'active' : ''}`}
              >
                <a
                  href={item.href || '#'}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item);
                  }}
                  className={`nav-link ${active ? 'active' : ''} ${expanded ? 'menu-open' : ''} ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <i className={`nav-icon fa ${item.icon}`}></i>
                  {!collapsed && (
                    <p>
                      {item.label}
                      {item.hasSubmenu && (
                        <i className={`right fa fa-angle-left transition-transform ${expanded ? 'rotate-90' : ''}`}></i>
                      )}
                    </p>
                  )}
                </a>
                {item.hasSubmenu && item.submenu && expanded && !collapsed && (
                  <ul className="nav nav-treeview ml-4">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.id} className="nav-item">
                        <a
                          href={subItem.href || '#'}
                          onClick={(e) => {
                            e.preventDefault();
                            setActivePage(subItem.id);
                          }}
                          className={`nav-link ${activePage === subItem.id ? 'active' : ''}`}
                        >
                          <i className="fa fa-circle nav-icon text-xs"></i>
                          <p>{subItem.label}</p>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;
