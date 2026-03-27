import { useState } from "react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  content: string | null;
}

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateName: string, templateContent: string | null) => void;
}

export default function TemplateDialog({ isOpen, onClose, onSelectTemplate }: TemplateDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const templates: Template[] = [
    {
      id: "competitive-analysis",
      name: "Competitive analysis",
      description: "Analyze competitors and market position",
      category: "Business",
      thumbnail: "CA",
      content: `COMPETITIVE ANALYSIS

Executive Summary:
[Provide a brief overview of the competitive landscape and key findings]

Market Overview:
• Market size: $[amount]
• Growth rate: [X]%
• Key trends: [List major trends]

Competitor Analysis:

Competitor 1: [Name]
• Market share: [X]%
• Strengths:
  - [Strength 1]
  - [Strength 2]
• Weaknesses:
  - [Weakness 1]
  - [Weakness 2]
• Strategy: [Description]

Competitor 2: [Name]
• Market share: [X]%
• Strengths:
  - [Strength 1]
  - [Strength 2]
• Weaknesses:
  - [Weakness 1]
  - [Weakness 2]
• Strategy: [Description]

Competitor 3: [Name]
• Market share: [X]%
• Strengths:
  - [Strength 1]
  - [Strength 2]
• Weaknesses:
  - [Weakness 1]
  - [Weakness 2]
• Strategy: [Description]

Our Position:
• Market share: [X]%
• Unique value proposition: [Description]
• Competitive advantages:
  - [Advantage 1]
  - [Advantage 2]
  - [Advantage 3]

Recommendations:
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]`
    },
    {
      id: "contacts",
      name: "Contacts",
      description: "Organize contact information",
      category: "Productivity",
      thumbnail: "CT",
      content: `WORK CONTACTS

[Your Organization Name]

Department: [Department Name]
─────────────────────────────────────

Name: [Full Name]
Role: [Job Title]
Email: [email@domain.com]
Phone: [Phone Number]
Notes: [Additional information]

─────────────────────────────────────

Name: [Full Name]
Role: [Job Title]
Email: [email@domain.com]
Phone: [Phone Number]
Notes: [Additional information]

─────────────────────────────────────

Name: [Full Name]
Role: [Job Title]
Email: [email@domain.com]
Phone: [Phone Number]
Notes: [Additional information]

Department: [Department Name]
─────────────────────────────────────

Name: [Full Name]
Role: [Job Title]
Email: [email@domain.com]
Phone: [Phone Number]
Notes: [Additional information]

─────────────────────────────────────

External Contacts
─────────────────────────────────────

Company: [Company Name]
Name: [Full Name]
Role: [Job Title]
Email: [email@domain.com]
Phone: [Phone Number]
Notes: [Additional information]`
    },
    {
      id: "content-calendar",
      name: "Content calendar",
      description: "Plan and schedule content",
      category: "Marketing",
      thumbnail: "CC",
      content: `CONTENT CALENDAR

Project Name: [Your Project/Campaign Name]

Month: [Month Year]

Content Goals:
• Goal 1: [Description]
• Goal 2: [Description]
• Goal 3: [Description]

Target Audience Persona:
• Name: [Persona Name]
• Demographics: [Age, Location, etc.]
• Pain Points: [List]
• Content Preferences: [Formats they prefer]

Week 1: [Dates]
─────────────────────────────────────

Monday, [Date]
• Platform: [Social Media/Blog/etc.]
• Topic: [Content topic]
• Type: [Blog post/Video/Image/etc.]
• Status: ⏳ Planned / ✍️ In Progress / ✅ Published
• Notes: [Additional details]

Tuesday, [Date]
• Platform: [Social Media/Blog/etc.]
• Topic: [Content topic]
• Type: [Blog post/Video/Image/etc.]
• Status: ⏳ Planned / ✍️ In Progress / ✅ Published
• Notes: [Additional details]

Wednesday, [Date]
• Platform: [Social Media/Blog/etc.]
• Topic: [Content topic]
• Type: [Blog post/Video/Image/etc.]
• Status: ⏳ Planned / ✍️ In Progress / ✅ Published
• Notes: [Additional details]

Week 2: [Dates]
─────────────────────────────────────

[Repeat format for each day]

Performance Metrics:
• Engagement rate: [X]%
• Reach: [Number]
• Conversions: [Number]`
    },
    {
      id: "decision-log",
      name: "Decision log",
      description: "Track important decisions",
      category: "Project Management",
      thumbnail: "DL",
      content: `PROJECT DECISION LOG

Project Name: [Your Project Name]
Project Manager: [Name]
Last Updated: [Date]

Purpose:
This log tracks all significant decisions made during the project lifecycle, including the context, stakeholders involved, and outcomes.

Decision #1
─────────────────────────────────────

Decision ID: DEC-001
Date: [Date]
Status: ✅ Approved / ⏳ Pending / ❌ Rejected

Title: [Brief decision title]

Context:
[Describe the situation that required a decision]

Options Considered:
1. Option A: [Description]
   - Pros: [List]
   - Cons: [List]

2. Option B: [Description]
   - Pros: [List]
   - Cons: [List]

Decision Made: [Selected option]

Rationale:
[Explain why this decision was made]

Stakeholders Involved:
• [Name] - [Role]
• [Name] - [Role]

Impact:
• Timeline: [Impact description]
• Budget: [Impact description]
• Resources: [Impact description]

Action Items:
□ [Action 1] - Owner: [Name] - Due: [Date]
□ [Action 2] - Owner: [Name] - Due: [Date]

Decision #2
─────────────────────────────────────

[Repeat format for each decision]`
    },
    {
      id: "event-planner",
      name: "Event planner",
      description: "Organize and plan events",
      category: "Planning",
      thumbnail: "EP",
      content: `EVENT PLANNER

Event Title: [Your Event Name]

Event Overview:
─────────────────────────────────────

Date: [Date]
Time: [Start time] - [End time]
Location: [Venue name and address]
Expected Attendees: [Number]
Budget: $[Amount]

Event Purpose:
[Describe the goal and purpose of this event]

Timeline:
─────────────────────────────────────

[3 months before]
□ Finalize event concept and objectives
□ Create initial budget
□ Research and book venue
□ Form planning committee

[2 months before]
□ Send save-the-date notifications
□ Book speakers/entertainment
□ Arrange catering
□ Plan event layout

[1 month before]
□ Send formal invitations
□ Finalize guest list
□ Order supplies and materials
□ Confirm all vendors

[2 weeks before]
□ Follow up with non-responders
□ Create event schedule
□ Prepare registration materials
□ Conduct venue walkthrough

[1 week before]
□ Confirm final headcount with caterer
□ Prepare name badges
□ Test all equipment
□ Brief event staff

[Day before]
□ Set up venue
□ Confirm all deliveries
□ Prepare welcome materials

Vendors & Contacts:
─────────────────────────────────────

Venue:
Name: [Venue name]
Contact: [Name, Phone, Email]
Notes: [Details]

Catering:
Name: [Company name]
Contact: [Name, Phone, Email]
Menu: [Description]

Entertainment:
Name: [Performer/Company]
Contact: [Name, Phone, Email]
Notes: [Details]

Budget Breakdown:
─────────────────────────────────────

• Venue: $[Amount]
• Catering: $[Amount]
• Entertainment: $[Amount]
• Decorations: $[Amount]
• Marketing: $[Amount]
• Staff: $[Amount]
• Contingency (10%): $[Amount]

Total Budget: $[Amount]`
    },
    {
      id: "faqs",
      name: "FAQs",
      description: "Frequently asked questions",
      category: "Documentation",
      thumbnail: "FAQ",
      content: `FREQUENTLY ASKED QUESTIONS

[Product/Service Name]

Last Updated: [Date]

Introduction:
Welcome! This document answers common questions about [product/service]. If you can't find what you're looking for, please contact [support email].

General Questions
─────────────────────────────────────

Q: What is [product/service name]?
A: [Provide a clear, concise description of what the product/service is and its main purpose]

Q: Who is this for?
A: [Describe the target audience and ideal users]

Q: How much does it cost?
A: [Explain pricing structure or provide pricing information]

Getting Started
─────────────────────────────────────

Q: How do I get started?
A: [Provide step-by-step instructions]
   1. [Step 1]
   2. [Step 2]
   3. [Step 3]

Q: What are the system requirements?
A: [List technical requirements]

Q: Do you offer a free trial?
A: [Explain trial options if available]

Features & Functionality
─────────────────────────────────────

Q: What are the main features?
A: The key features include:
   • [Feature 1]
   • [Feature 2]
   • [Feature 3]

Q: Can I [specific functionality]?
A: [Explain whether this is possible and how to do it]

Q: Is there a mobile app?
A: [Explain mobile availability]

Troubleshooting
─────────────────────────────────────

Q: I'm having trouble with [common issue]. What should I do?
A: [Provide troubleshooting steps]

Q: Who do I contact for technical support?
A: [Provide support contact information and hours]

Account & Billing
─────────────────────────────────────

Q: How do I update my account information?
A: [Provide instructions]

Q: What payment methods do you accept?
A: [List accepted payment methods]

Q: How do I cancel my subscription?
A: [Explain cancellation process]

Additional Support:
For questions not covered here, please reach out:
• Email: [support email]
• Phone: [support phone]
• Hours: [support hours]`
    },
    {
      id: "feedback-tracker",
      name: "Feedback tracker",
      description: "Collect and organize feedback",
      category: "Product",
      thumbnail: "FT",
      content: `FEEDBACK TRACKER

Project/Product Name: [Your Project Name]

Feedback Summary:
─────────────────────────────────────

Total Feedback Items: [Number]
• High Priority: [Number]
• Medium Priority: [Number]
• Low Priority: [Number]

Status Overview:
• 🆕 New: [Number]
• 🔍 Under Review: [Number]
• ✅ Implemented: [Number]
• ❌ Won't Fix: [Number]

Feedback Item #1
─────────────────────────────────────

ID: FB-001
Date Received: [Date]
Source: [User/Customer name or feedback channel]
Priority: 🔴 High / 🟡 Medium / 🟢 Low
Status: 🆕 New / 🔍 Under Review / ✅ Implemented / ❌ Won't Fix

Category: [Bug/Feature Request/Improvement/Other]

Feedback:
[Enter the detailed feedback received]

Impact:
• Users Affected: [Number or description]
• Business Impact: [Description]

Response:
[Team's response or planned action]

Assigned To: [Team member name]
Target Date: [Date]

Notes:
[Additional context or discussion]

Feedback Item #2
─────────────────────────────────────

[Repeat format for each feedback item]

Action Items:
─────────────────────────────────────

□ [Action 1] - Owner: [Name] - Due: [Date]
□ [Action 2] - Owner: [Name] - Due: [Date]
□ [Action 3] - Owner: [Name] - Due: [Date]

Trends & Insights:
─────────────────────────────────────

Most Requested Features:
1. [Feature 1] - [Number] requests
2. [Feature 2] - [Number] requests
3. [Feature 3] - [Number] requests

Common Issues:
1. [Issue 1] - [Number] reports
2. [Issue 2] - [Number] reports
3. [Issue 3] - [Number] reports`
    },
    {
      id: "interview-guide",
      name: "Interview guide",
      description: "Structure your interviews",
      category: "HR",
      thumbnail: "IG",
      content: `INTERVIEW GUIDE

Position Title: [Job Title]
Department: [Department]
Interview Date: [Date]
Interviewer(s): [Names]

Candidate Information:
─────────────────────────────────────

Name: [Candidate Name]
Applied for: [Position]
Resume reviewed: ☐ Yes ☐ No
Years of experience: [Number]

Interview Structure:
─────────────────────────────────────

Total Time: [Duration, e.g., 60 minutes]

1. Introduction (5 minutes)
   • Welcome and introductions
   • Overview of interview process
   • Overview of role and company

2. Background & Experience (15 minutes)
3. Technical/Role-Specific Questions (20 minutes)
4. Behavioral Questions (15 minutes)
5. Candidate Questions (5 minutes)

Background & Experience Questions:
─────────────────────────────────────

Q: Tell me about your background and how you got to where you are today.
Notes: [Record response and observations]
Rating: ⭐⭐⭐⭐⭐

Q: What interests you about this role and our company?
Notes: [Record response and observations]
Rating: ⭐⭐⭐⭐⭐

Q: Walk me through your most recent role and responsibilities.
Notes: [Record response and observations]
Rating: ⭐⭐⭐⭐⭐

Technical/Role-Specific Questions:
─────────────────────────────────────

Q: [Specific technical question relevant to role]
Notes: [Record response and observations]
Rating: ⭐⭐⭐⭐⭐

Q: [Specific technical question relevant to role]
Notes: [Record response and observations]
Rating: ⭐⭐⭐⭐⭐

Behavioral Questions:
─────────────────────────────────────

Q: Describe a time when you faced a significant challenge. How did you handle it?
Notes: [Record response and observations]
Rating: ⭐⭐⭐⭐⭐

Q: Tell me about a time you worked on a team project. What was your role?
Notes: [Record response and observations]
Rating: ⭐⭐⭐⭐⭐

Q: Describe a situation where you had to meet a tight deadline. How did you manage?
Notes: [Record response and observations]
Rating: ⭐⭐⭐⭐⭐

Overall Assessment:
─────────────────────────────────────

Strengths:
• [Strength 1]
• [Strength 2]
• [Strength 3]

Areas of Concern:
• [Concern 1]
• [Concern 2]

Cultural Fit: ⭐⭐⭐⭐⭐
Technical Skills: ⭐⭐⭐⭐⭐
Communication: ⭐⭐⭐⭐⭐
Problem-Solving: ⭐⭐⭐⭐⭐

Overall Rating: ⭐⭐⭐⭐⭐

Recommendation:
☐ Strong Yes - Highly recommend
☐ Yes - Recommend with reservations
☐ No - Do not recommend

Next Steps:
[Outline next steps in the hiring process]`
    },
    {
      id: "marketing-plan",
      name: "Marketing plan",
      description: "Plan marketing campaigns",
      category: "Marketing",
      thumbnail: "MP",
      content: `MARKETING PLAN

Campaign Name: [Campaign Name]
Duration: [Start Date] - [End Date]
Budget: $[Amount]

Executive Summary:
─────────────────────────────────────

Campaign Overview:
[Provide a brief overview of the marketing campaign, its purpose, and expected outcomes]

Key Objectives:
• [Objective 1]
• [Objective 2]
• [Objective 3]

Market Analysis:
─────────────────────────────────────

Target Market:
• Primary audience: [Description]
• Secondary audience: [Description]
• Market size: [Number/Description]

Customer Personas:

Persona 1: [Name]
• Demographics: [Age, location, income, etc.]
• Pain points: [List]
• Buying behavior: [Description]
• Preferred channels: [List]

Persona 2: [Name]
• Demographics: [Age, location, income, etc.]
• Pain points: [List]
• Buying behavior: [Description]
• Preferred channels: [List]

Marketing Objectives:
─────────────────────────────────────

1. Increase brand awareness
   Target: [Specific metric and goal]
   Timeline: [Timeframe]

2. Generate leads
   Target: [Specific metric and goal]
   Timeline: [Timeframe]

3. Drive sales
   Target: [Specific metric and goal]
   Timeline: [Timeframe]

Marketing Strategies:
─────────────────────────────────────

Digital Marketing:
• Social Media Marketing
  - Platforms: [List platforms]
  - Content types: [Types]
  - Posting frequency: [Schedule]
  
• Content Marketing
  - Blog posts: [Frequency]
  - Videos: [Frequency]
  - Infographics: [Frequency]
  
• Email Marketing
  - Campaign types: [List]
  - Frequency: [Schedule]

Traditional Marketing:
• [Strategy 1]
• [Strategy 2]

Campaign Timeline:
─────────────────────────────────────

Month 1: [Month Name]
• Week 1: [Activities]
• Week 2: [Activities]
• Week 3: [Activities]
• Week 4: [Activities]

Month 2: [Month Name]
• [Continue timeline]

Budget Allocation:
─────────────────────────────────────

• Digital Advertising: $[Amount] ([X]%)
• Content Creation: $[Amount] ([X]%)
• Social Media: $[Amount] ([X]%)
• Email Marketing: $[Amount] ([X]%)
• Events: $[Amount] ([X]%)
• Other: $[Amount] ([X]%)

Total Budget: $[Amount]

Key Performance Indicators (KPIs):
─────────────────────────────────────

• Website traffic: [Target]
• Social media engagement: [Target]
• Lead generation: [Target]
• Conversion rate: [Target]
• ROI: [Target]

Measurement & Reporting:
[Describe how success will be measured and reporting frequency]`
    },
    {
      id: "meeting-notes",
      name: "Meeting notes",
      description: "Take organized meeting notes",
      category: "Productivity",
      thumbnail: "MN",
      content: `MEETING NOTES

Meeting Title: [Title]
Date: [Date]
Time: [Start] - [End]
Location/Link: [Location or video conference link]

Attendees:
─────────────────────────────────────

Present:
• [Name] - [Role]
• [Name] - [Role]
• [Name] - [Role]

Absent:
• [Name] - [Role]

Agenda:
─────────────────────────────────────

1. [Topic 1] - [Time allocation]
2. [Topic 2] - [Time allocation]
3. [Topic 3] - [Time allocation]
4. Action items review
5. Next steps

Discussion Notes:
─────────────────────────────────────

Topic 1: [Topic name]
───────────────

Discussion:
[Record key points discussed, decisions made, and important comments]

Key Points:
• [Point 1]
• [Point 2]
• [Point 3]

Topic 2: [Topic name]
───────────────

Discussion:
[Record key points discussed, decisions made, and important comments]

Key Points:
• [Point 1]
• [Point 2]

Decisions Made:
─────────────────────────────────────

1. [Decision 1]
   - Context: [Brief context]
   - Next steps: [What needs to happen]

2. [Decision 2]
   - Context: [Brief context]
   - Next steps: [What needs to happen]

Action Items:
─────────────────────────────────────

□ [Action item 1]
  Owner: [Name]
  Due date: [Date]
  Priority: 🔴 High / 🟡 Medium / 🟢 Low

□ [Action item 2]
  Owner: [Name]
  Due date: [Date]
  Priority: 🔴 High / 🟡 Medium / 🟢 Low

□ [Action item 3]
  Owner: [Name]
  Due date: [Date]
  Priority: 🔴 High / 🟡 Medium / 🟢 Low

Open Questions:
─────────────────────────────────────

• [Question 1]
• [Question 2]
• [Question 3]

Next Meeting:
─────────────────────────────────────

Date: [Date]
Time: [Time]
Topics to cover:
• [Topic 1]
• [Topic 2]

Additional Notes:
[Any other relevant information or follow-up items]`
    },
    {
      id: "project-tracker",
      name: "Project tracker",
      description: "Track project progress",
      category: "Project Management",
      thumbnail: "PT",
      content: `PROJECT TRACKER

Project Name: [Your Project Name]
Project Manager: [Name]
Start Date: [Date]
Target Completion: [Date]
Status: 🟢 On Track / 🟡 At Risk / 🔴 Behind Schedule

Project Overview:
─────────────────────────────────────

Objective:
[Brief description of the project objective and goals]

Scope:
[Define what's included in the project]

Deliverables:
• [Deliverable 1]
• [Deliverable 2]
• [Deliverable 3]

Team Members:
─────────────────────────────────────

• [Name] - [Role] - [Email]
• [Name] - [Role] - [Email]
• [Name] - [Role] - [Email]

Milestones:
─────────────────────────────────────

Milestone 1: [Name]
Target Date: [Date]
Status: ✅ Complete / 🔄 In Progress / ⏳ Not Started
Description: [Brief description]

Milestone 2: [Name]
Target Date: [Date]
Status: ✅ Complete / 🔄 In Progress / ⏳ Not Started
Description: [Brief description]

Milestone 3: [Name]
Target Date: [Date]
Status: ✅ Complete / 🔄 In Progress / ⏳ Not Started
Description: [Brief description]

Tasks:
─────────────────────────────────────

Task ID: T-001
Task: [Task name]
Assigned to: [Name]
Due date: [Date]
Priority: 🔴 High / 🟡 Medium / 🟢 Low
Status: ✅ Complete / 🔄 In Progress / ⏳ Not Started
Notes: [Additional information]

Task ID: T-002
Task: [Task name]
Assigned to: [Name]
Due date: [Date]
Priority: 🔴 High / 🟡 Medium / 🟢 Low
Status: ✅ Complete / 🔄 In Progress / ⏳ Not Started
Notes: [Additional information]

Risks & Issues:
─────────────────────────────────────

Risk #1
Type: 🔴 Risk / ⚠️ Issue
Description: [Description]
Impact: 🔴 High / 🟡 Medium / 🟢 Low
Mitigation: [Strategy to address]
Owner: [Name]

Risk #2
Type: 🔴 Risk / ⚠️ Issue
Description: [Description]
Impact: 🔴 High / 🟡 Medium / 🟢 Low
Mitigation: [Strategy to address]
Owner: [Name]

Budget:
─────────────────────────────────────

Total Budget: $[Amount]
Spent to Date: $[Amount]
Remaining: $[Amount]
Variance: $[Amount] ([X]%)

Weekly Progress Updates:
─────────────────────────────────────

Week of [Date]:
Completed:
• [Item 1]
• [Item 2]

In Progress:
• [Item 1]
• [Item 2]

Planned for Next Week:
• [Item 1]
• [Item 2]

Blockers:
• [Blocker 1]`
    }
  ];

  const categories = ["all", "Business", "Marketing", "Project Management", "Planning", "Documentation", "Product", "HR", "Productivity"];

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">Select a template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex h-[calc(90vh-140px)]">
          {/* Left Sidebar - Categories */}
          <div className="w-48 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  selectedCategory === "all"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"></span>
                All Templates
              </button>
              
              {categories.filter(c => c !== "all").map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Help me create button */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  alert("AI Template Generator coming soon! This will help you create custom templates based on your needs.");
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium text-sm">Help me create</span>
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Generate custom templates with AI
              </p>
            </div>
          </div>

          {/* Right Content - Template Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template.name, template.content)}
                  className="group relative bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                      <span className="text-white text-xl font-bold tracking-tight">{template.thumbnail}</span>
                    </div>
                    
                    {/* Template Name */}
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {template.description}
                    </p>
                    
                    {/* Category Badge */}
                    <div className="mt-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg">No templates found in this category</p>
                <p className="text-sm mt-2">Try selecting a different category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
