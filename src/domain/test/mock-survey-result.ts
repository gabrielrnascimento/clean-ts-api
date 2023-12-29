import { type SurveyResultModel } from '@/domain/models/survey-result';
import { type SaveSurveyResult, type SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { type LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
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
    percent: 20
  }, {
    answer: 'other_answer',
    count: 8,
    percent: 80
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
    percent: 0
  }, {
    answer: 'other_answer',
    count: 0,
    percent: 0
  }],
  date: new Date()
});

export class SaveSurveyResultSpy implements SaveSurveyResult {
  public result = mockSurveyResultModel();
  public params: SaveSurveyResultParams;

  async save (params: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.params = params;
    return this.result;
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  public surveyId: string;
  public result = mockSurveyResultModel();

  async load (surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    return this.result;
  }
}
