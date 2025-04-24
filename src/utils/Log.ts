import { isDevEnvironment } from './helpers';

export class Log {
  static warn(message: string) {
    Log.exec(`[WARN] ${message}`, 'warn');
  }

  static error(message: string) {
    Log.exec(`[ERROR] ${message}`, 'error');
  }

  static info(message: string) {
    Log.exec(`[INFO] ${message}`, 'info');
  }

  private static exec(message: string, type: 'warn' | 'error' | 'info') {
    if (!isDevEnvironment() || undefined) {
      return;
    }

    (console[type] ?? console.log)(message);
  }
}
