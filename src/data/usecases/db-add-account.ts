import { type AddAccount } from '@/domain/usecases';
import { type Hasher } from '../protocols/cryptography/hasher';
import { type AddAccountRepository } from '../protocols/db/account/add-account-repository';
import { type LoadAccountByEmailRepository } from '../protocols/db/account/load-account-by-email-repository';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
    if (account) return false;

    const hashedPassword = await this.hasher.hash(accountData.password);
    const newAccount = await this.addAccountRepository.add({ ...accountData, password: hashedPassword });
    return newAccount !== null;
  }
}
