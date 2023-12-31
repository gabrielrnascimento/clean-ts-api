import { type SaveSurveyResult } from '@/domain/usecases';

export interface SaveSurveyResultRepository {
  save: (saveSurveyResultParams: SaveSurveyResultRepository.Params) => Promise<void>
}

export namespace SaveSurveyResultRepository {
  export type Params = SaveSurveyResult.Params;
}
