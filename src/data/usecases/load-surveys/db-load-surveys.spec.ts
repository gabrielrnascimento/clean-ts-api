import { type SurveyModel } from '../../../domain/models/survey';
import { type LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository';
import { DbLoadSurveys } from './db-load-surveys';

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }],
    date: new Date()
  }, {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      answer: 'other_answer',
      image: 'other_image'
    }],
    date: new Date()
  }];
};

describe('DbLoadSurveys', () => {
  test('should call LoadSurveysRepository', async () => {
    class SurveyRepositoryStub implements LoadSurveysRepository {
      async loadAll (): Promise<SurveyModel[]> {
        return await new Promise(resolve => { resolve(makeFakeSurveys()); });
      }
    }
    const surveyRepositoryStub = new SurveyRepositoryStub();
    const sut = new DbLoadSurveys(surveyRepositoryStub);
    const loadAllSpy = jest.spyOn(surveyRepositoryStub, 'loadAll');
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });
});
