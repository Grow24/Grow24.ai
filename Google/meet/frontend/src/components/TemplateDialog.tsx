import React, { useState } from 'react';

interface MeetingTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number; // in minutes
  defaultAttendees?: string[];
  icon: string;
}

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: MeetingTemplate) => void;
}

const MEETING_TEMPLATES: MeetingTemplate[] = [
  // Team & Collaboration
  {
    id: 'team-standup',
    name: 'Daily Standup',
    description: 'Quick team sync to discuss progress, blockers, and plans',
    category: 'Team & Collaboration',
    duration: 15,
    icon: '👥',
  },
  {
    id: 'team-meeting',
    name: 'Team Meeting',
    description: 'Regular team meeting for updates and discussions',
    category: 'Team & Collaboration',
    duration: 60,
    icon: '🤝',
  },
  {
    id: 'all-hands',
    name: 'All-Hands Meeting',
    description: 'Company-wide meeting for announcements and updates',
    category: 'Team & Collaboration',
    duration: 60,
    icon: '🏢',
  },
  {
    id: 'retrospective',
    name: 'Sprint Retrospective',
    description: 'Team retrospective to reflect on the sprint',
    category: 'Team & Collaboration',
    duration: 60,
    icon: '🔄',
  },
  
  // 1-on-1 Meetings
  {
    id: 'one-on-one',
    name: '1-on-1 Meeting',
    description: 'Individual meeting for feedback and discussion',
    category: '1-on-1',
    duration: 30,
    icon: '💬',
  },
  {
    id: 'one-on-one-manager',
    name: 'Manager 1-on-1',
    description: 'Regular check-in with your manager',
    category: '1-on-1',
    duration: 30,
    icon: '👔',
  },
  {
    id: 'mentoring',
    name: 'Mentoring Session',
    description: 'Mentoring and coaching session',
    category: '1-on-1',
    duration: 45,
    icon: '',
  },
  
  // Client & External
  {
    id: 'client-call',
    name: 'Client Call',
    description: 'Meeting with client for project updates',
    category: 'Client & External',
    duration: 30,
    icon: '',
  },
  {
    id: 'client-demo',
    name: 'Client Demo',
    description: 'Product demonstration for clients',
    category: 'Client & External',
    duration: 45,
    icon: '',
  },
  {
    id: 'sales-call',
    name: 'Sales Call',
    description: 'Sales presentation and discussion',
    category: 'Client & External',
    duration: 30,
    icon: '💰',
  },
  
  // Interviews & HR
  {
    id: 'interview-technical',
    name: 'Technical Interview',
    description: 'Technical interview with candidate',
    category: 'Interviews & HR',
    duration: 60,
    icon: '',
  },
  {
    id: 'interview-behavioral',
    name: 'Behavioral Interview',
    description: 'Behavioral interview with candidate',
    category: 'Interviews & HR',
    duration: 45,
    icon: '🗣️',
  },
  {
    id: 'performance-review',
    name: 'Performance Review',
    description: 'Quarterly or annual performance review',
    category: 'Interviews & HR',
    duration: 60,
    icon: '',
  },
  
  // Planning & Strategy
  {
    id: 'brainstorming',
    name: 'Brainstorming Session',
    description: 'Creative brainstorming and ideation',
    category: 'Planning & Strategy',
    duration: 60,
    icon: '',
  },
  {
    id: 'planning',
    name: 'Planning Meeting',
    description: 'Strategic planning and roadmap discussion',
    category: 'Planning & Strategy',
    duration: 90,
    icon: '',
  },
  {
    id: 'workshop',
    name: 'Workshop',
    description: 'Interactive workshop or training session',
    category: 'Planning & Strategy',
    duration: 120,
    icon: '🛠️',
  },
  
  // Quick & Informal
  {
    id: 'quick-sync',
    name: 'Quick Sync',
    description: 'Brief sync to align on specific topic',
    category: 'Quick & Informal',
    duration: 15,
    icon: '',
  },
  {
    id: 'coffee-chat',
    name: 'Coffee Chat',
    description: 'Casual virtual coffee chat',
    category: 'Quick & Informal',
    duration: 20,
    icon: '',
  },
];

const CATEGORIES = Array.from(new Set(MEETING_TEMPLATES.map(t => t.category)));

const TemplateDialog: React.FC<TemplateDialogProps> = ({ isOpen, onClose, onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTemplates = MEETING_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-meet-500 to-meet-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Meeting Templates</h2>
              <p className="text-meet-100 mt-1">Choose from {MEETING_TEMPLATES.length} pre-built templates</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meet-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === 'All'
                  ? 'bg-meet-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              All ({MEETING_TEMPLATES.length})
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'bg-meet-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category} ({MEETING_TEMPLATES.filter(t => t.category === category).length})
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 300px)' }}>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No templates found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className="bg-white border-2 border-gray-200 rounded-lg p-5 text-left hover:border-meet-500 hover:shadow-lg transition card-hover group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl group-hover:scale-110 transition">{template.icon}</div>
                    <span className="bg-meet-100 text-meet-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {template.duration}m
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-meet-600 transition">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">{template.category}</span>
                    <span className="text-meet-600 font-semibold text-sm group-hover:underline">
                      Use Template →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> Templates include default duration and can be customized after creation
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDialog;
export type { MeetingTemplate };

