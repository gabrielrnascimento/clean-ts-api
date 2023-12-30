import { type Controller, type HttpResponse } from '../protocols';
import { forbidden, ok, serverError } from '../helpers';
import { type LoadSurveyById, type LoadSurveyResult } from '@/domain/usecases';
import { InvalidParamError } from '../errors';

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { };

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const surveyId = request.surveyId;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId, request.accountId);
      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  };
}