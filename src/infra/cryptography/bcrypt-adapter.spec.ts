import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hashed_value'); });
  }
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('BcryptAdapter', () => {
  test('should call bcrypt with correct values', async () => {
    const salt = 12;
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('should return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hashed_value');
  });
});
