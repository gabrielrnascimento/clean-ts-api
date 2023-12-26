import { type SurveyResultModel } from '@/domain/models/survey-result';
import { type SaveSurveyResult, type SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';

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

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel());
    }
  }
  return new SaveSurveyResultStub();
};
