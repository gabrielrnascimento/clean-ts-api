import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory';
import { adaptMiddleware } from '../adapters';

export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
