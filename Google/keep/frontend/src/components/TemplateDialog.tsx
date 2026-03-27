import React, { useState } from "react";
import { X, FileText, CheckSquare, Calendar, Users, Lightbulb, Target, Heart, BookOpen, Coffee, Sparkles } from "lucide-react";

interface TemplateDialogProps {
  onClose: () => void;
  onSelect: (template: any) => void;
}

const predefinedTemplates = [
  {
    id: "meeting-notes",
    title: "Meeting Notes",
    icon: Users,
    color: "blue",
    content: "Date:\nAttendees:\nAgenda:\n\nNotes:\n\nAction Items:",
    labels: ["meeting", "work"],
  },
  {
    id: "todo",
    title: "To-Do List",
    icon: CheckSquare,
    color: "green",
    content: "Tasks:",
    checklist: [
      { text: "Task 1", checked: false },
      { text: "Task 2", checked: false },
      { text: "Task 3", checked: false },
    ],
    labels: ["todo"],
  },
  {
    id: "daily-journal",
    title: "Daily Journal",
    icon: BookOpen,
    color: "purple",
    content: "Date:\n\nToday's Highlights:\n\nGratitude:\n\nReflections:",
    labels: ["journal", "personal"],
  },
  {
    id: "project-plan",
    title: "Project Plan",
    icon: Target,
    color: "orange",
    content: "Project Name:\nObjective:\nTimeline:\nStakeholders:\n\nPhases:\n1.\n2.\n3.\n\nRisks:",
    labels: ["project", "work"],
  },
  {
    id: "ideas",
    title: "Ideas & Brainstorm",
    icon: Lightbulb,
    color: "yellow",
    content: "Topic:\n\nIdeas:\n-\n-\n-\n\nNext Steps:",
    labels: ["ideas"],
  },
  {
    id: "reading-list",
    title: "Reading List",
    icon: BookOpen,
    color: "pink",
    content: "Books to Read:\n\nCurrently Reading:\n\nFinished:",
    labels: ["reading", "personal"],
  },
  {
    id: "recipe",
    title: "Recipe",
    icon: Coffee,
    color: "red",
    content: "Recipe Name:\n\nIngredients:\n-\n-\n-\n\nInstructions:\n1.\n2.\n3.\n\nNotes:",
    labels: ["recipe", "cooking"],
  },
  {
    id: "event-planning",
    title: "Event Planning",
    icon: Calendar,
    color: "green",
    content: "Event:\nDate:\nLocation:\nGuests:\n\nTo-Do:\n\nBudget:\n\nNotes:",
    labels: ["event", "planning"],
  },
  {
    id: "goals",
    title: "Goals & Objectives",
    icon: Target,
    color: "blue",
    content: "Period:\n\nGoals:\n1.\n2.\n3.\n\nProgress:\n\nChallenges:\n\nWins:",
    labels: ["goals", "personal"],
  },
  {
    id: "gratitude",
    title: "Gratitude Log",
    icon: Heart,
    color: "pink",
    content: "Date:\n\nI'm grateful for:\n1.\n2.\n3.\n\nPositive moments:",
    labels: ["gratitude", "personal"],
  },
];

const TemplateDialog: React.FC<TemplateDialogProps> = ({ onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = predefinedTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.labels.some((label) =>
        label.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-2xl font-bold text-gray-900">Note Templates</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Search */}
          <div className="px-6 pb-4">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-keep-500"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                const colorMap: Record<string, string> = {
                  red: "bg-red-100 hover:bg-red-200 border-red-200",
                  orange: "bg-orange-100 hover:bg-orange-200 border-orange-200",
                  yellow: "bg-yellow-100 hover:bg-yellow-200 border-yellow-200",
                  green: "bg-green-100 hover:bg-green-200 border-green-200",
                  blue: "bg-blue-100 hover:bg-blue-200 border-blue-200",
                  purple: "bg-purple-100 hover:bg-purple-200 border-purple-200",
                  pink: "bg-pink-100 hover:bg-pink-200 border-pink-200",
                };
                
                const bgColor = colorMap[template.color] || "bg-gray-100 hover:bg-gray-200 border-gray-200";

                return (
                  <button
                    key={template.id}
                    onClick={() => onSelect(template)}
                    className={`${bgColor} p-6 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg`}
                  >
                    <Icon className="w-8 h-8 mb-3 text-gray-700" />
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {template.title}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {template.labels.slice(0, 2).map((label) => (
                        <span
                          key={label}
                          className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded-full text-gray-700"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
          <p className="text-sm text-gray-600 text-center">
            Select a template to create a new note with pre-filled content
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateDialog;
