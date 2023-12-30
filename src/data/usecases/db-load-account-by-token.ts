import { type LoadAccountByToken } from '@/domain/usecases';
import { type Decrypter } from '../protocols/cryptography/decrypter';
import { type LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository';
import { type AccountModel } from '@/domain/models';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    let token: string;
    try {
      token = await this.decrypter.decrypt(accessToken);
    } catch (error) {
      return null;
    }
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role);
      if (account) return account;
    }
    return null;
  }
}
