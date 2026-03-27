import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import healthRoutes from './routes/health.routes';
import projectsRoutes from './routes/projects.routes';
import templatesRoutes from './routes/templates.routes';
import documentsProjectRoutes from './routes/documents-project.routes';
import documentsIdRoutes from './routes/documents-id.routes';
import attachmentsRoutes from './routes/attachments.routes';
import exportRoutes from './routes/export.routes';
import workflowRoutes from './routes/workflow.routes';
import sectionDocketsRoutes from './routes/sectionDockets.routes';
import importRoutes from './routes/import.routes';
import googleAuthRoutes, { googleCallbackRouter } from './routes/googleAuth.routes';
import wopiRoutes from './routes/wopi.routes';
import officeRoutes from './routes/office.routes';
import shareRoutes from './routes/share.routes';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/projects', projectsRoutes);
// Documents routes - split by path pattern
app.use('/api', documentsProjectRoutes); // For /projects/:id/dockets/:id/documents and /projects/:id/documents
app.use('/api/documents', documentsIdRoutes); // For /:documentId routes (getById, update, status)
app.use('/api', attachmentsRoutes); // For /documents/:id/attachments
app.use('/api/documents', exportRoutes); // For /:id/export
app.use('/api/documents', workflowRoutes); // For /:id/workflow/*
app.use('/api/section-dockets', sectionDocketsRoutes); // For section dockets management
app.use('/api/import', importRoutes); // For import from Google Sheets/Docs
app.use('/api', googleAuthRoutes); // For Google OAuth (auth/google endpoint)
app.use('/', googleCallbackRouter); // For Google OAuth callback (google/oauth/callback)

// WOPI Host routes - must be at /wopi for Collabora integration
app.use('/wopi', wopiRoutes); // WOPI protocol endpoints (CheckFileInfo, GetFile, PutFile)
app.use('/api/office', officeRoutes); // Helper endpoints for opening files in Collabora
app.use('/api', shareRoutes); // File sharing endpoints

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.stack : {},
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

export default app;

