import { type SaveSurveyResult } from '@/domain/usecases/save-survey-result';
import { type LoadSurveyResult } from '@/domain/usecases/load-survey-result';
import { type SurveyResultModel } from '@/domain/models';

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
    count: 2,
    percent: 20,
    isCurrentAccountAnswer: true
  }, {
    answer: 'other_answer',
    count: 8,
    percent: 80,
    isCurrentAccountAnswer: false
  }],
  date: new Date()
});

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }, {
    answer: 'other_answer',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }],
  date: new Date()
});

export class SaveSurveyResultSpy implements SaveSurveyResult {
  public saveSurveyResultParams: SaveSurveyResult.Params;
  public result = mockSurveyResultModel();

  async save (saveSurveyResultParams: SaveSurveyResult.Params): Promise<SurveyResultModel> {
    this.saveSurveyResultParams = saveSurveyResultParams;
    return this.result;
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  public surveyId: string;
  public accountId: string;
  public result = mockSurveyResultModel();

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return this.result;
  }
}
