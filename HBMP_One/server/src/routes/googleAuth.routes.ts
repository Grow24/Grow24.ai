import { Router } from 'express';
import { initiateGoogleAuth, handleGoogleCallback } from '../controllers/googleAuth.controller';

const router = Router();

// Auth initiation - under /api/auth/google
router.get('/auth/google', initiateGoogleAuth);

// Callback - at root level /google/oauth/callback
export const googleCallbackRouter = Router();
googleCallbackRouter.get('/google/oauth/callback', handleGoogleCallback);

export default router;

