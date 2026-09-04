import {
  PaymentTransaction,
  SubscriptionPaymentRequest,
  User,
  MobileMoneyProvider
} from '../types';
import { authService } from './authService';

export class PaymentService {
  private transactions: PaymentTransaction[] = [
    {
      id: 'txn-crd-m7x9q1',
      userId: 'usr-vip-fan',
      userEmail: 'vip@tubistream.com',
      userName: 'Jordan Stone',
      amount: 49.99,
      currency: 'USD',
      planTier: 'vip_premium',
      billingCycle: 'annual',
      paymentMethod: 'card',
      providerLabel: 'VISA',
      summary: 'VISA •••• 4242',
      status: 'succeeded',
      receiptUrl: '/api/payment/receipt/txn-crd-m7x9q1',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'txn-momo-k3p8v2',
      userId: 'usr-default-tubi-fan',
      userEmail: 'viewer@tubistream.com',
      userName: 'Alex Rivera',
      amount: 5.99,
      currency: 'USD',
      planTier: 'vip_premium',
      billingCycle: 'monthly',
      paymentMethod: 'mobile_money',
      providerLabel: 'MTN Mobile Money',
      summary: 'MTN MoMo (+233) •••• 8291',
      status: 'succeeded',
      receiptUrl: '/api/payment/receipt/txn-momo-k3p8v2',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ];

  public async processSubscriptionPayment(
    req: SubscriptionPaymentRequest
  ): Promise<{ success: boolean; message: string; transaction: PaymentTransaction; user: User }> {
    const user = authService.getUser(req.userId) || authService.getUser('usr-default-tubi-fan')!;
    if (!user) {
      throw new Error('User account not found');
    }

    const amount = req.billingCycle === 'annual' ? 49.99 : 5.99;
    const isCard = req.paymentMethod === 'card';

    let providerLabel = 'CARD';
    let summary = 'Card Payment';

    if (isCard) {
      const card = req.cardDetails;
      const cleanNumber = (card?.cardNumber || '4242424242424242').replace(/\s+/g, '');
      const last4 = cleanNumber.slice(-4) || '4242';
      const brand = (card?.cardBrand || 'Visa').toUpperCase();
      providerLabel = brand;
      summary = `${brand} •••• ${last4}`;
    } else {
      const momo = req.mobileMoneyDetails;
      const providerNames: Record<MobileMoneyProvider, string> = {
        mtn: 'MTN Mobile Money',
        orange: 'Orange Money',
        mpesa: 'M-Pesa (Safaricom)',
        airtel: 'Airtel Money',
        wave: 'Wave Mobile Money'
      };
      const pName = providerNames[momo?.provider || 'mtn'] || 'Mobile Money';
      const cleanPhone = (momo?.phoneNumber || '0551234567').replace(/\s+/g, '');
      const last4 = cleanPhone.slice(-4) || '4567';
      const country = momo?.countryCode || '+233';
      providerLabel = pName;
      summary = `${pName} (${country}) •••• ${last4}`;
    }

    const txnId = `txn-${isCard ? 'crd' : 'momo'}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

    const transaction: PaymentTransaction = {
      id: txnId,
      userId: user.id,
      userEmail: user.email,
      userName: user.name || 'Subscriber',
      amount,
      currency: 'USD',
      planTier: 'vip_premium',
      billingCycle: req.billingCycle,
      paymentMethod: req.paymentMethod,
      providerLabel,
      summary,
      status: 'succeeded',
      receiptUrl: `/api/payment/receipt/${txnId}`,
      createdAt: new Date().toISOString()
    };

    // Automatically upgrade user account tier to VIP Premium
    const updatedUser = authService.updateUserTier(user.id, 'vip_premium') || user;
    updatedUser.tier = 'vip_premium';

    this.transactions.unshift(transaction);

    return {
      success: true,
      message: `Payment authorized successfully via ${providerLabel}! Welcome to Tubi+ VIP Premium.`,
      transaction,
      user: updatedUser
    };
  }

  public getAllTransactions(): PaymentTransaction[] {
    return this.transactions;
  }

  public getUserTransactions(userId: string): PaymentTransaction[] {
    return this.transactions.filter(t => t.userId === userId);
  }

  public getTransactionById(id: string): PaymentTransaction | undefined {
    return this.transactions.find(t => t.id === id);
  }

  public getSummary() {
    const totalRevenue = this.transactions.reduce((acc, t) => acc + (t.status === 'succeeded' ? t.amount : 0), 0);
    const cardCount = this.transactions.filter(t => t.paymentMethod === 'card').length;
    const momoCount = this.transactions.filter(t => t.paymentMethod === 'mobile_money').length;

    return {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalTransactions: this.transactions.length,
      cardCount,
      momoCount
    };
  }
}

export const paymentService = new PaymentService();
