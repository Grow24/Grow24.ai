import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const scienceTemplates = [
  {
    name: "Hypothesis Test Design",
    category: "Biology",
    description: "Scientific method workflow for hypothesis testing in biological research",
    tags: ["research", "hypothesis", "experiment", "biology"],
    json: {
      nodes: [
        { id: "start-1", type: "start", position: { x: 100, y: 200 }, data: { label: "Start Research" } },
        { id: "process-1", type: "process", position: { x: 300, y: 200 }, data: { label: "Define Research Question" } },
        { id: "process-2", type: "process", position: { x: 500, y: 200 }, data: { label: "Gather Samples" } },
        { id: "decision-1", type: "decision", position: { x: 700, y: 200 }, data: { label: "Sample Size Adequate?", conditions: [{ id: "yes", label: "Yes" }, { id: "no", label: "No" }] } },
        { id: "process-3", type: "process", position: { x: 900, y: 120 }, data: { label: "Run Experiment" } },
        { id: "process-4", type: "process", position: { x: 700, y: 320 }, data: { label: "Recalculate Power" } },
        { id: "action-1", type: "action", position: { x: 1100, y: 120 }, data: { label: "Analyze Results", actionType: "api" } },
        { id: "decision-2", type: "decision", position: { x: 1300, y: 120 }, data: { label: "Hypothesis Supported?", conditions: [{ id: "yes", label: "Yes" }, { id: "no", label: "No" }] } },
        { id: "process-5", type: "process", position: { x: 1500, y: 80 }, data: { label: "Document Findings" } },
        { id: "process-6", type: "process", position: { x: 1500, y: 160 }, data: { label: "Refine Hypothesis" } },
        { id: "end-1", type: "end", position: { x: 1700, y: 120 }, data: { label: "Complete" } }
      ],
      edges: [
        { id: "e1", source: "start-1", target: "process-1", type: "straight" },
        { id: "e2", source: "process-1", target: "process-2", type: "straight" },
        { id: "e3", source: "process-2", target: "decision-1", type: "straight" },
        { id: "e4", source: "decision-1", target: "process-3", sourceHandle: "yes", label: "Yes" },
        { id: "e5", source: "decision-1", target: "process-4", sourceHandle: "no", label: "No" },
        { id: "e6", source: "process-4", target: "process-2", type: "straight" },
        { id: "e7", source: "process-3", target: "action-1", type: "straight" },
        { id: "e8", source: "action-1", target: "decision-2", type: "straight" },
        { id: "e9", source: "decision-2", target: "process-5", sourceHandle: "yes", label: "Yes" },
        { id: "e10", source: "decision-2", target: "process-6", sourceHandle: "no", label: "No" },
        { id: "e11", source: "process-5", target: "end-1", type: "straight" },
        { id: "e12", source: "process-6", target: "end-1", type: "straight" }
      ]
    }
  },
  {
    name: "PCR Workflow",
    category: "Biology",
    description: "Polymerase Chain Reaction laboratory workflow for DNA amplification",
    tags: ["pcr", "dna", "molecular", "lab"],
    json: {
      nodes: [
        { id: "start-1", type: "start", position: { x: 100, y: 200 }, data: { label: "Start PCR" } },
        { id: "process-1", type: "process", position: { x: 300, y: 200 }, data: { label: "Prepare Master Mix" } },
        { id: "process-2", type: "process", position: { x: 500, y: 200 }, data: { label: "Thermocycling" } },
        { id: "process-3", type: "process", position: { x: 700, y: 200 }, data: { label: "Gel Electrophoresis" } },
        { id: "decision-1", type: "decision", position: { x: 900, y: 200 }, data: { label: "Bands Detected?", conditions: [{ id: "yes", label: "Yes" }, { id: "no", label: "No" }] } },
        { id: "process-4", type: "process", position: { x: 1100, y: 120 }, data: { label: "Document & Store" } },
        { id: "process-5", type: "process", position: { x: 1100, y: 280 }, data: { label: "Optimize Conditions" } },
        { id: "end-1", type: "end", position: { x: 1300, y: 200 }, data: { label: "Complete" } }
      ],
      edges: [
        { id: "e1", source: "start-1", target: "process-1", type: "straight" },
        { id: "e2", source: "process-1", target: "process-2", type: "straight" },
        { id: "e3", source: "process-2", target: "process-3", type: "straight" },
        { id: "e4", source: "process-3", target: "decision-1", type: "straight" },
        { id: "e5", source: "decision-1", target: "process-4", sourceHandle: "yes", label: "Yes" },
        { id: "e6", source: "decision-1", target: "process-5", sourceHandle: "no", label: "No" },
        { id: "e7", source: "process-4", target: "end-1", type: "straight" },
        { id: "e8", source: "process-5", target: "process-1", type: "straight" }
      ]
    }
  },
  {
    name: "Chemical Reaction Setup",
    category: "Chemistry",
    description: "Standard workflow for setting up and monitoring chemical reactions",
    tags: ["chemistry", "reaction", "safety", "lab"],
    json: {
      nodes: [
        { id: "start-1", type: "start", position: { x: 100, y: 200 }, data: { label: "Start Reaction" } },
        { id: "process-1", type: "process", position: { x: 300, y: 200 }, data: { label: "Select Reagents" } },
        { id: "process-2", type: "process", position: { x: 500, y: 200 }, data: { label: "Safety Checklist" } },
        { id: "process-3", type: "process", position: { x: 700, y: 200 }, data: { label: "Setup Apparatus" } },
        { id: "decision-1", type: "decision", position: { x: 900, y: 200 }, data: { label: "Temp/Pressure OK?", conditions: [{ id: "yes", label: "Yes" }, { id: "no", label: "No" }] } },
        { id: "action-1", type: "action", position: { x: 1100, y: 120 }, data: { label: "Run Reaction", actionType: "api" } },
        { id: "process-4", type: "process", position: { x: 900, y: 320 }, data: { label: "Adjust Parameters" } },
        { id: "process-5", type: "process", position: { x: 1300, y: 120 }, data: { label: "Quench Reaction" } },
        { id: "action-2", type: "action", position: { x: 1500, y: 120 }, data: { label: "Analyze Products", actionType: "db" } },
        { id: "end-1", type: "end", position: { x: 1700, y: 120 }, data: { label: "Complete" } }
      ],
      edges: [
        { id: "e1", source: "start-1", target: "process-1", type: "straight" },
        { id: "e2", source: "process-1", target: "process-2", type: "straight" },
        { id: "e3", source: "process-2", target: "process-3", type: "straight" },
        { id: "e4", source: "process-3", target: "decision-1", type: "straight" },
        { id: "e5", source: "decision-1", target: "action-1", sourceHandle: "yes", label: "Yes" },
        { id: "e6", source: "decision-1", target: "process-4", sourceHandle: "no", label: "No" },
        { id: "e7", source: "process-4", target: "decision-1", type: "straight" },
        { id: "e8", source: "action-1", target: "process-5", type: "straight" },
        { id: "e9", source: "process-5", target: "action-2", type: "straight" },
        { id: "e10", source: "action-2", target: "end-1", type: "straight" }
      ]
    }
  },
  {
    name: "Force & Motion Experiment",
    category: "Physics",
    description: "Physics lab workflow for measuring forces and calculating motion parameters",
    tags: ["physics", "force", "motion", "experiment"],
    json: {
      nodes: [
        { id: "start-1", type: "start", position: { x: 100, y: 200 }, data: { label: "Start Experiment" } },
        { id: "process-1", type: "process", position: { x: 300, y: 200 }, data: { label: "Calibrate Sensors" } },
        { id: "process-2", type: "process", position: { x: 500, y: 200 }, data: { label: "Run Trials" } },
        { id: "decision-1", type: "decision", position: { x: 700, y: 200 }, data: { label: "Outliers Detected?", conditions: [{ id: "yes", label: "Yes" }, { id: "no", label: "No" }] } },
        { id: "process-3", type: "process", position: { x: 700, y: 320 }, data: { label: "Exclude/Repeat" } },
        { id: "process-4", type: "process", position: { x: 900, y: 200 }, data: { label: "Aggregate Data" } },
        { id: "action-1", type: "action", position: { x: 1100, y: 200 }, data: { label: "Compute Acceleration", actionType: "api" } },
        { id: "process-5", type: "process", position: { x: 1300, y: 200 }, data: { label: "Graph Results" } },
        { id: "end-1", type: "end", position: { x: 1500, y: 200 }, data: { label: "Complete" } }
      ],
      edges: [
        { id: "e1", source: "start-1", target: "process-1", type: "straight" },
        { id: "e2", source: "process-1", target: "process-2", type: "straight" },
        { id: "e3", source: "process-2", target: "decision-1", type: "straight" },
        { id: "e4", source: "decision-1", target: "process-3", sourceHandle: "yes", label: "Yes" },
        { id: "e5", source: "decision-1", target: "process-4", sourceHandle: "no", label: "No" },
        { id: "e6", source: "process-3", target: "process-2", type: "straight" },
        { id: "e7", source: "process-4", target: "action-1", type: "straight" },
        { id: "e8", source: "action-1", target: "process-5", type: "straight" },
        { id: "e9", source: "process-5", target: "end-1", type: "straight" }
      ]
    }
  },
  {
    name: "Data Analysis Pipeline",
    category: "Data Analysis",
    description: "Statistical analysis workflow for processing and modeling scientific data",
    tags: ["statistics", "data", "analysis", "modeling"],
    json: {
      nodes: [
        { id: "start-1", type: "start", position: { x: 100, y: 200 }, data: { label: "Start Analysis" } },
        { id: "action-1", type: "action", position: { x: 300, y: 200 }, data: { label: "Import Dataset", actionType: "api" } },
        { id: "process-1", type: "process", position: { x: 500, y: 200 }, data: { label: "Clean Data" } },
        { id: "process-2", type: "process", position: { x: 700, y: 200 }, data: { label: "Feature Selection" } },
        { id: "decision-1", type: "decision", position: { x: 900, y: 200 }, data: { label: "Model Ready?", conditions: [{ id: "yes", label: "Yes" }, { id: "no", label: "No" }] } },
        { id: "action-2", type: "action", position: { x: 1100, y: 120 }, data: { label: "Train Model", actionType: "api" } },
        { id: "process-3", type: "process", position: { x: 900, y: 320 }, data: { label: "Iterate Features" } },
        { id: "action-3", type: "action", position: { x: 1300, y: 120 }, data: { label: "Evaluate Model", actionType: "api" } },
        { id: "process-4", type: "process", position: { x: 1500, y: 120 }, data: { label: "Generate Report" } },
        { id: "end-1", type: "end", position: { x: 1700, y: 120 }, data: { label: "Complete" } }
      ],
      edges: [
        { id: "e1", source: "start-1", target: "action-1", type: "straight" },
        { id: "e2", source: "action-1", target: "process-1", type: "straight" },
        { id: "e3", source: "process-1", target: "process-2", type: "straight" },
        { id: "e4", source: "process-2", target: "decision-1", type: "straight" },
        { id: "e5", source: "decision-1", target: "action-2", sourceHandle: "yes", label: "Yes" },
        { id: "e6", source: "decision-1", target: "process-3", sourceHandle: "no", label: "No" },
        { id: "e7", source: "process-3", target: "process-2", type: "straight" },
        { id: "e8", source: "action-2", target: "action-3", type: "straight" },
        { id: "e9", source: "action-3", target: "process-4", type: "straight" },
        { id: "e10", source: "process-4", target: "end-1", type: "straight" }
      ]
    }
  },
  {
    name: "General Lab Workflow",
    category: "Lab Workflow",
    description: "Cross-functional laboratory workflow for equipment booking and sample processing",
    tags: ["lab", "workflow", "equipment", "qc"],
    json: {
      nodes: [
        { id: "start-1", type: "start", position: { x: 100, y: 200 }, data: { label: "Start Lab Work" } },
        { id: "action-1", type: "action", position: { x: 300, y: 200 }, data: { label: "Book Equipment", actionType: "api" } },
        { id: "process-1", type: "process", position: { x: 500, y: 200 }, data: { label: "Prepare Samples" } },
        { id: "process-2", type: "process", position: { x: 700, y: 200 }, data: { label: "Perform Procedure" } },
        { id: "process-3", type: "process", position: { x: 900, y: 200 }, data: { label: "Record Observations" } },
        { id: "decision-1", type: "decision", position: { x: 1100, y: 200 }, data: { label: "QC Pass?", conditions: [{ id: "yes", label: "Yes" }, { id: "no", label: "No" }] } },
        { id: "action-2", type: "action", position: { x: 1300, y: 120 }, data: { label: "Archive Results", actionType: "db" } },
        { id: "process-4", type: "process", position: { x: 1100, y: 320 }, data: { label: "Rework Sample" } },
        { id: "end-1", type: "end", position: { x: 1500, y: 120 }, data: { label: "Complete" } }
      ],
      edges: [
        { id: "e1", source: "start-1", target: "action-1", type: "straight" },
        { id: "e2", source: "action-1", target: "process-1", type: "straight" },
        { id: "e3", source: "process-1", target: "process-2", type: "straight" },
        { id: "e4", source: "process-2", target: "process-3", type: "straight" },
        { id: "e5", source: "process-3", target: "decision-1", type: "straight" },
        { id: "e6", source: "decision-1", target: "action-2", sourceHandle: "yes", label: "Yes" },
        { id: "e7", source: "decision-1", target: "process-4", sourceHandle: "no", label: "No" },
        { id: "e8", source: "process-4", target: "process-2", type: "straight" },
        { id: "e9", source: "action-2", target: "end-1", type: "straight" }
      ]
    }
  }
];

async function seedScienceTemplates() {
  console.log('Seeding science templates...');
  
  for (const template of scienceTemplates) {
    await prisma.sciTemplate.create({
      data: {
        ...template,
        json: JSON.stringify(template.json),
        tags: JSON.stringify(template.tags)
      }
    });
  }
  
  console.log('Science templates seeded successfully!');
}

export { seedScienceTemplates };