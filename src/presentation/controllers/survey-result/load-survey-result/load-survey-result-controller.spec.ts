import { mockLoadSurveyById } from '@/domain/test';
import { LoadSurveyResultController } from './load-survey-result-controller';
import { type LoadSurveyById, type HttpRequest } from './load-survey-result-controller-protocols';

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
});

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub);
  return {
    sut,
    loadSurveyByIdStub
  };
};

describe('LoadSurveyResultController', () => {
  test('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(mockRequest());
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
