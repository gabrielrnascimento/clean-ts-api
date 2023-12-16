import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign (): string { return 'any_token'; },
  verify (): string { return 'any_value'; }
}));

const makeSut = (): JwtAdapter => new JwtAdapter('secret');

describe('JwtAdapter', () => {
  describe('sign()', () => {
    test('should call sign with correct values', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');

      await sut.encrypt('any_id');

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });

    test('should return a token on sign success', async () => {
      const sut = makeSut();

      const accessToken = await sut.encrypt('any_id');

      expect(accessToken).toBe('any_token');
    });

    test('should throw if sign throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error(); });

      const promise = sut.encrypt('any_id');

      await expect(promise).rejects.toThrow(new Error());
    });
  });

  describe('verify()', () => {
    test('should call verify with correct values', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt('any_token');
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });

    test('should return a value on verify success', async () => {
      const sut = makeSut();
      const value = await sut.decrypt('any_token');
      expect(value).toBe('any_value');
    });
  });
});
