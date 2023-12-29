import { LoadSurveysSpy, mockSurveyModels, throwError } from '@/domain/test';
import { LoadSurveysController } from './load-surveys-controller';
import { ok, serverError, noContent } from './load-surveys-controller-protocols';
import MockDate from 'mockdate';

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

  test('should call LoadSurveys', async () => {
    const { sut, loadSurveysSpy } = makeSut();

    await sut.handle({});

    expect(loadSurveysSpy.loadCalls).toBe(1);
  });

  test('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    loadSurveysSpy.result = [];

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(noContent());
  });

  test('should return 200 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(ok(mockSurveyModels()));
  });
});
