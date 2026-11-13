import { createApp } from './app.js';
import { logger } from './shared/logger.js';
const app = createApp();
app.use("/home",(req,res)=>{
res.send(1)
})
const server = app.listen(process.env.PORT, () => {
  logger.info({ port: process.env.PORT, env: process.env.NODE_ENV }, 'API listening');
});

server.requestTimeout = 30_000; // whole request must arrive within 30s
server.headersTimeout = 10_000;
function shutdown(signal) {
  logger.info(`${signal} received, shutting down`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection', err);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err);
  process.exit(1);
});