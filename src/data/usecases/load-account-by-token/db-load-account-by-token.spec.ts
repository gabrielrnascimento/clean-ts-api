import { type Decrypter } from '../../protocols/cryptography/decrypter';
import { DbLoadAccountByToken } from './db-load-account-by-token';

describe('DbLoadAccountByToken', () => {
  test('should call Decrypter with correct values', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return await new Promise(resolve => { resolve('any_value'); });
      }
    }
    const decrypterStub = new DecrypterStub();
    const sut = new DbLoadAccountByToken(decrypterStub);
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.load('any_token');
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });
});
