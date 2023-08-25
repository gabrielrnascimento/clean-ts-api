import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hashed_value'); });
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => { resolve(true); });
  }
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('BcryptAdapter', () => {
  test('should call hash with correct values', async () => {
    const salt = 12;
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('should return a valid hash on hash success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value');
    expect(hash).toBe('hashed_value');
  });

  test('should throw if bcrypt hash throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error(); });
    const hash = sut.hash('any_value');
    await expect(hash).rejects.toThrow();
  });

  test('should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  test('should return true when compare succeeds', async () => {
    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(true);
  });

  test('should return false when compare fails', async () => {
    const sut = makeSut();
    jest.spyOn<typeof bcrypt, any>(bcrypt, 'compare').mockImplementationOnce(async () => await new Promise(resolve => { resolve(false); }));
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(false);
  });

  test('should throw if bcrypt compare throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error(); });
    const promise = sut.compare('any_value', 'any_hash');
    await expect(promise).rejects.toThrow();
  });
});
