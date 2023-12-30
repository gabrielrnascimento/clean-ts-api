import { SaveSurveyResultController } from '@/presentation/controllers';
import { makeLogControllerDecorator } from '../decorators';
import { makeDbLoadAnswersBySurvey, makeDbSaveSurveyResult } from '../usecases';
import { type Controller } from '@/presentation/protocols';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadAnswersBySurvey(), makeDbSaveSurveyResult());
  return makeLogControllerDecorator(controller);
};
