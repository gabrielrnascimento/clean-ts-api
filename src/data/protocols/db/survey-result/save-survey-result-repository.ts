import { type SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';

export interface SaveSurveyResultRepository {
  save: (saveSurveyResultParams: SaveSurveyResultParams) => Promise<void>
}
