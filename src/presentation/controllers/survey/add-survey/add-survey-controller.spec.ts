import { type HttpRequest, badRequest, noContent, serverError } from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import { ValidationSpy } from '@/presentation/test';
import { AddSurveySpy, throwError } from '@/domain/test';
import MockDate from 'mockdate';

const mockRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
});

type SutTypes = {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const addSurveySpy = new AddSurveySpy();
  const sut = new AddSurveyController(validationSpy, addSurveySpy);
  return {
    sut,
    validationSpy,
    addSurveySpy
  };
};

describe('AddSurveyController', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    expect(validationSpy.input).toBe(httpRequest.body);
  });

  test('should return 400 if validation fails', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.result = new Error();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test('should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut();

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    expect(addSurveySpy.data).toEqual(httpRequest.body);
  });

  test('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut();
    jest.spyOn(addSurveySpy, 'add').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(noContent());
  });
});
