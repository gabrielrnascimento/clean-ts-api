import { type Controller, type HttpResponse } from '../protocols';
import { forbidden, ok, serverError } from '../helpers';
import { type SaveSurveyResult, type LoadAnswersBySurvey } from '@/domain/usecases';
import { InvalidParamError } from '../errors';

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId, answer } = request;

      const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId);
      if (!answers.length) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'));

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      });

      return ok(surveyResult);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  };
}
