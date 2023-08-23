import { type AddAccountRepository, type AccountModel, type AddAccount, type AddAccountModel, type Hasher } from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) { }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
    return account;
  }
}
