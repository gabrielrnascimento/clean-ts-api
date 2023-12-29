import { type HttpRequest, type Controller, type HttpResponse, type LoadSurveyById, forbidden, InvalidParamError, serverError, type LoadSurveyResult, ok } from './load-survey-result-controller-protocols';

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
