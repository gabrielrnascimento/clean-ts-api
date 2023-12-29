import { DbLoadSurveys } from './db-load-surveys';
import { mockSurveyModels, throwError } from '@/domain/test';
import { LoadSurveysRepositorySpy } from '@/data/test';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy();
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy);
  return {
    sut,
    loadSurveysRepositorySpy
  };
};

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();

    await sut.load();

    expect(loadSurveysRepositorySpy.loadAllCalls).toBe(1);
  });

  test('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll')
      .mockImplementationOnce(throwError);

    const promise = sut.load();

    await expect(promise).rejects.toThrow();
  });

  test('should return a list of Surveys on success', async () => {
    const { sut } = makeSut();

    const surveys = await sut.load();

    expect(surveys).toEqual(mockSurveyModels());
  });
});
