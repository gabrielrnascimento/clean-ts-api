import { DbLoadSurveyById } from '@/data/usecases';
import { mockSurveyModel, throwError } from '../../domain/mocks';
import { LoadSurveyByIdRepositorySpy } from '../mocks';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy);
  return {
    sut,
    loadSurveyByIdRepositorySpy
  };
};

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call LoadSurveyByIdRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();

    await sut.loadById('any_id');

    expect(loadSurveyByIdRepositorySpy.surveyId).toBe('any_id');
  });

  test('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError);

    const promise = sut.loadById('any_id');

    await expect(promise).rejects.toThrow();
  });

  test('should return a Survey on success', async () => {
    const { sut } = makeSut();

    const surveys = await sut.loadById('any_id');

    expect(surveys).toEqual(mockSurveyModel());
  });
});
