import appRoot from 'app-root-path';
import { createLogger, Logger, transports } from 'winston';

const loggerOptions = {
  console: {
    colorize: true,
    handleExceptions: true,
    json: false,
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  },
  file: {
    colorize: false,
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    level: 'info',
    maxFiles: 5,
    maxsize: 5242880,
  },
};

export const logger: Logger = createLogger({
  exitOnError: false,
  transports: [
    new transports.File(loggerOptions.file),
    new transports.Console(loggerOptions.console),
  ],
});

// if (process.env.NODE_ENV !== 'production') {
//   logger.debug('Logging initialized at debug level');
// }

export class LoggerStream {
  public write(message: string) {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
}
