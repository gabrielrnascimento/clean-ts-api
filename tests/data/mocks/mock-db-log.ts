import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';

export class LogErrorRepositorySpy implements LogErrorRepository {
  public stack: string;

  async logError (stack: string): Promise<void> {
    this.stack = stack;
    return null;
  }
}
