// logger/pino.config.ts
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

export const pinoLoggerModule = LoggerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const isProduction = config.get('NODE_ENV') === 'production';
    const logLevel = config.get('LOG_LEVEL', 'info');

    // 定义文件轮转 transport
    const fileTransport = {
      target: 'pino-roll',
      options: {
        file: './logs1/application', // 基础文件名，会自动附加日期
        frequency: 'daily', // 按天轮转
        mkdir: true, // 自动创建目录
        dateFormat: 'yyyy-MM-dd',
        limit: { count: 14 }, // 保留14个文件
        extension: '.log', // 后缀
      },
      level: logLevel,
    };

    // 错误日志单独文件
    const errorFileTransport = {
      target: 'pino-roll',
      options: {
        file: './logs1/error',
        frequency: 'daily',
        mkdir: true,
        dateFormat: 'yyyy-MM-dd',
        limit: { count: 30 },
        extension: '.log',
      },
      level: 'error',
    };

    return {
      pinoHttp: {
        level: logLevel,
        // 请求日志格式（自动记录 req.id、method、url 等）
        autoLogging: true,
        // 生产环境只用文件，开发环境用 pretty
        transport: isProduction
          ? {
              targets: [
                { ...fileTransport, level: logLevel },
                errorFileTransport,
              ],
            }
          : {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            },
        // 为每个请求生成 trace id
        genReqId: (req) =>
          req.headers['x-trace-id'] || require('crypto').randomUUID(),
        // 忽略某些路径的请求日志（如健康检查）
        quietReqLogger: true,
        customLogLevel: (res, err) => {
          if (res.statusCode! >= 400 && res.statusCode! < 500) return 'warn';
          if (res.statusCode! >= 500 || err) return 'error';
          return 'info';
        },
      },
    };
  },
});
