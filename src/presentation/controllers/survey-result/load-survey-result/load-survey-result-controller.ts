import { type HttpRequest, type Controller, type HttpResponse, type LoadSurveyById, forbidden, InvalidParamError, serverError } from './load-survey-result-controller-protocols';

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) { };

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(request.params.surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
