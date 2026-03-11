type LogLevel = 'log' | 'warn' | 'error';

function createLogger() {
  const log = (level: LogLevel, ...args: unknown[]) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console[level]('[Appspirin]', ...args);
    }
  };

  return {
    log: (...args: unknown[]) => log('log', ...args),
    warn: (...args: unknown[]) => log('warn', ...args),
    error: (...args: unknown[]) => log('error', ...args),
  };
}

export const logger = createLogger();
