import {
  createLogger,
  format,
  Logger,
  transports,
} from 'winston';

export const logger: Logger = createLogger({
  format: format.json(),
  level: 'info',
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.printf((log) => {
        return `${log.timestamp} ${log.level}: ${log.message} ${log.meta ? JSON.stringify(log.meta) : ''}`;
      }),
    ),
  }));
}

export const requestLogger: Logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf((log) => {
      // tslint:disable:max-line-length
      return `${log.timestamp} ${log.level}: HTTP ${log.res.statusCode} ${log.req.method} ${log.responseTime}ms ${log.req.url}`;
    }),
  ),
  transports: [new transports.Console()],
});
