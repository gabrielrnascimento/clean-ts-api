import { LoadSurveyResultController } from '@/presentation/controllers';
import { type Controller } from '@/presentation/protocols';
import { makeDbCheckSurveyById, makeDbLoadSurveyResult } from '../usecases';
import { makeLogControllerDecorator } from '../decorators';

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult());
  return makeLogControllerDecorator(controller);
};
