import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const templateSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  previewImage: z.string().optional(),
  json: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any())
  })
});

const templates = [
  {
    id: 'random-word-generator',
    name: 'Random Word Generator',
    description: 'Generate random words based on category and length preferences.',
    category: 'Operations',
    nodeCount: 7,
    edgeCount: 8,
    previewImage: '/templates/random-word-generator.png',
    data: {
      nodes: [
        { id: 'n1', type: 'start', position: { x: 100, y: 100 }, data: { label: 'Start Generator' } },
        { id: 'n2', type: 'decision', position: { x: 300, y: 100 }, data: { label: 'Category Type?', conditions: [{ id: 'animals', condition: 'category === "animals"', label: 'Animals' }, { id: 'colors', condition: 'category === "colors"', label: 'Colors' }], defaultPath: 'Random' } },
        { id: 'n3', type: 'action', position: { x: 500, y: 50 }, data: { label: 'Generate Animal Word', actionType: 'api' } },
        { id: 'n4', type: 'action', position: { x: 500, y: 150 }, data: { label: 'Generate Color Word', actionType: 'api' } },
        { id: 'n5', type: 'action', position: { x: 500, y: 250 }, data: { label: 'Generate Random Word', actionType: 'api' } },
        { id: 'n6', type: 'decision', position: { x: 700, y: 150 }, data: { label: 'Word Length OK?', conditions: [{ id: 'yes', condition: 'word.length >= minLength && word.length <= maxLength', label: 'Yes' }, { id: 'no', condition: 'word.length < minLength || word.length > maxLength', label: 'No' }], defaultPath: 'Yes' } },
        { id: 'n7', type: 'end', position: { x: 900, y: 150 }, data: { label: 'Return Word' } }
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2', label: 'Start' },
        { id: 'e2', source: 'n2', target: 'n3', sourceHandle: 'animals', label: 'Animals' },
        { id: 'e3', source: 'n2', target: 'n4', sourceHandle: 'colors', label: 'Colors' },
        { id: 'e4', source: 'n2', target: 'n5', sourceHandle: 'default', label: 'Random' },
        { id: 'e5', source: 'n3', target: 'n6', label: 'Check Length' },
        { id: 'e6', source: 'n4', target: 'n6', label: 'Check Length' },
        { id: 'e7', source: 'n5', target: 'n6', label: 'Check Length' },
        { id: 'e8', source: 'n6', target: 'n7', sourceHandle: 'yes', label: 'Valid' },
        { id: 'e9', source: 'n6', target: 'n2', sourceHandle: 'no', label: 'Retry' }
      ]
    }
  },
  {
    id: 'headcount-approval',
    name: 'Headcount Approval Flow',
    description: 'Role and budget approval sequence for new hires.',
    category: 'HR Process',
    nodeCount: 5,
    edgeCount: 6,
    previewImage: '/templates/headcount-approval.png',
    data: {
      nodes: [
        { id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'n2', type: 'decision', position: { x: 200, y: 0 }, data: { label: 'Role Approved?', conditions: [{ condition: 'role_approved === true', label: 'Yes' }, { condition: 'role_approved === false', label: 'No' }], defaultPath: 'No' } },
        { id: 'n3', type: 'decision', position: { x: 400, y: 0 }, data: { label: 'Finance Approved?', conditions: [{ condition: 'finance_approved === true', label: 'Yes' }, { condition: 'finance_approved === false', label: 'No' }], defaultPath: 'No' } },
        { id: 'n4', type: 'action', position: { x: 600, y: 0 }, data: { label: 'Recruiting Kick-off', actionType: 'email' } },
        { id: 'n5', type: 'end', position: { x: 800, y: 0 }, data: { label: 'End' } }
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2', label: 'Begin' },
        { id: 'e2', source: 'n2', target: 'n3', label: 'Yes' },
        { id: 'e3', source: 'n2', target: 'n5', label: 'No' },
        { id: 'e4', source: 'n3', target: 'n4', label: 'Yes' },
        { id: 'e5', source: 'n3', target: 'n5', label: 'No' },
        { id: 'e6', source: 'n4', target: 'n5', label: 'Complete' }
      ]
    }
  },
  {
    id: 'employee-onboarding',
    name: 'Employee Onboarding Flow',
    description: 'Pre-boarding and training workflow for new employees.',
    category: 'Operations',
    nodeCount: 6,
    edgeCount: 6,
    previewImage: '/templates/employee-onboarding.png',
    data: {
      nodes: [
        { id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'n2', type: 'action', position: { x: 200, y: 0 }, data: { label: 'Send Welcome Email', actionType: 'email' } },
        { id: 'n3', type: 'process', position: { x: 400, y: 0 }, data: { label: 'Pre-boarding Checklist' } },
        { id: 'n4', type: 'decision', position: { x: 600, y: 0 }, data: { label: 'Training Completed?', conditions: [{ condition: 'training_completed === true', label: 'Yes' }, { condition: 'training_completed === false', label: 'No' }], defaultPath: 'No' } },
        { id: 'n5', type: 'action', position: { x: 800, y: 0 }, data: { label: 'Assign Mentor', actionType: 'db' } },
        { id: 'n6', type: 'end', position: { x: 1000, y: 0 }, data: { label: 'End' } }
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2', label: 'Begin' },
        { id: 'e2', source: 'n2', target: 'n3', label: 'Complete' },
        { id: 'e3', source: 'n3', target: 'n4', label: 'Check' },
        { id: 'e4', source: 'n4', target: 'n5', label: 'Yes' },
        { id: 'e5', source: 'n4', target: 'n3', label: 'No' },
        { id: 'e6', source: 'n5', target: 'n6', label: 'Finish' }
      ]
    }
  }
];

