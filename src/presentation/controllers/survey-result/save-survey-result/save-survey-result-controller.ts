import { type HttpResponse, type Controller, type HttpRequest, type LoadSurveyById, forbidden, InvalidParamError, serverError, type SaveSurveyResult, ok } from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const { accountId } = httpRequest;

      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const answers = survey.answers.map(answer => answer.answer);
      if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'));

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      });

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
