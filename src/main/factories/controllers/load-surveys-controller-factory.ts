import { type Controller } from '@/presentation/protocols';
import { makeDbLoadSurveys } from '../usecases';
import { LoadSurveysController } from '@/presentation/controllers';
import { makeLogControllerDecorator } from '../decorators';

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};
