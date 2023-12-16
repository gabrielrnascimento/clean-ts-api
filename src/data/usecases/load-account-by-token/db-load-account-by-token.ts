import { type AccountModel } from '../../../domain/models/account';
import { type LoadAccountByToken } from '../../../domain/usecases/load-account-by-token';
import { type Decrypter } from '../../protocols/cryptography/decrypter';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken);
    return null;
  }
}
