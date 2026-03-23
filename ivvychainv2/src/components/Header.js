import React, { useState } from 'react';

const Header = ({ onHighlightsClick, onIndustryChange, onSidebarToggle }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('1');
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  const industries = [
    { value: '1', label: 'Chemical Agriculture' },
    { value: '2', label: 'Other Industry' },
  ];

  const handleJumpToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="main-header bg-blue-600 text-white shadow-md fixed top-0 left-0 right-0 z-50" style={{ height: '50px' }}>
      <span className="logo"></span>
      <nav className="navbar navbar-static-top h-full" role="navigation">

        {/* Navbar Custom Menu (left side) */}
        <div className="navbar-custom-menu" style={{ float: 'left', marginLeft: '10px' }}>
          <ul className="nav navbar-nav"></ul>
        </div>

        {/* Navbar Custom Menu (right side) */}
        <div className="navbar-custom-menu" style={{ float: 'right' }}>
          <ul className="nav navbar-nav flex flex-row items-center h-full">
            {/* Jump to Top */}
            <li className="dropdown">
              <button
                type="button"
                onClick={handleJumpToTop}
                className="text-white hover:text-gray-200 px-3 py-2 h-full flex items-center action-button bg-transparent border-0 cursor-pointer"
                title="Jump to top"
              >
                <i className="fa fa-arrow-up"></i>
                Jump to top
              </button>
            </li>

            {/* Industry Selector */}
            <li className="dropdown relative" id="1">
              <button
                type="button"
                onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                className="dropdown-toggle text-white hover:text-gray-200 px-3 py-2 h-full flex items-center relative bg-transparent border-0 cursor-pointer"
                data-toggle="dropdown"
              >
                Select Industry
                <span className="badge bg-red-500 text-white text-xs ml-2 rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedIndustry}
                </span>
              </button>
              {showIndustryDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowIndustryDropdown(false)}
                  ></div>
                  <ul className="dropdown-menu absolute right-0 mt-2 bg-white shadow-lg rounded-md min-w-[200px] z-50">
                    <li className="px-4 py-2 text-gray-700 font-semibold border-b">
                      Select Industry:
                    </li>
                    {industries.map((industry) => (
                      <li key={industry.value}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIndustry(industry.value);
                            setShowIndustryDropdown(false);
                            onIndustryChange?.(industry.value);
                          }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-100 bg-transparent border-0 cursor-pointer ${
                            selectedIndustry === industry.value
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700'
                          }`}
                        >
                          {industry.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>

            {/* Highlights */}
            <li>
              <button
                type="button"
                onClick={() => onHighlightsClick?.()}
                className="text-white hover:text-gray-200 px-3 py-2 h-full flex items-center bg-transparent border-0 cursor-pointer"
                title="Highlights"
              >
                <i className="fa fa-star"></i>
              </button>
            </li>

            {/* Settings/Grid */}
            <li>
              <button
                type="button"
                className="text-white hover:text-gray-200 px-3 py-2 h-full flex items-center bg-transparent border-0 cursor-pointer"
                title="Settings"
              >
                <i className="fa fa-th"></i>
              </button>
            </li>
          </ul>
        </div>

        {/* Brand/Title */}
        <div className="navbar-brand text-white font-semibold" style={{ float: 'left', padding: '15px 15px', fontSize: '18px', lineHeight: '20px' }}>
          IVYCHAIN (integrated Business Performance Improvement)
        </div>
      </nav>
    </header>
  );
};

export default Header;
