import { Router } from 'express';
import { paymentService } from '../services/paymentService';
import { authService } from '../services/authService';

const router = Router();

const resolveUser = (req: any) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = authService.getUserByToken(token);
    if (user) return user;
  }
  const userId = req.headers['x-user-id'] as string;
  if (userId) {
    return authService.getUser(userId);
  }
  return null;
};

// 1. Process Subscription Payment (Card or Mobile Money)
router.post('/subscribe', async (req, res) => {
  try {
    const authUser = resolveUser(req);
    const userId = req.body.userId || authUser?.id || 'usr-default-tubi-fan';
    const { planTier, billingCycle, paymentMethod, cardDetails, mobileMoneyDetails } = req.body;

    if (!paymentMethod || !['card', 'mobile_money'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Valid paymentMethod ("card" or "mobile_money") is required.'
      });
    }

    if (paymentMethod === 'card') {
      if (!cardDetails?.cardNumber || !cardDetails?.expiry || !cardDetails?.cvv) {
        return res.status(400).json({
          success: false,
          message: 'Complete credit or debit card details are required.'
        });
      }
    } else if (paymentMethod === 'mobile_money') {
      if (!mobileMoneyDetails?.phoneNumber || !mobileMoneyDetails?.provider) {
        return res.status(400).json({
          success: false,
          message: 'Mobile money provider and phone number are required.'
        });
      }
    }

    const result = await paymentService.processSubscriptionPayment({
      userId,
      planTier: planTier || 'vip_premium',
      billingCycle: billingCycle || 'monthly',
      paymentMethod,
      cardDetails,
      mobileMoneyDetails
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Payment processing error'
    });
  }
});

// 2. Get Authenticated User Payment History
router.get('/history', (req, res) => {
  const user = resolveUser(req);
  if (!user) {
    return res.json({ success: true, transactions: [] });
  }
  const transactions = paymentService.getUserTransactions(user.id);
  res.json({ success: true, transactions });
});

// 3. Admin: List All Platform Transactions
router.get('/admin/transactions', (req, res) => {
  const user = resolveUser(req);
  const isAdmin = (user && (user.role === 'admin' || user.email === 'admin@tubistream.com')) || req.headers['x-user-role'] === 'admin';
  if (!isAdmin) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  const transactions = paymentService.getAllTransactions();
  const summary = paymentService.getSummary();
  res.json({ success: true, count: transactions.length, summary, transactions });
});

// 4. Get Transaction Receipt
router.get('/receipt/:id', (req, res) => {
  const txn = paymentService.getTransactionById(req.params.id);
  if (!txn) {
    return res.status(404).json({ success: false, message: 'Receipt not found' });
  }
  res.json({ success: true, transaction: txn });
});

export default router;
