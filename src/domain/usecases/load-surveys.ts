import { type SurveyModel } from '../models';

export interface LoadSurveys {
  load: (accountId: string) => Promise<SurveyModel[]>
}
