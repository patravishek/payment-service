// src/services/externalPaymentGateway.ts

export class ExternalPaymentGateway {
    // Simulate payment by calling Razorpay, Paytm or any third-party gateway
    static async processPayment(amount: number, cardInfo: string): Promise<'SUCCESS' | 'FAILED'> {
      // Pseudo code: call external API
      // For example:
      // const response = await axios.post("https://some-provider.com/pay", {...});
      // if (response.status === 200) { return 'SUCCESS'; }
      // else return 'FAILED';
      
      // For demonstration, let's randomly succeed or fail
      const isSuccess = Math.random() < 0.8; // 80% success rate
      return isSuccess ? 'SUCCESS' : 'FAILED';
    }
  }