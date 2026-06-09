// logger/winston.config.ts
import winston from 'winston';
import chalk from 'chalk';
import 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';

// 文件轮转配置（所有级别）
const fileRotateTransport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d', // 保留14天
  maxSize: '20m', // 单文件最大20MB
  zippedArchive: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

// 错误日志单独记录
const errorFileRotateTransport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxFiles: '30d',
  maxSize: '20m',
  zippedArchive: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

export const winstonConfig = {
  exitOnError: false, // 防止意外退出
  transports: [
    // 控制台输出（开发时使用 nest 风格格式）
    new winston.transports.Console({
      format: isProduction
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.printf(
              ({ timestamp, level, message, context, trace }) => {
                const defaultAppStr = chalk.green(`[App]`);
                const contextStr = context
                  ? chalk.yellow(`[${context}]`)
                  : defaultAppStr;
                return `${timestamp} ${contextStr} ${level}: ${message}${
                  trace ? `\n${trace}` : ''
                }`;
              },
            ),
          ),
    }),
    fileRotateTransport,
    errorFileRotateTransport,
  ],
  // 处理未捕获的错误的日志
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'error.log',
    }),
  ],
  // Promise 的未捕获异常
  rejectionHandlers: [
    new winston.transports.File({
      filename: 'rejection.log',
    }),
  ],
};
