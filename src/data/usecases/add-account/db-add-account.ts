import { type AddAccountRepository, type AccountModel, type AddAccount, type AddAccountModel, type Encrypter } from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) { }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
    return await new Promise(resolve => {
      resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      });
    });
  }
}
