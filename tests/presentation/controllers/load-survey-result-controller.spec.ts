import { CheckSurveyByIdSpy, LoadSurveyResultSpy, mockSurveyResultModel, throwError } from '../../domain/mocks';
import MockDate from 'mockdate';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { InvalidParamError } from '@/presentation/errors';
import { LoadSurveyResultController } from '@/presentation/controllers';

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id'
});

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdSpy: CheckSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
};

const makeSut = (): SutTypes => {
  const checkSurveyByIdSpy = new CheckSurveyByIdSpy();
  const loadSurveyResultSpy = new LoadSurveyResultSpy();
  const sut = new LoadSurveyResultController(checkSurveyByIdSpy, loadSurveyResultSpy);
  return {
    sut,
    checkSurveyByIdSpy,
    loadSurveyResultSpy
  };
};

describe('LoadSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call CheckSurveyById with correct values', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut();

    await sut.handle(mockRequest());

    expect(checkSurveyByIdSpy.surveyId).toBe('any_survey_id');
  });

  test('should return 403 if CheckSurveyById returns false', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut();
    checkSurveyByIdSpy.result = false;

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('should return 500 if CheckSurveyById throws', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut();
    jest.spyOn(checkSurveyByIdSpy, 'checkById').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();

    await sut.handle(mockRequest());

    expect(loadSurveyResultSpy.surveyId).toBe('any_survey_id');
    expect(loadSurveyResultSpy.accountId).toBe('any_account_id');
  });

  test('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 200 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});
