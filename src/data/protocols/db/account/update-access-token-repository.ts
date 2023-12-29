export interface UpdateAccessTokenRepository {
  updateAccessToken: (accountId: string, token: string) => Promise<void>
}
