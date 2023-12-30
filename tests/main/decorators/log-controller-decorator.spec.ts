import { LogErrorRepositorySpy } from '../../data/mocks';
import { ok, serverError } from '@/presentation/helpers/http-helper';
import { type HttpResponse } from '@/presentation/protocols';
import { ControllerSpy } from '../../presentation/mocks';
import { LogControllerDecorator } from '@/main/decorators';

const mockRequest = (): any => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
});

const mockServerError = (): HttpResponse => {
  const mockError = new Error();
  mockError.stack = 'any_stack';
  return serverError(mockError);
};

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
};

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy();
  controllerSpy.result = ok('any_value');
  const logErrorRepositorySpy = new LogErrorRepositorySpy();
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy);
  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy
  };
};

describe('LogControllerDecorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut();

    await sut.handle(mockRequest());

    expect(controllerSpy.request).toEqual(mockRequest());
  });

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok('any_value'));
  });

  test('should call LogErrorRepository with correct error if controller returns 500', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut();
    controllerSpy.result = mockServerError();

    await sut.handle(mockRequest());

    expect(logErrorRepositorySpy.stack).toBe('any_stack');
  });
});
