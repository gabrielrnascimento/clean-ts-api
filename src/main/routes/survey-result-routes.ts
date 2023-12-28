import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { auth } from '@/main/middlewares/auth';
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result-factory';
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/load-survey-result-factory';
import { type Router } from 'express';

export default (router: Router): void => {
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultController()));
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()));
};
