import { DbLoadAnswersBySurvey } from '@/data/usecases';
import { throwError } from '../../domain/mocks';
import { LoadSurveyByIdRepositorySpy } from '../mocks';

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy);
  return {
    sut,
    loadSurveyByIdRepositorySpy
  };
};

describe('DbLoadSurveyById', () => {
  test('should call LoadSurveyByIdRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();

    await sut.loadAnswers('any_id');

    expect(loadSurveyByIdRepositorySpy.surveyId).toBe('any_id');
  });

  test('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError);

    const promise = sut.loadAnswers('any_id');

    await expect(promise).rejects.toThrow();
  });

  test('should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    loadSurveyByIdRepositorySpy.result = null;

    const answers = await sut.loadAnswers('any_id');

    expect(answers).toEqual([]);
  });

  test('should return answers on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();

    const answers = await sut.loadAnswers('any_id');

    expect(answers).toEqual(loadSurveyByIdRepositorySpy.result.answers.map(item => item.answer));
  });
});
