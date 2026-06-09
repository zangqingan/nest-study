import { LoggerService, LogLevel } from '@nestjs/common';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { createLogger, format, Logger, transports } from 'winston';

export class CustomWinstonLogger implements LoggerService {
  private logger: Logger;
  private logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.splat(),
            format.printf(({ context, level, message, time }) => {
              const appStr = chalk.green(`[NEST-WINSTON]`);
              const contextStr = chalk.yellow(`[${context}]`);

              return `${appStr} ${time} ${level} ${contextStr} ${message} `;
            }),
          ),
        }),
      ],
    });
  }

  private formatTime(): string {
    return dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  }

  log(message: any, context?: string) {
    const time = this.formatTime();
    this.logger.log('info', message, { context, time });
  }

  error(message: any, context?: string) {
    const time = this.formatTime();
    this.logger.log('error', message, { context, time });
  }

  warn(message: any, context?: string) {
    const time = this.formatTime();
    this.logger.log('warn', message, { context, time });
  }

  debug(message: any, context?: string) {
    if (!this.logLevels.includes('debug')) return;
    const time = this.formatTime();
    this.logger.log('debug', message, { context, time });
  }

  verbose(message: any, context?: string) {
    if (!this.logLevels.includes('verbose')) return;
    const time = this.formatTime();
    this.logger.log('verbose', message, { context, time });
  }

  setLogLevels(levels: LogLevel[]) {
    this.logLevels = levels;
  }
}