router.get('/', async (req, res) => {
  try {
    const dbTemplates = await prisma.templateMaster.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        previewImage: true,
        json: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Add nodeCount and edgeCount for database templates
    const dbTemplatesWithCounts = dbTemplates.map(template => {
      try {
        const data = JSON.parse(template.json);
        return {
          ...template,
          nodeCount: data.nodes?.length || 0,
          edgeCount: data.edges?.length || 0,
          json: undefined // Remove json from response
        };
      } catch {
        return {
          ...template,
          nodeCount: 0,
          edgeCount: 0,
          json: undefined
        };
      }
    });
    
    // Include static templates for backward compatibility
    const staticTemplates = templates.map(({ data, ...template }) => ({
      ...template,
      id: template.id,
      createdAt: new Date().toISOString()
    }));
    
    res.json([...dbTemplatesWithCounts, ...staticTemplates]);
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try database first
    const dbTemplate = await prisma.templateMaster.findUnique({
      where: { id }
    });
    
    if (dbTemplate) {
      return res.json({
        ...dbTemplate,
        json: JSON.parse(dbTemplate.json)
      });
    }
    
    // Fallback to static templates
    const staticTemplate = templates.find(t => t.id === id);
    if (!staticTemplate) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(staticTemplate);
  } catch (error) {
    console.error('Failed to fetch template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

router.post('/', async (req, res) => {
  try {
    const validatedData = templateSchema.parse(req.body);
    
    const template = await prisma.templateMaster.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description,
        previewImage: validatedData.previewImage,
        json: JSON.stringify(validatedData.json)
      }
    });
    
    res.status(201).json({
      ...template,
      json: JSON.parse(template.json)
    });
  } catch (error) {
    console.error('Failed to create template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = templateSchema.parse(req.body);
    
    const template = await prisma.templateMaster.update({
      where: { id },
      data: {
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description,
        previewImage: validatedData.previewImage,
        json: JSON.stringify(validatedData.json)
      }
    });
    
    res.json({
      ...template,
      json: JSON.parse(template.json)
    });
  } catch (error) {
    console.error('Failed to update template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.templateMaster.delete({
      where: { id }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

export default router;