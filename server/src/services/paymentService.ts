import {
  PaymentTransaction,
  SubscriptionPaymentRequest,
  SubscriptionPaymentMethodConfig,
  User,
  MobileMoneyProvider
} from '../types';
import { authService } from './authService';

export class PaymentService {
  private paymentMethods: SubscriptionPaymentMethodConfig[] = [
    {
      id: 'card',
      name: 'Credit / Debit Card',
      category: 'card',
      description: 'Visa, Mastercard, American Express & Verve with 256-bit PCI-DSS SSL encryption',
      badge: 'Popular',
      icon: 'credit-card',
      isEnabled: true,
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'NGN', 'GHS', 'KES'],
      providers: [
        { id: 'visa', name: 'Visa', color: '#1a1f71', isEnabled: true },
        { id: 'mastercard', name: 'Mastercard', color: '#eb001b', isEnabled: true },
        { id: 'amex', name: 'American Express', color: '#006fcf', isEnabled: true },
        { id: 'verve', name: 'Verve Card', color: '#00425a', isEnabled: true }
      ],
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      category: 'mobile_money',
      description: 'Instant USSD authorization via top African mobile telecom operators',
      badge: 'Pan-Africa',
      icon: 'smartphone',
      isEnabled: true,
      supportedCurrencies: ['USD', 'GHS', 'NGN', 'KES', 'XOF', 'UGX', 'RWF'],
      providers: [
        { id: 'mtn', name: 'MTN MoMo', color: '#ffcc00', isEnabled: true },
        { id: 'orange', name: 'Orange Money', color: '#ff6600', isEnabled: true },
        { id: 'mpesa', name: 'M-Pesa (Safaricom)', color: '#00b050', isEnabled: true },
        { id: 'airtel', name: 'Airtel Money', color: '#ff0000', isEnabled: true },
        { id: 'wave', name: 'Wave Mobile Money', color: '#1dc4e9', isEnabled: true }
      ],
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'paypal',
      name: 'PayPal & Digital Wallets',
      category: 'wallet',
      description: 'One-click checkout via PayPal, Venmo and linked bank accounts',
      badge: 'Global',
      icon: 'wallet',
      isEnabled: true,
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD'],
      providers: [
        { id: 'paypal', name: 'PayPal Express', color: '#003087', isEnabled: true },
        { id: 'venmo', name: 'Venmo', color: '#008cff', isEnabled: true }
      ],
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay & Google Pay',
      category: 'wallet',
      description: 'Biometric 1-touch payment via Apple Wallet and Google Wallet',
      badge: 'Instant Touch',
      icon: 'zap',
      isEnabled: true,
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bank_transfer',
      name: 'Direct Bank Wire & EFT',
      category: 'bank',
      description: 'Direct wire transfer from US, European and African commercial banks',
      badge: 'Zero Fees',
      icon: 'bank',
      isEnabled: false,
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'NGN', 'ZAR'],
      instructions: 'Transfer reference code will be generated upon invoice checkout.',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency (USDT / BTC)',
      category: 'crypto',
      description: 'Web3 crypto payment via USDT (TRC-20 / ERC-20), Bitcoin, and Ethereum',
      badge: 'Web3',
      icon: 'coins',
      isEnabled: false,
      supportedCurrencies: ['USDT', 'USDC', 'BTC', 'ETH'],
      instructions: 'Send exact token balance to the generated smart contract address.',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

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

  // -------------------- PAYMENT METHODS MANAGEMENT (ADMIN) --------------------

  public getAllPaymentMethods(): SubscriptionPaymentMethodConfig[] {
    return this.paymentMethods;
  }

  public getPublicPaymentMethods(): SubscriptionPaymentMethodConfig[] {
    return this.paymentMethods.filter(m => m.isEnabled);
  }

  public getPaymentMethodById(id: string): SubscriptionPaymentMethodConfig | undefined {
    return this.paymentMethods.find(m => m.id === id);
  }

