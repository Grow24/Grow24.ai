import React, { useState } from 'react';

const ChatPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Divakar Jalan',
      avatar: '/api/placeholder/40/40',
      text: 'Varun-ji, our total booking has increased 7%(Sales Order basis), but the "cash inflow" has dropped 4% since start of the fiscal. Can you please check what\'s happening ?',
      timestamp: 'Jul-27-2017 today',
    },
    {
      id: 2,
      sender: 'Varun Khanna',
      avatar: '/api/placeholder/40/40',
      text: 'Sir, this is driven by HugeCorp, our second largest customer by value. Order booking increased 18% (Sales Order Basis), but "cash inflow", has dropped by 23%. I talked to Ranjan (our sales mgr for hugeCorp), and he mentioned the company has internal rift between the promoters, resulting in HugeCorp\'s revenues getting impacted.',
      timestamp: 'Jul-27-2017 today',
    },
    {
      id: 3,
      sender: 'Divakar Jalan',
      avatar: '/api/placeholder/40/40',
      text: 'Thanks for the insights. I know Mr. Kapoor, the senior promotor at hugeCorp. Let\'s go and meet him, and try to get payments released. Meanwhile please ask Ranjan to stop taking fresh orders from HugeCo.',
      timestamp: 'Jul-27-2017 today',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'You',
          avatar: '/api/placeholder/40/40',
          text: newMessage,
          timestamp: new Date().toLocaleDateString(),
        },
      ]);
      setNewMessage('');
    }
  };

  // Generate avatar initials
  const getAvatarInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#f8f9fa' }}>
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3 mb-4">
            {/* Avatar Circle */}
            <div className="flex-shrink-0">
              <div 
                className="rounded-full flex items-center justify-center text-white font-semibold"
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: '#9CA3AF',
                  border: '2px solid #E5E7EB',
                  fontSize: '14px'
                }}
              >
                {getAvatarInitials(message.sender)}
              </div>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 mb-1" style={{ fontSize: '14px', fontWeight: '600' }}>
                {message.sender}
              </div>
              <div className="text-gray-700 mb-1" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                {message.text}
              </div>
              <div className="text-gray-500" style={{ fontSize: '11px' }}>
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type message ..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ fontSize: '13px' }}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fa fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;

