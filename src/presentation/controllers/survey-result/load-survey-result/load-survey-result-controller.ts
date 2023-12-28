import { type HttpRequest, type Controller, type HttpResponse, type LoadSurveyById } from './load-survey-result-controller-protocols';

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) { };

  async handle (request: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(request.params.surveyId);
    return null;
  }
}
