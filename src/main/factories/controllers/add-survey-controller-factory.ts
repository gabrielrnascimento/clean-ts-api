import { AddSurveyController } from '@/presentation/controllers';
import { type Controller } from '@/presentation/protocols';
import { makeAddSurveyValidation } from './add-survey-validation-factory';
import { makeDbAddSurvey } from '../usecases';
import { makeLogControllerDecorator } from '../decorators';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey());
  return makeLogControllerDecorator(controller);
};
