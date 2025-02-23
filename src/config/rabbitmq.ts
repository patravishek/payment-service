// payment-service/src/config/rabbitmq.ts
import amqp from 'amqplib';
import { ENV } from './environment';
import { logger } from './logger';

let channel: amqp.Channel;

export const getRabbitMQChannel = async (): Promise<amqp.Channel> => {
  if (channel) {
    return channel;
  }

  const connection = await amqp.connect(ENV.RABBITMQ_URL);
  channel = await connection.createChannel();

  // Assert required queues
  await channel.assertQueue('payment_queue', { durable: true });
  await channel.assertQueue('payment_response_queue', { durable: true });
  await channel.assertQueue('payment_queue_deadletter', { durable: true });

  return channel;
};

export const consumeWithRetry = async (
  queue: string,
  onMessage: (msg: amqp.ConsumeMessage, channel: amqp.Channel) => Promise<void>,
  maxRetries = 3
) => {
  const ch = await getRabbitMQChannel();
  ch.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      await onMessage(msg, ch);
      ch.ack(msg);
    } catch (error) {
      logger.error(`Error processing message in queue ${queue}: ${error}`);

      const headers = msg.properties.headers || {};
      const currentRetries = headers['x-retries'] || 0;

      if (currentRetries < maxRetries) {
        ch.nack(msg, false, false);

        const newHeaders = {
          ...headers,
          'x-retries': currentRetries + 1,
        };

        ch.sendToQueue(queue, msg.content, {
          persistent: true,
          headers: newHeaders,
        });

        logger.warn(
          `Message requeued with x-retries=${currentRetries + 1} for queue=${queue}`
        );
      } else {
        ch.nack(msg, false, false);
        ch.sendToQueue('payment_queue_deadletter', msg.content, {
          persistent: true,
          headers,
        });
        logger.error('Message exceeded max retries. Sent to dead-letter queue.');
      }
    }
  });
};