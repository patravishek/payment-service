// payment-service/src/index.ts
import express from 'express';
import { ENV } from './config/environment';
import { PaymentController } from './controllers/paymentController';
import { AppDataSource } from './config/db';
import { logger } from './config/logger';

const app = express();

app.get('/health', (req, res) => {
  res.send('Payment Service is up and running');
});

const startServer = async () => {
  try {
    // Initialize DB
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    // Start listening to the queue
    await PaymentController.initPaymentQueueListener();
    logger.info('RabbitMQ consumer initialized');

    // Start express server
    app.listen(ENV.PAYMENT_SERVICE_PORT, () => {
      logger.info(`Payment Service listening on port ${ENV.PAYMENT_SERVICE_PORT}`);
    });
  } catch (err) {
    logger.error('Error starting Payment Service:', err);
    process.exit(1);
  }
};

startServer();