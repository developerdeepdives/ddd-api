import appRoot from 'app-root-path';
import { createLogger, Logger, transports, format } from 'winston';
import { FileTransportOptions } from 'winston/lib/winston/transports';

interface LoggerOptions {
  console: FileTransportOptions;
  file: FileTransportOptions;
}

const loggerOptions: LoggerOptions = {
  console: {
    format: format.combine(
      format.colorize({ all: true }),
      format.timestamp({
        format: 'YY-MM-DD HH:MM:SS',
      }),
      format.align(),
      format.printf((info) => {
        const { timestamp, level, message, ...args } = info;
        return `${timestamp} ${level} ${message} ${
          Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
        }`;
      })
    ),
    handleExceptions: true,
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  },
  file: {
    format: format.combine(
      format.timestamp({
        format: 'YY-MM-DD HH:MM:SS',
      }),
      format.align(),
      format.json(),
      format.printf((info) => {
        const { timestamp, level, message, ...args } = info;
        return `${timestamp} ${level} ${message} ${
          Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
        }`;
      })
    ),
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
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

export class LoggerStream {
  public write(message: string) {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
}
