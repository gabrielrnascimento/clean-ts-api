import { LoadAnswersBySurveySpy, SaveSurveyResultSpy, mockSurveyResultModel, throwError } from '../../domain/mocks';
import { forbidden, serverError, ok } from '@/presentation/helpers';
import { InvalidParamError } from '@/presentation/errors';
import MockDate from 'mockdate';
import { SaveSurveyResultController } from '@/presentation/controllers';

const mockRequest = (): SaveSurveyResultController.Request => ({
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  accountId: 'any_account_id'
});

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveySpy: LoadAnswersBySurveySpy
  saveSurveyResultSpy: SaveSurveyResultSpy
};

const makeSut = (): SutTypes => {
  const loadAnswersBySurveySpy = new LoadAnswersBySurveySpy();
  const saveSurveyResultSpy = new SaveSurveyResultSpy();
  const sut = new SaveSurveyResultController(loadAnswersBySurveySpy, saveSurveyResultSpy);
  return {
    sut,
    loadAnswersBySurveySpy,
    saveSurveyResultSpy
  };
};

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut();

    await sut.handle(mockRequest());

    expect(loadAnswersBySurveySpy.surveyId).toBe('any_survey_id');
  });

  test('should return 403 if LoadAnswersBySurvey returns an empty array', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut();
    loadAnswersBySurveySpy.result = [];

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      surveyId: 'any_survey_id',
      answer: 'wrong_answer',
      accountId: 'any_account_id'
    });

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  test('should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut();
    jest.spyOn(loadAnswersBySurveySpy, 'loadAnswers').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy } = makeSut();
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy } = makeSut();

    await sut.handle(mockRequest());

    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    });
  });

  test('should return 200 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});
