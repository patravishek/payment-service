// payment-service/src/controllers/paymentController.ts
import { consumeWithRetry } from '../config/rabbitmq';
import { PaymentService } from '../services/paymentService';
import { logger } from '../config/logger';

export class PaymentController {
  static async initPaymentQueueListener(): Promise<void> {
    // We'll do up to 3 retries by default
    await consumeWithRetry('payment_queue', async (msg, channel) => {
      const paymentRequest = JSON.parse(msg.content.toString());
      logger.debug(`Received payment request: ${JSON.stringify(paymentRequest)}`);
      await PaymentService.handlePaymentRequest(paymentRequest);
    });
  }
}