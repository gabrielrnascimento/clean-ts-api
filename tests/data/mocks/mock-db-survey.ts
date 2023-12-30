import { mockSurveyModel, mockSurveyModels } from '../../domain/mocks';
import { type AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { type LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { type LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { type SurveyModel } from '@/domain/models';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  public addSurveyParams: AddSurveyRepository.Params;

  async add (surveyData: AddSurveyRepository.Params): Promise<void> {
    this.addSurveyParams = surveyData;
    return null;
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  public surveyId: string;
  public result: LoadSurveyByIdRepository.Result = mockSurveyModel();

  async loadById (surveyId: string): Promise<LoadSurveyByIdRepository.Result> {
    this.surveyId = surveyId;
    return this.result;
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  public accountId: string;
  public result = mockSurveyModels();

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
    return this.result;
  }
}
