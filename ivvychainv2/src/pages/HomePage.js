import React, { useState } from 'react';
import VennDiagram from '../components/VennDiagram';
import Checklist from '../components/Checklist';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('HOME');

  const tabs = [
    { id: 'HOME', label: 'HOME' },
    { id: 'WHO', label: 'WHO' },
    { id: 'HOW', label: 'HOW' },
    { id: 'WHAT', label: 'WHAT' },
    { id: 'Environment', label: 'Environment' },
  ];

  // PESTEL categories for Environment tab
  const pestelCategories = [
    'Political - Govt policy, tax policy, Labor law, Environment law, Trade restrictions, instability in overseas markets',
    'Economic Growth - macro and micro growth factors. Macro factors such as GDP, interest rates, exchange rates, inflation, disposable income',
    'Global trends - production, sales, offtake, installed capacity, expansion plans, inventory in trade',
    'Sales - value/volume share, Market Estimates/Share Projections, \'product mix\' evolution',
    'Socio cultural - Habits, Beliefs and Attitudes (HABA), population growth, age distribution, health consciousness, spending attitude, consumer clusters',
    'Technological - new ways of producing and distributing goods and services, communicating with TA',
    'Environmental - scarcity in Raw material, pollution targets, ethical business, carbon footprint',
    'Legal - Health and safety, equal opportunity, consumer rights, CSR',
  ];

  return (
    <div className="content-header" style={{ backgroundColor: '#ecf0f5', minHeight: 'calc(100vh - 50px)', padding: '20px' }}>
      {/* Tabs Navigation */}
      <div className="tabbable">
        <ul className="nav nav-tabs" style={{ borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
          {tabs.map((tab) => (
            <li key={tab.id} className={activeTab === tab.id ? 'active' : ''} style={{ marginBottom: '-1px' }}>
              <a
                href={`#tab-${tab.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.id);
                }}
                className={activeTab === tab.id ? 'active' : ''}
                style={{
                  display: 'block',
                  padding: '10px 15px',
                  color: activeTab === tab.id ? '#555' : '#999',
                  textDecoration: 'none',
                  border: activeTab === tab.id ? '1px solid #ddd' : '1px solid transparent',
                  borderBottomColor: activeTab === tab.id ? 'transparent' : '#ddd',
                  backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                  borderRadius: '4px 4px 0 0',
                  fontWeight: 'bold',
                }}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Tab Content */}
        <div className="tab-content">
          {/* HOME Tab - Environment Scanning */}
          {activeTab === 'HOME' && (
            <div className={`tab-pane ${activeTab === 'HOME' ? 'active' : ''}`} id="tab-HOME">
              <div className="row" style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '-15px', marginRight: '-15px' }}>
                {/* Left Side - Venn Diagram */}
                <div className="col-md-6" style={{ paddingLeft: '15px', paddingRight: '15px', flex: '0 0 50%', maxWidth: '50%' }}>
                  <div className="box" style={{ 
                    position: 'relative', 
                    borderRadius: '3px', 
                    background: '#ffffff', 
                    borderTop: '3px solid #d2d6de', 
                    marginBottom: '20px', 
                    width: '100%', 
                    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
                    padding: '20px'
                  }}>
                    <VennDiagram />
                  </div>
                </div>

                {/* Right Side - Checklist */}
                <div className="col-md-6" style={{ paddingLeft: '15px', paddingRight: '15px', flex: '0 0 50%', maxWidth: '50%' }}>
                  <div className="box" style={{ 
                    position: 'relative', 
                    borderRadius: '3px', 
                    background: '#ffffff', 
                    borderTop: '3px solid #d2d6de', 
                    marginBottom: '20px', 
                    width: '100%', 
                    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
                    padding: '20px'
                  }}>
                    <Checklist />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WHO Tab */}
          {activeTab === 'WHO' && (
            <div className={`tab-pane ${activeTab === 'WHO' ? 'active' : ''}`} id="tab-WHO">
              <div className="col-sm-12">
                <div className="box box-solid box-primary">
                  <div className="box-header">
                    <h3 className="box-title">WHO</h3>
                    <div className="box-tools pull-right">
                      <button className="btn btn-box-tool" data-widget="collapse">
                        <i className="fa fa-minus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="shiny-html-output shiny-bound-output">
                      {/* WHO content will be loaded here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HOW Tab */}
          {activeTab === 'HOW' && (
            <div className={`tab-pane ${activeTab === 'HOW' ? 'active' : ''}`} id="tab-HOW">
              <div className="col-sm-12">
                <div className="box box-solid box-primary">
                  <div className="box-header">
                    <h3 className="box-title">HOW</h3>
                    <div className="box-tools pull-right">
                      <button className="btn btn-box-tool" data-widget="collapse">
                        <i className="fa fa-minus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="shiny-html-output shiny-bound-output">
                      {/* HOW content will be loaded here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WHAT Tab */}
          {activeTab === 'WHAT' && (
            <div className={`tab-pane ${activeTab === 'WHAT' ? 'active' : ''}`} id="tab-WHAT">
              <div className="col-sm-12">
                <div className="box box-solid box-primary">
                  <div className="box-header">
                    <h3 className="box-title">WHAT</h3>
                    <div className="box-tools pull-right">
                      <button className="btn btn-box-tool" data-widget="collapse">
                        <i className="fa fa-minus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="shiny-html-output shiny-bound-output">
                      {/* WHAT content will be loaded here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Environment Tab - PESTEL Categories */}
          {activeTab === 'Environment' && (
            <div className={`tab-pane ${activeTab === 'Environment' ? 'active' : ''}`} id="tab-Environment">
              <div className="col-sm-12">
                <div className="box box-solid box-primary">
                  <div className="box-header">
                    <h3 className="box-title">Environment</h3>
                    <div className="box-tools pull-right">
                      <button className="btn btn-box-tool" data-widget="collapse">
                        <i className="fa fa-minus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="well" style={{ backgroundColor: '#f5f5f5', border: '1px solid #e3e3e3', borderRadius: '4px', padding: '19px', marginBottom: '20px' }}>
                      {pestelCategories.map((category, index) => (
                        <div key={index} className="shiny-text-output" style={{ marginBottom: '10px', color: '#333' }}>
                          {category}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
