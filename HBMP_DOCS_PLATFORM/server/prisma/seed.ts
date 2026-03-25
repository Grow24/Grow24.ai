import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Business Case template
  const businessCaseTemplate = await prisma.documentTemplate.upsert({
    where: { code: 'BUSINESS_CASE' },
    update: {},
    create: {
      name: 'Business Case',
      code: 'BUSINESS_CASE',
      level: 'C',
      version: 1,
      isActive: true,
      sections: {
        create: [
          {
            title: 'Introduction',
            order: 1,
            description: 'Purpose of the business case and primary audience',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Describe the purpose of this business case and identify the primary audience (Sponsor, SME, PM, IT, Finance, etc.)',
                order: 1,
              },
            },
          },
          {
            title: 'Needs Statement',
            order: 2,
            description: 'Problem/Opportunity statement',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Format: "Problem/Opportunity of X → Effect of Y → Impact of Z"',
                order: 1,
              },
            },
          },
          {
            title: 'Goals & Objectives',
            order: 3,
            description: 'High-level goals and detailed objectives',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Include high-level goals and detailed objectives with SMART breakdown (Specific, Measurable, Attainable, Relevant, Time-bound)',
                order: 1,
              },
            },
          },
          {
            title: 'Situation Analysis',
            order: 4,
            description: 'Current state, root cause, opportunity, and gap analysis',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Cover current-state analysis, root cause analysis, opportunity analysis, and gap analysis',
                order: 1,
              },
            },
          },
          {
            title: 'Alternative Assessment',
            order: 5,
            description: 'Solution approach options and levels',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Evaluate solution approaches (Build vs Buy vs Hybrid) and solution option levels (Do Nothing, Minimum Effort/Low Impact, Maximum Effort/High Impact)',
                order: 1,
              },
            },
          },
          {
            title: 'Cost–Benefit Analysis',
            order: 6,
            description: 'Financial analysis and feasibility',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Include high-level feasibility & financial analysis. Methods: IRR, NPV, Payback Period, ROI',
                order: 1,
              },
            },
          },
          {
            title: 'Risk Analysis',
            order: 7,
            description: 'Constraints, assumptions, risks, and dependencies',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Document constraints, assumptions, risks, and dependencies',
                order: 1,
              },
            },
          },
          {
            title: 'Solution Recommendation',
            order: 8,
            description: 'Recommended solution and selection rationale',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Describe the recommended solution, solution options ranking (e.g., weighted matrix), primary reason for selection, and key deliverables',
                order: 1,
              },
            },
          },
          {
            title: 'Implementation Approach',
            order: 9,
            description: 'Milestones, roles, dependencies, and timelines',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Include milestones/roadmap, roles & responsibilities (RACI), implementation dependencies, and high-level timelines',
                order: 1,
              },
            },
          },
          {
            title: 'Evaluation Measures',
            order: 10,
            description: 'Metrics, measurement methods, baseline and target metrics',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Define metric description, method of measuring, baseline metrics, and target metrics',
                order: 1,
              },
            },
          },
          {
            title: 'Supporting Documentation & Approvals',
            order: 11,
            description: 'Appendices and sign-off section',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'List appendix/attachments and approvers & sign-off section',
                order: 1,
              },
            },
          },
        ],
      },
    },
  });

  console.log('Created Business Case template:', businessCaseTemplate.id);

  // Create BRD template
  const brdTemplate = await prisma.documentTemplate.upsert({
    where: { code: 'BRD' },
    update: {},
    create: {
      name: 'Business Requirements Document',
      code: 'BRD',
      level: 'C',
      version: 1,
      isActive: true,
      sections: {
        create: [
          {
            title: 'BRD Overview',
            order: 1,
            description: 'Short overview of the business requirements and why this BRD exists',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Provide a brief overview of the business requirements and the purpose of this BRD',
                order: 1,
              },
            },
          },
          {
            title: 'Needs Statement',
            order: 2,
            description: 'Problem Statement and/or Opportunity Statement',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Document the problem statement and/or opportunity statement',
                order: 1,
              },
            },
          },
          {
            title: 'Business Goals',
            order: 3,
            description: 'High-level goals (can be multiple bullets/rows)',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'List high-level business goals',
                order: 1,
              },
            },
          },
          {
            title: 'Business Objectives',
            order: 4,
            description: 'More specific, measurable objectives derived from goals',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Define specific, measurable objectives derived from the business goals',
                order: 1,
              },
            },
          },
          {
            title: 'Success Metrics',
            order: 5,
            description: 'KPIs / measures to check if objectives are achieved',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Define KPIs and measures to evaluate if objectives are achieved',
                order: 1,
              },
            },
          },
          {
            title: 'Stakeholder Requirements – Overview',
            order: 6,
            description: 'Overview of stakeholder requirements',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Provide an overview of stakeholder requirements',
                order: 1,
              },
            },
          },
          {
            title: 'Stakeholder List',
            order: 7,
            description: 'Table: Name, Persona/Role/Hierarchy, Hook, Interest, Influence',
            fields: {
              create: {
                label: 'Stakeholder Data',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Table format: Name | Persona / Role / Hierarchy | Hook (aspirations, likes/dislikes) | Interest (Low/Medium/High) | Influence (Low/Medium/High)',
                order: 1,
              },
            },
          },
          {
            title: 'Stakeholder Requirements List',
            order: 8,
            description: 'Grouped by stakeholder group: Requirement ID, Requirement Description',
            fields: {
              create: {
                label: 'Requirements Data',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Grouped by stakeholder group. Format: Stakeholder Group | Requirement ID | Requirement Description',
                order: 1,
              },
            },
          },
          {
            title: 'Business Process – Summary',
            order: 9,
            description: 'Key issues/opportunities in AS-IS, Future state TO-BE overview, Expected benefits',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Describe key issues/opportunities in AS-IS, future state TO-BE overview, and expected benefits',
                order: 1,
              },
            },
          },
          {
            title: 'AS-IS Process',
            order: 10,
            description: 'Location / link to detailed AS-IS model, Last updated date',
            fields: {
              create: {
                label: 'Process Data',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Table format: Location / Link | Last Updated Date',
                order: 1,
              },
            },
          },
          {
            title: 'TO-BE Process',
            order: 11,
            description: 'Location / link to detailed TO-BE model, Last updated date',
            fields: {
              create: {
                label: 'Process Data',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Table format: Location / Link | Last Updated Date',
                order: 1,
              },
            },
          },
          {
            title: 'Solution Scope – Narrative',
            order: 12,
            description: 'Narrative explanation of in-scope, out-of-scope, impacts',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Provide narrative explanation of in-scope capabilities, out-of-scope capabilities, and impacts on data, processes, business rules, etc.',
                order: 1,
              },
            },
          },
          {
            title: 'In-Scope Items',
            order: 13,
            description: 'Table: Release Number, In-scope Item',
            fields: {
              create: {
                label: 'In-Scope Data',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Table format: Release Number | In-scope Item',
                order: 1,
              },
            },
          },
          {
            title: 'Out-of-Scope Items',
            order: 14,
            description: 'Table: Release Number, Out-of-scope Item',
            fields: {
              create: {
                label: 'Out-of-Scope Data',
                dataType: 'RICH_TEXT',
                mandatory: true,
                helpText: 'Table format: Release Number | Out-of-scope Item',
                order: 1,
              },
            },
          },
          {
            title: 'Constraints – Scope',
            order: 15,
            description: 'Table: ID, Unit of Measure, Description',
            fields: {
              create: {
                label: 'Constraints Data',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Table format: ID | Unit of Measure | Description',
                order: 1,
              },
            },
          },
          {
            title: 'Constraints – Schedule',
            order: 16,
            description: 'Table: ID, Unit of Measure, Description',
            fields: {
              create: {
                label: 'Constraints Data',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Table format: ID | Unit of Measure | Description',
                order: 1,
              },
            },
          },
          {
            title: 'Constraints – Cost',
            order: 17,
            description: 'Table: ID, Unit of Measure, Description',
            fields: {
              create: {
                label: 'Constraints Data',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Table format: ID | Unit of Measure | Description',
                order: 1,
              },
            },
          },
          {
            title: 'Constraints – Quality',
            order: 18,
            description: 'Table: ID, Unit of Measure, Description',
            fields: {
              create: {
                label: 'Constraints Data',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Table format: ID | Unit of Measure | Description',
                order: 1,
              },
            },
          },
          {
            title: 'Constraints – Resource',
            order: 19,
            description: 'Table: ID, Unit of Measure, Description',
            fields: {
              create: {
                label: 'Constraints Data',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Table format: ID | Unit of Measure | Description',
                order: 1,
              },
            },
          },
          {
            title: 'Constraints – Risk',
            order: 20,
            description: 'Table: ID, Unit of Measure, Description',
            fields: {
              create: {
                label: 'Constraints Data',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Table format: ID | Unit of Measure | Description',
                order: 1,
              },
            },
          },
          {
            title: 'Assumptions',
            order: 21,
            description: 'Assumptions section',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Document assumptions',
                order: 1,
              },
            },
          },
          {
            title: 'Dependencies',
            order: 22,
            description: 'Dependencies section',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Document dependencies',
                order: 1,
              },
            },
          },
          {
            title: 'Glossary',
            order: 23,
            description: 'Table: Term, Definition',
            fields: {
              create: {
                label: 'Glossary Data',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Table format: Term | Definition',
                order: 1,
              },
            },
          },
          {
            title: 'Appendix',
            order: 24,
            description: 'Appendix section',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Additional supporting documentation',
                order: 1,
              },
            },
          },
          {
            title: 'Approval & Signoff',
            order: 25,
            description: 'Approval and signoff section',
            fields: {
              create: {
                label: 'Content',
                dataType: 'RICH_TEXT',
                mandatory: false,
                helpText: 'Approvers and sign-off section',
                order: 1,
              },
            },
          },
        ],
      },
    },
  });

  console.log('Created BRD template:', brdTemplate.id);
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

