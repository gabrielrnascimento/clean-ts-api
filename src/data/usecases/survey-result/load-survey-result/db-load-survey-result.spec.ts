import { DbLoadSurveyResult } from './db-load-survey-result';
import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '@/data/test';
import { mockEmptySurveyResultModel, mockSurveyResultModel, throwError } from '@/domain/test';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy);
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  };
};

describe('DbLoadSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();

    await sut.load('any_survey_id');

    expect(loadSurveyResultRepositorySpy.surveyId).toBe('any_survey_id');
  });

  test('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError);

    const promise = sut.load('any_survey_id');

    await expect(promise).rejects.toThrow();
  });

  test('should call LoadSurveyByIdRepository with correct values if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut();
    loadSurveyResultRepositorySpy.result = null;

    await sut.load('any_survey_id');

    expect(loadSurveyByIdRepositorySpy.surveyId).toBe('any_survey_id');
  });

  test('should return empty surveyResult if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    loadSurveyResultRepositorySpy.result = null;

    const surveyResult = await sut.load('any_survey_id');

    expect(surveyResult).toEqual(mockEmptySurveyResultModel());
  });

  test('should return a surveyResult on success', async () => {
    const { sut } = makeSut();

    const surveyResult = await sut.load('any_survey_id');

    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
