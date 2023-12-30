import { type AddAccount } from '@/domain/usecases';
import { type Hasher } from '../protocols/cryptography';
import { type AddAccountRepository, type CheckAccountByEmailRepository } from '../protocols/db/account';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(accountData.email);
    if (exists) return false;

    const hashedPassword = await this.hasher.hash(accountData.password);
    const isValid = await this.addAccountRepository.add({ ...accountData, password: hashedPassword });
    return isValid;
  }
}