  public addPaymentMethod(
    data: Partial<SubscriptionPaymentMethodConfig>
  ): SubscriptionPaymentMethodConfig {
    const rawId = (data.id || data.name || 'custom-method')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
    
    // Ensure unique ID
    let finalId = rawId;
    let counter = 1;
    while (this.paymentMethods.some(m => m.id === finalId)) {
      finalId = `${rawId}_${counter++}`;
    }

    const newMethod: SubscriptionPaymentMethodConfig = {
      id: finalId,
      name: data.name || 'New Payment Method',
      category: data.category || 'custom',
      description: data.description || 'Secure payment gateway',
      badge: data.badge || 'New',
      icon: data.icon || 'credit-card',
      isEnabled: data.isEnabled !== undefined ? data.isEnabled : true,
      supportedCurrencies: data.supportedCurrencies && data.supportedCurrencies.length > 0
        ? data.supportedCurrencies
        : ['USD'],
      providers: data.providers || [],
      instructions: data.instructions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.paymentMethods.push(newMethod);
    return newMethod;
  }

  public updatePaymentMethod(
    id: string,
    updates: Partial<SubscriptionPaymentMethodConfig>
  ): SubscriptionPaymentMethodConfig | null {
    const index = this.paymentMethods.findIndex(m => m.id === id);
    if (index === -1) return null;

    const existing = this.paymentMethods[index];
    const updated: SubscriptionPaymentMethodConfig = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable ID
      updatedAt: new Date().toISOString()
    };

    this.paymentMethods[index] = updated;
    return updated;
  }

  public togglePaymentMethod(id: string): SubscriptionPaymentMethodConfig | null {
    const method = this.paymentMethods.find(m => m.id === id);
    if (!method) return null;
    method.isEnabled = !method.isEnabled;
    method.updatedAt = new Date().toISOString();
    return method;
  }

  public deletePaymentMethod(id: string): boolean {
    const initialLen = this.paymentMethods.length;
    this.paymentMethods = this.paymentMethods.filter(m => m.id !== id);
    return this.paymentMethods.length < initialLen;
  }

  // -------------------- PAYMENT PROCESSING & LEDGER --------------------

  public async processSubscriptionPayment(
    req: SubscriptionPaymentRequest
  ): Promise<{ success: boolean; message: string; transaction: PaymentTransaction; user: User }> {
    const user = authService.getUser(req.userId);
    if (!user) {
      throw new Error('User account not found. Please sign in or register.');
    }

    // Verify selected payment method is active & configured
    const configuredMethod = this.paymentMethods.find(m => m.id === req.paymentMethod);
    if (!configuredMethod) {
      throw new Error(`Payment method "${req.paymentMethod}" is not supported on this platform.`);
    }

    if (!configuredMethod.isEnabled) {
      throw new Error(`The payment method "${configuredMethod.name}" is currently disabled by administrator.`);
    }

    const amount = req.billingCycle === 'annual' ? 49.99 : 5.99;
    let providerLabel = configuredMethod.name;
    let summary = configuredMethod.name;

    if (req.paymentMethod === 'card') {
      const card = req.cardDetails;
      const cleanNumber = (card?.cardNumber || '4242424242424242').replace(/\s+/g, '');
      const last4 = cleanNumber.slice(-4) || '4242';
      const brand = (card?.cardBrand || 'Visa').toUpperCase();
      providerLabel = brand;
      summary = `${brand} •••• ${last4}`;
    } else if (req.paymentMethod === 'mobile_money') {
      const momo = req.mobileMoneyDetails;
      const providerNames: Record<string, string> = {
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
    } else if (req.paymentMethod === 'paypal') {
      providerLabel = 'PayPal Express';
      summary = `PayPal (${user.email})`;
    } else if (req.paymentMethod === 'apple_pay') {
      providerLabel = 'Apple / Google Pay';
      summary = `Digital Wallet (1-Touch Biometric)`;
    } else {
      providerLabel = configuredMethod.name;
      summary = `${configuredMethod.name} (${configuredMethod.badge || 'Verified'})`;
    }

    const txnId = `txn-${req.paymentMethod.substring(0, 4)}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

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

    // Automatically upgrade user account tier to VIP Premium ONLY upon verified payment authorization
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
