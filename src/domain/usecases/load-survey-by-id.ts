import { type SurveyModel } from '../models';

export interface LoadSurveyById {
  loadById: (surveyId: string) => Promise<SurveyModel>
}
