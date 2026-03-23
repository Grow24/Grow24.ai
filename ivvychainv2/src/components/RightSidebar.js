import React from 'react';
import ChatPanel from './ChatPanel';

const RightSidebar = ({ isOpen, activeTab, onTabClick, onToggle }) => {
  // When closed, show only icon buttons
  if (!isOpen) {
    return (
      <aside className="control-sidebar control-sidebar-dark bg-gray-800 text-white h-screen fixed right-0 top-12 z-20 flex flex-col" style={{ width: '48px', top: '50px' }}>
        {/* Tab Toggle Buttons */}
        <div className="flex flex-col border-r border-gray-700">
          <button
            onClick={() => onTabClick('chat')}
            className={`px-3 py-4 text-center transition-colors border-b border-gray-700 ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="CHAT"
          >
            <i className="fa fa-comments text-lg"></i>
          </button>
          <button
            onClick={() => onTabClick('annotations')}
            className={`px-3 py-4 text-center transition-colors ${
              activeTab === 'annotations'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="ANNOTATIONS"
          >
            <i className="fa fa-star text-lg"></i>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="control-sidebar control-sidebar-dark bg-gray-800 text-white h-screen fixed right-0 top-12 z-20 flex flex-col transition-all duration-300" style={{ width: '320px', top: '50px' }}>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 relative" style={{ backgroundColor: '#3c8dbc' }}>
        <button
          onClick={() => onTabClick('chat')}
          className={`flex-1 px-4 py-3 text-center font-semibold transition-colors ${
            activeTab === 'chat'
              ? 'bg-blue-600 text-white'
              : 'bg-transparent text-white hover:bg-blue-700'
          }`}
          style={{ fontSize: '13px' }}
        >
          <i className="fa fa-comments mr-2"></i>
          CHAT
        </button>
        <button
          onClick={() => onTabClick('annotations')}
          className={`flex-1 px-4 py-3 text-center font-semibold transition-colors ${
            activeTab === 'annotations'
              ? 'bg-blue-600 text-white'
              : 'bg-transparent text-white hover:bg-blue-700'
          }`}
          style={{ fontSize: '13px' }}
        >
          <i className="fa fa-star mr-2"></i>
          ANNOTATIONS
        </button>
        {/* Collapse Button - Rightmost upper dots */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onToggle) {
              onToggle();
            } else {
              onTabClick(activeTab); // Fallback: close by clicking same tab
            }
          }}
          className="px-3 py-3 text-white hover:bg-blue-700 transition-colors flex items-center justify-center"
          title="Collapse sidebar"
          style={{ fontSize: '12px', lineHeight: '1', minWidth: '40px' }}
        >
          <span style={{ fontFamily: 'monospace', fontWeight: 'normal' }}>&gt;_</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <ChatPanel />}
        {activeTab === 'annotations' && (
          <div className="bg-white h-full p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ANNOTATIONS</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Caption
                </label>
                <input
                  type="text"
                  placeholder="Add Annotations"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Privacy
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="privacy" value="private" className="mr-2" />
                    <span className="text-gray-700">Private</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="privacy" value="public" className="mr-2" />
                    <span className="text-gray-700">Public</span>
                  </label>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Annotation
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;
