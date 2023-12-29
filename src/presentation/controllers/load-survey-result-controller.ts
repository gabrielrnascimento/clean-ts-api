import { type Controller, type HttpRequest, type HttpResponse } from '../protocols';
import { forbidden, ok, serverError } from '../helpers';
import { type LoadSurveyById, type LoadSurveyResult } from '@/domain/usecases';
import { InvalidParamError } from '../errors';

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { };

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = httpRequest.params.surveyId;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId, httpRequest.accountId);
      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
