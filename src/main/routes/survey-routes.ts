import { type Router } from 'express';
import { makeAddSurveyController } from '@/main/factories/controllers/add-survey-controller-factory';
import { makeLoadSurveysController } from '@/main/factories/controllers/load-surveys-controller-factory';
import { auth } from '@/main/middlewares/auth';
import { adminAuth } from '@/main/middlewares/admin-auth';
import { adaptRoute } from '../adapters';

export default (router: Router): void => {
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()));
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
};
