import { type Authentication, type AuthenticationParams } from '@/domain/usecases';
import { type HashComparer } from '../protocols/cryptography/hash-comparer';
import { type Encrypter } from '../protocols/cryptography/encrypter';
import { type UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository';
import { type LoadAccountByEmailRepository } from '../protocols/db/account/load-account-by-email-repository';
import { type AuthenticationModel } from '@/domain/models/authentication';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password);
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
        return {
          accessToken,
          name: account.name
        };
      }
    }
    return null;
  }
}
