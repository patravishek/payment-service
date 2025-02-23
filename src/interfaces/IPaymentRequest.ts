// src/interfaces/IPaymentRequest.ts
export interface IPaymentRequest {
    orderId: string;
    customerId: string;
    encryptedCardInfo: string;
    amount: number;
  }