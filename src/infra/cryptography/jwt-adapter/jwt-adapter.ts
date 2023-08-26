import jwt from 'jsonwebtoken';
import { type Encrypter } from '../../../data/protocols/cryptography/token-generator';

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) { }

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret);
    return accessToken;
  }
}
