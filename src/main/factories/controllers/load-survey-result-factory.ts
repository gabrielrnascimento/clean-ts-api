import { LoadSurveyResultController } from '@/presentation/controllers';
import { type Controller } from '@/presentation/protocols';
import { makeDbLoadSurveyById, makeDbLoadSurveyResult } from '../usecases';
import { makeLogControllerDecorator } from '../decorators';

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult());
  return makeLogControllerDecorator(controller);
};
