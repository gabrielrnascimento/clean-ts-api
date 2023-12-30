import { type LoadSurveyById } from '@/domain/usecases';
import { type LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string): Promise<LoadSurveyById.Result> {
    return await this.loadSurveyByIdRepository.loadById(id);
  }
}
