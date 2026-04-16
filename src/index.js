const { env, port } = require('./core/config');
const logger = require('./core/logger')('app');
const server = require('./core/server');
const gachaService = require('./api/components/gacha/gacha-service');

const app = server.listen(port, async (err) => {
  if (err) {
    logger.fatal(err, 'Failed to start the server.');
    process.exit(1);
  } else {
    logger.info(`Server runs at port ${port} in ${env} environment`);

    try {
      await gachaService.seedPrizes();
      logger.info('Prizes data seeded successfully');
    } catch (seedError) {
      logger.error(seedError, 'Failed to seed prizes data');
    }
  }
});

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'Uncaught exception.');

  app.close(() => process.exit(1));

  setTimeout(() => process.abort(), 1000).unref();
  process.exit(1);
});
