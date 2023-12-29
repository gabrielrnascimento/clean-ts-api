import { SaveSurveyResultController } from '@/presentation/controllers';
import { makeLogControllerDecorator } from '../decorators';
import { makeDbLoadSurveyById, makeDbSaveSurveyResult } from '../usecases';
import { type Controller } from '@/presentation/protocols';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult());
  return makeLogControllerDecorator(controller);
};
