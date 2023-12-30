import { type SurveyResultModel } from '../models';

export type SaveSurveyResultParams = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
};

export interface SaveSurveyResult {
  save: (saveSurveyResultParams: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
