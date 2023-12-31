import { type Controller, type HttpResponse } from '../protocols';
import { forbidden, ok, serverError } from '../helpers';
import { type CheckSurveyById, type LoadSurveyResult } from '@/domain/usecases';
import { InvalidParamError } from '../errors';

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { };

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const surveyId = request.surveyId;
      const exists = await this.checkSurveyById.checkById(surveyId);
      if (!exists) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId, request.accountId);
      return ok(surveyResult);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  };
}
