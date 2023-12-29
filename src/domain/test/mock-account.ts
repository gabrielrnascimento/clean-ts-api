import { type AccountModel } from '@/domain/models/account';
import { type AddAccount, type AddAccountParams } from '@/domain/usecases/account/add-account';
import { type Authentication, type AuthenticationParams } from '@/domain/usecases/account/authentication';
import { type LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
});

export const mockAccountModel = (): AccountModel => Object.assign(
  {},
  mockAddAccountParams(),
  { id: 'any_id' }
);

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});

export class AddAccountSpy implements AddAccount {
  public addAccountParams: AddAccountParams;
  public result: AccountModel = mockAccountModel();

  async add (addAccountParams: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = addAccountParams;
    return this.result;
  }
}

export class AuthenticationSpy implements Authentication {
  public authenticationParams: AuthenticationParams;
  public result: string = 'any_token';

  async auth (authenticationParams: AuthenticationParams): Promise<string> {
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
