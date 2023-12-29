import { mockSurveyModels, throwError } from '../../domain/mocks';
import MockDate from 'mockdate';
import { LoadSurveysRepositorySpy } from '../mocks';
import { DbLoadSurveys } from '@/data/usecases';

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

  test('should call LoadSurveysRepository with correct value', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const accountId = 'any_id';

    await sut.load(accountId);

    expect(loadSurveysRepositorySpy.accountId).toBe(accountId);
  });

  test('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll')
      .mockImplementationOnce(throwError);

    const promise = sut.load('any_id');

    await expect(promise).rejects.toThrow();
  });

  test('should return a list of Surveys on success', async () => {
    const { sut } = makeSut();

    const surveys = await sut.load('any_id');

    expect(surveys).toEqual(mockSurveyModels());
  });
});
