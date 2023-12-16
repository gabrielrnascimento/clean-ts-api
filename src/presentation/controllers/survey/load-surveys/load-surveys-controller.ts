import { type LoadSurveys, type Controller, type HttpRequest, type HttpResponse } from './load-surveys-controller-protocols';

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load();
    return null;
  }
}
