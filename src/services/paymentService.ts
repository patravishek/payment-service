// payment-service/src/services/paymentService.ts
import { IPaymentRequest } from '../interfaces/IPaymentRequest';
import { ExternalPaymentGateway } from './externalPaymentGateway';
import { getRabbitMQChannel } from '../config/rabbitmq';
import { Payment } from '../entities/Payment';
import { AppDataSource } from '../config/db';
import { logger } from '../config/logger';

// The PaymentRepository will be available once AppDataSource is initialized
const paymentRepository = AppDataSource.getRepository(Payment);

export class PaymentService {
  static async handlePaymentRequest(paymentRequest: IPaymentRequest): Promise<void> {
    logger.info(`Processing payment request for orderId=${paymentRequest.orderId}`);

    // First, create a Payment record in DB with status = 'PENDING'
    const paymentRecord = new Payment();
    paymentRecord.orderId = paymentRequest.orderId;
    paymentRecord.customerId = paymentRequest.customerId;
    paymentRecord.encryptedCardInfo = paymentRequest.encryptedCardInfo;
    paymentRecord.amount = paymentRequest.amount;
    paymentRecord.paymentStatus = 'PENDING';

    const savedPayment = await paymentRepository.save(paymentRecord);
    logger.debug(`Payment record created with id=${savedPayment.id}`);

    // Decrypt card info (pseudo). In production, mirror the actual encryption logic
    const decryptedCardInfo = this.mockDecrypt(paymentRequest.encryptedCardInfo);

    // 3. Call external gateway
    logger.debug(`Calling external payment gateway for orderId=${paymentRequest.orderId}`);
    const paymentStatus = await ExternalPaymentGateway.processPayment(
      paymentRequest.amount,
      decryptedCardInfo
    );

    // 4. Update DB with final status
    savedPayment.paymentStatus = paymentStatus;
    await paymentRepository.save(savedPayment);
    logger.info(
      `Payment for orderId=${paymentRequest.orderId} updated to status=${paymentStatus}`
    );

    // 5. Publish response back to order service
    const channel = await getRabbitMQChannel();
    const responsePayload = {
      orderId: paymentRequest.orderId,
      customerId: paymentRequest.customerId,
      paymentStatus
    };
    channel.sendToQueue(
      'payment_response_queue',
      Buffer.from(JSON.stringify(responsePayload)),
      { persistent: true, headers: { 'x-retries': 0 } }
    );
  }

  // For demonstration only
  private static mockDecrypt(encrypted: string): string {
    // In a real scenario, you must properly decrypt with the same
    // encryption strategy used by the Order Service.
    return '4111111111111111';
  }
}