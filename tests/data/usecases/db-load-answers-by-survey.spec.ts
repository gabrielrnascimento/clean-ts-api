import { DbLoadAnswersBySurvey } from '@/data/usecases';
import { throwError } from '../../domain/mocks';
import { LoadAnswersBySurveyRepositorySpy } from '../mocks';

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy
};

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy();
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy);
  return {
    sut,
    loadAnswersBySurveyRepositorySpy
  };
};

describe('DbLoadSurveyById', () => {
  test('should call LoadAnswersBySurveyRepository with correct value', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();

    await sut.loadAnswers('any_id');

    expect(loadAnswersBySurveyRepositorySpy.surveyId).toBe('any_id');
  });

  test('should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    jest.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers').mockImplementationOnce(throwError);

    const promise = sut.loadAnswers('any_id');

    await expect(promise).rejects.toThrow();
  });

  test('should return empty array if LoadAnswersBySurveyRepository returns an empty array', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    loadAnswersBySurveyRepositorySpy.result = [];

    const answers = await sut.loadAnswers('any_id');

    expect(answers).toEqual([]);
  });

  test('should return answers on success', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();

    const answers = await sut.loadAnswers('any_id');

    expect(answers).toEqual(loadAnswersBySurveyRepositorySpy.result);
  });
});
