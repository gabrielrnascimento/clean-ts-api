import { DbCheckSurveyById } from '@/data/usecases';
import { throwError } from '../../domain/mocks';
import { CheckSurveyByIdRepositorySpy } from '../mocks';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
};

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy();
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy);
  return {
    sut,
    checkSurveyByIdRepositorySpy
  };
};

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call CheckSurveyByIdRepository with correct value', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut();

    await sut.checkById('any_id');

    expect(checkSurveyByIdRepositorySpy.surveyId).toBe('any_id');
  });

  test('should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut();
    jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockImplementationOnce(throwError);

    const promise = sut.checkById('any_id');

    await expect(promise).rejects.toThrow();
  });

  test('should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut();
    checkSurveyByIdRepositorySpy.result = false;

    const exists = await sut.checkById('any_id');

    expect(exists).toEqual(false);
  });

  test('should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut();

    const exists = await sut.checkById('any_id');

    expect(exists).toEqual(true);
  });
});
