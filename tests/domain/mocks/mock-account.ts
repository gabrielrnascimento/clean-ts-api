import { type AccountModel } from '@/domain/models';
import { type AddAccount } from '@/domain/usecases/add-account';
import { type Authentication } from '@/domain/usecases/authentication';
import { type LoadAccountByToken } from '@/domain/usecases/load-account-by-token';

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
});

export const mockAccountModel = (): AccountModel => Object.assign(
  {},
  mockAddAccountParams(),
  { id: 'any_id' }
);

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});

export const mockAuthenticationModel = (): Authentication.Result => ({
  accessToken: 'any_token',
  name: 'any_name'
});

export class AddAccountSpy implements AddAccount {
  public addAccountParams: AddAccount.Params;
  public result: AddAccount.Result = true;

  async add (addAccountParams: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = addAccountParams;
    return this.result;
  }
}

export class AuthenticationSpy implements Authentication {
  public authenticationParams: Authentication.Params;
  public result: Authentication.Result = mockAuthenticationModel();

  async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    this.authenticationParams = authenticationParams;
    return this.result;
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  public accessToken: string;
  public role: string;
  public result: AccountModel = mockAccountModel();

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken;
    this.role = role;
    return this.result;
  }
}
