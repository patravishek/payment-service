// payment-service/src/config/db.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ENV } from './environment';
import { Payment } from '../entities/Payment';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  entities: [Payment],
  synchronize: true, // In production, use migrations instead of synchronize
  logging: false,
});