import { PrismaClient } from '@prisma/client';
import { seedScienceTemplates } from './seedScience';

const prisma = new PrismaClient();

async function main() {
  // Create sample flow
  const sampleFlow = await prisma.flowMaster.create({
    data: {
      name: 'Lead Qualification Flow',
      description: 'Salesforce-style lead qualification process',
      status: 'draft',
      nodes: {
        create: [
          {
            nodeId: 'start-1',
            type: 'start',
            label: 'Start Process',
            data: JSON.stringify({ label: 'Lead Entry' }),
            positionX: 100,
            positionY: 100,
          },
          {
            nodeId: 'decision-1',
            type: 'decision',
            label: 'Check Revenue',
            data: JSON.stringify({
              label: 'Revenue > $1M?',
              conditions: [
                {
                  id: 'high-value',
                  label: 'High Value',
                  expression: 'amount > 1000000'
                }
              ],
              defaultPath: 'low-value'
            }),
            positionX: 100,
            positionY: 250,
          },
          {
            nodeId: 'action-1',
            type: 'action',
            label: 'Enterprise Team',
            data: JSON.stringify({
              label: 'Assign to Enterprise',
              actionType: 'email',
              config: {
                to: 'enterprise@company.com',
                subject: 'New High-Value Lead'
              },
              outputVar: 'assignment_result'
            }),
            positionX: 300,
            positionY: 200,
          },
          {
            nodeId: 'action-2',
            type: 'action',
            label: 'SMB Team',
            data: JSON.stringify({
              label: 'Assign to SMB',
              actionType: 'email',
              config: {
                to: 'smb@company.com',
                subject: 'New Lead'
              },
              outputVar: 'assignment_result'
            }),
            positionX: 300,
            positionY: 300,
          },
          {
            nodeId: 'end-1',
            type: 'end',
            label: 'Process Complete',
            data: JSON.stringify({ label: 'Lead Processed' }),
            positionX: 500,
            positionY: 250,
          },
        ],
      },
      edges: {
        create: [
          {
            edgeId: 'e1-2',
            source: 'start-1',
            target: 'decision-1',
          },
          {
            edgeId: 'e2-3',
            source: 'decision-1',
            target: 'action-1',
            sourceHandle: 'high-value',
            label: 'High Value',
          },
          {
            edgeId: 'e2-4',
            source: 'decision-1',
            target: 'action-2',
            sourceHandle: 'default',
            label: 'Standard',
          },
          {
            edgeId: 'e3-5',
            source: 'action-1',
            target: 'end-1',
          },
          {
            edgeId: 'e4-5',
            source: 'action-2',
            target: 'end-1',
          },
        ],
      },
      variables: {
        create: [
          {
            name: 'amount',
            type: 'number',
            defaultValue: "500000",
          },
          {
            name: 'industry',
            type: 'string',
            defaultValue: 'technology',
          },
        ],
      },
    },
  });

  console.log('Created sample flow:', sampleFlow);

  // Create Random Word Brainstorming template
  const randomWordTemplate = await prisma.templateMaster.create({
    data: {
      name: 'Random Word Brainstorming',
      category: 'Ideation & Creativity',
      description: 'Facilitates idea generation through association with randomly chosen words — based on Miro\'s Random Words Brainstorming template.',
      previewImage: '/templates/random-word-brainstorming.png',
      json: JSON.stringify({
        meta: { version: 1, author: 'HBMP Team' },
        nodes: [
          {
            id: 'n1',
            type: 'start',
            position: { x: 600, y: 100 },
            data: { 
              label: 'Start Session', 
              notes: 'Initiate brainstorming session.',
              style: {
                fillColor: '#e1f5fe',
                borderColor: '#0277bd',
                borderWidth: 1,
                textColor: '#01579b',
                fontSize: 13,
                fontFamily: 'Inter, Roboto, sans-serif',
                borderRadius: 50,
                shadow: true
              }
            }
          },
          {
            id: 'n2',
            type: 'action',
            position: { x: 600, y: 300 },
            data: {
              label: 'Generate Random Word',
              actionType: 'api',
              config: { endpoint: 'https://random-word-api.herokuapp.com/word' },
              notes: 'Fetch a random word to spark ideas.',
              style: {
                fillColor: '#e8f5e8',
                borderColor: '#388e3c',
                borderWidth: 1,
                textColor: '#1b5e20',
                fontSize: 13,
                fontFamily: 'Inter, Roboto, sans-serif',
                borderRadius: 8,
                shadow: true
              }
            }
          },
          {
            id: 'n3',
            type: 'process',
            position: { x: 600, y: 500 },
            data: {
              label: 'Write Associations',
              notes: 'Note first thoughts, objects, or concepts linked to the word.',
              style: {
                fillColor: '#f3e5f5',
                borderColor: '#7b1fa2',
                borderWidth: 1,
                textColor: '#4a148c',
                fontSize: 13,
                fontFamily: 'Inter, Roboto, sans-serif',
                borderRadius: 8,
                shadow: true
              }
            }
          },
          {
            id: 'n4',
            type: 'process',
            position: { x: 600, y: 700 },
            data: {
              label: 'Generate Ideas',
              notes: 'Combine associations into new ideas or solutions.',
              style: {
                fillColor: '#f3e5f5',
                borderColor: '#7b1fa2',
                borderWidth: 1,
                textColor: '#4a148c',
                fontSize: 13,
                fontFamily: 'Inter, Roboto, sans-serif',
                borderRadius: 8,
                shadow: true
              }
            }
          },
          {
            id: 'n5',
            type: 'decision',
            position: { x: 600, y: 900 },
            data: {
              label: 'Is Idea Interesting?',
              conditions: [{ id: 'yes', label: 'Yes', expression: 'interesting == true' }],
              defaultPath: 'no',
              notes: 'Evaluate the idea\'s potential or relevance.',
              style: {
                fillColor: '#fff3e0',
                borderColor: '#f57c00',
                borderWidth: 1,
                textColor: '#e65100',
                fontSize: 13,
                fontFamily: 'Inter, Roboto, sans-serif',
                borderRadius: 0,
                shadow: true
              }
            }
          },
          {
            id: 'n6',
            type: 'action',
            position: { x: 400, y: 1100 },
            data: {
              label: 'Expand Idea',
              actionType: 'process',
              notes: 'Refine or develop the concept further.',
              style: {
                fillColor: '#e8f5e8',
                borderColor: '#388e3c',
                borderWidth: 1,
                textColor: '#1b5e20',
                fontSize: 13,
                fontFamily: 'Inter, Roboto, sans-serif',
                borderRadius: 8,
                shadow: true
              }
            }
          },
          {
            id: 'n7',
            type: 'action',
            position: { x: 800, y: 1100 },
            data: {
              label: 'Pick Another Word',
              actionType: 'api',
              config: { endpoint: 'https://random-word-api.herokuapp.com/word' },
              notes: 'If idea is not interesting, generate a new word and restart loop.',
              style: {
                fillColor: '#e8f5e8',
                borderColor: '#388e3c',
                borderWidth: 1,
                textColor: '#1b5e20',
                fontSize: 13,
                fontFamily: 'Inter, Roboto, sans-serif',
                borderRadius: 8,
                shadow: true
              }
            }
          },
          {
            id: 'n8',
            type: 'process',
            position: { x: 400, y: 1300 },
            data: {
              label: 'Document Findings',
              notes: 'Summarize ideas and insights from the session.',
              style: {
                fillColor: '#f3e5f5',
                borderColor: '#7b1fa2',
                borderWidth: 1,
                textColor: '#4a148c',
                fontSize: 13,
                fontFamily: 'Inter, Roboto, sans-serif',
                borderRadius: 8,
                shadow: true
              }
            }
          },
          {
            id: 'n9',
            type: 'end',
            position: { x: 400, y: 1500 },
            data: { 
              label: 'End Session', 
              notes: 'Session complete.',
              style: {
                fillColor: '#e1f5fe',
                borderColor: '#0277bd',
                borderWidth: 1,
                textColor: '#01579b',
                fontSize: 13,
                fontFamily: 'Inter, Roboto, sans-serif',
                borderRadius: 50,
                shadow: true
              }
            }
          },
          {
            id: 'n10',
            type: 'annotation',
            position: { x: 200, y: 700 },
            data: {
              label: 'Tips for Facilitators',
              notes: 'Encourage wild ideas and no judgment during association stage.',
              style: {
                fillColor: '#f5f5f5',
                borderColor: '#616161',
                borderWidth: 1,
                textColor: '#212121',
                fontSize: 13,
                fontFamily: 'Inter, Roboto, sans-serif',
                borderRadius: 4,
                shadow: true
              }
            }
          }
        ],
        edges: [
          { 
            id: 'e1', 
            source: 'n1', 
            target: 'n2', 
            label: '',
            style: {
              strokeColor: '#424242',
              strokeWidth: 1,
              style: 'orthogonal',
              arrowHead: 'triangle'
            }
          },
          { 
            id: 'e2', 
            source: 'n2', 
            target: 'n3', 
            label: '',
            style: {
              strokeColor: '#424242',
              strokeWidth: 1,
              style: 'orthogonal',
              arrowHead: 'triangle'
            }
          },
          { 
            id: 'e3', 
            source: 'n3', 
            target: 'n4', 
            label: '',
            style: {
              strokeColor: '#424242',
              strokeWidth: 1,
              style: 'orthogonal',
              arrowHead: 'triangle'
            }
          },
          { 
            id: 'e4', 
            source: 'n4', 
            target: 'n5', 
            label: '',
            style: {
              strokeColor: '#424242',
              strokeWidth: 1,
              style: 'orthogonal',
              arrowHead: 'triangle'
            }
          },
          { 
            id: 'e5', 
            source: 'n5', 
            target: 'n6', 
            sourceHandle: 'yes',
            label: 'Yes',
            style: {
              strokeColor: '#388e3c',
              strokeWidth: 1,
              style: 'orthogonal',
              arrowHead: 'triangle',
              labelBgColor: '#ffffff'
            }
          },
          { 
            id: 'e6', 
            source: 'n5', 
            target: 'n7', 
            sourceHandle: 'no',
            label: 'No',
            style: {
              strokeColor: '#f57c00',
              strokeWidth: 1,
              style: 'orthogonal',
              arrowHead: 'triangle',
              labelBgColor: '#ffffff'
            }
          },
          { 
            id: 'e7', 
            source: 'n6', 
            target: 'n8', 
            label: '',
            style: {
              strokeColor: '#424242',
              strokeWidth: 1,
              style: 'orthogonal',
              arrowHead: 'triangle'
            }
          },
          { 
            id: 'e8', 
            source: 'n7', 
            target: 'n2', 
            label: 'Retry',
            style: {
              strokeColor: '#9e9e9e',
              strokeWidth: 1,
              style: 'orthogonal',
              arrowHead: 'triangle',
              dashed: true,
              labelBgColor: '#ffffff'
            }
          },
          { 
            id: 'e9', 
            source: 'n8', 
            target: 'n9', 
            label: '',
            style: {
              strokeColor: '#424242',
              strokeWidth: 1,
              style: 'orthogonal',
              arrowHead: 'triangle'
            }
          }
        ]
      })
    }
  });

  console.log('Created Random Word Brainstorming template:', randomWordTemplate);

  // Seed science templates
  await seedScienceTemplates();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });