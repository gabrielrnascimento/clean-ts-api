import { type LoadSurveyById } from '@/domain/usecases';
import { type LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository';
import { type SurveyModel } from '@/domain/models/survey';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}
