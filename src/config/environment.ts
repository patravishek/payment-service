// payment-service/src/config/environment.ts
import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PAYMENT_SERVICE_PORT: process.env.PAYMENT_SERVICE_PORT || 4001,
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',

  // MySQL environment variables
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_USER: process.env.DB_USER || 'payment_user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'Password@123',
  DB_NAME: process.env.DB_NAME || 'payment_db'
};