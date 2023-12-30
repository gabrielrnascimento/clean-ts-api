import { type LoadSurveys } from '@/domain/usecases';
import { type LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository';

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (accountId: string): Promise<LoadSurveys.Result> {
    const surveys = await this.loadSurveysRepository.loadAll(accountId);
    return surveys;
  }
}
