import { ok, serverError, noContent } from '@/presentation/helpers';
import { LoadSurveysSpy, mockSurveyModels, throwError } from '../../domain/mocks';
import MockDate from 'mockdate';
import { LoadSurveysController } from '@/presentation/controllers';

const mockRequest = (): LoadSurveysController.Request => ({
  accountId: 'any_id'
});

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveysSpy
};

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy();
  const sut = new LoadSurveysController(loadSurveysSpy);
  return {
    sut,
    loadSurveysSpy
  };
};

describe('LoadSurveysController', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(loadSurveysSpy.accountId).toBe(request.accountId);
  });

  test('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    loadSurveysSpy.result = [];

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(noContent());
  });

  test('should return 200 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockSurveyModels()));
  });
});
