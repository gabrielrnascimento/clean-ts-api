import { type SaveSurveyResultParams } from '@/domain/usecases';

export interface SaveSurveyResultRepository {
  save: (saveSurveyResultParams: SaveSurveyResultParams) => Promise<void>
}
