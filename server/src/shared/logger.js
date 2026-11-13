import winston from 'winston';
// import { env } from '../config/env.js';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

// Winston has no built-in redaction, so we write a small format for it.
// Shallow on purpose: only top-level keys. Never log whole request bodies.
const SENSITIVE_KEYS = new Set([
  'password',
  'authorization',
  'cookie',
  'token',
  'accessToken',
  'refreshToken',
]);
const redact = winston.format((info) => {
  for (const key of Object.keys(info)) {
    if (SENSITIVE_KEYS.has(key)) info[key] = '[REDACTED]';
  }
  return info;
});

// Readable one-line output for local development
const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} ${level}: ${message}${extra}${stack ? `\n${stack}` : ''}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  silent: process.env.NODE_ENV === 'test',
  format: combine(
    errors({ stack: true }), // keep stack traces when logging Error objects
    timestamp(),
    redact(),
    process.env.NODE_ENV === 'development' ? combine(colorize(), devFormat) : json(), // JSON in production
  ),
  transports: [new winston.transports.Console()],
});
