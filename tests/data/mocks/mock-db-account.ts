import { type CheckAccountByEmailRepository, type AddAccountRepository, type LoadAccountByEmailRepository, type LoadAccountByTokenRepository, type UpdateAccessTokenRepository } from '@/data/protocols/db/account';

export class AddAccountRepositorySpy implements AddAccountRepository {
  public addAccountParams: AddAccountRepository.Params;
  public result: AddAccountRepository.Result = true;

  async add (addAccountParams: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = addAccountParams;
    return this.result;
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  public email: string;
  public result: LoadAccountByEmailRepository.Result = {
    id: 'any_id',
    name: 'any_name',
    password: 'any_password'
  };

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email;
    return this.result;
  }
}

export class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {
  public email: string;
  public result: CheckAccountByEmailRepository.Result = false;

  async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
    this.email = email;
    return this.result;
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  public token: string;
  public role: string;
  public result: LoadAccountByTokenRepository.Result = {
    id: 'any_id'
  };

  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token;
    this.role = role;
    return this.result;
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  public accountId: string;
  public token: string;

  async updateAccessToken (accountId: string, token: string): Promise<void> {
    this.accountId = accountId;
    this.token = token;
    return null;
  }
}
