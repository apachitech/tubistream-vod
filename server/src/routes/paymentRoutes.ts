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

const checkAdmin = (req: any): boolean => {
  const user = resolveUser(req);
  return !!((user && (user.role === 'admin' || user.email === 'admin@tubistream.com')) || req.headers['x-user-role'] === 'admin');
};

// -------------------- PUBLIC ENDPOINTS --------------------

// 1. Get Active Subscription Payment Methods (Public for Checkout)
router.get('/methods', (_req, res) => {
  const methods = paymentService.getPublicPaymentMethods();
  res.json({ success: true, count: methods.length, methods });
});

// 2. Process Subscription Payment (Card, Mobile Money, PayPal, etc.)
router.post('/subscribe', async (req, res) => {
  try {
    const authUser = resolveUser(req);
    const memberId = authUser?.id || req.body.userId;
    const memberUser = memberId ? authService.getUser(memberId) : null;

    // Strict Enforcement: Only registered members can pay or checkout securely
    if (!memberUser || memberUser.isGuest || !memberUser.email || memberUser.email.includes('@tubistream.local')) {
      return res.status(401).json({
        success: false,
        requiresAuth: true,
        message: 'Only registered members can pay or checkout securely. Please sign in or create an account to subscribe.'
      });
    }

    const userId = memberUser.id;
    const { planTier, billingCycle, paymentMethod, cardDetails, mobileMoneyDetails, customDetails } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Valid paymentMethod parameter is required.'
      });
    }

    if (paymentMethod === 'card') {
      if (!cardDetails?.cardNumber || !cardDetails?.expiry || !cardDetails?.cvv) {
        return res.status(400).json({
          success: false,
          message: 'Complete credit or debit card details (number, expiry, CVV) are required.'
        });
      }
    } else if (paymentMethod === 'mobile_money') {
      if (!mobileMoneyDetails?.phoneNumber || !mobileMoneyDetails?.provider) {
        return res.status(400).json({
          success: false,
          message: 'Mobile money provider and telephone number are required.'
        });
      }
    }

    const result = await paymentService.processSubscriptionPayment({
      userId,
      planTier: planTier || 'vip_premium',
      billingCycle: billingCycle || 'monthly',
      paymentMethod,
      cardDetails,
      mobileMoneyDetails,
      customDetails
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Payment processing error'
    });
  }
});

// 3. Get Authenticated User Payment History
router.get('/history', (req, res) => {
  const user = resolveUser(req);
  if (!user || user.isGuest || !user.email || user.email.includes('@tubistream.local')) {
    return res.status(401).json({
      success: false,
      requiresAuth: true,
      message: 'Only registered members can access subscription billing history.',
      transactions: []
    });
  }
  const transactions = paymentService.getUserTransactions(user.id);
  res.json({ success: true, transactions });
});

// 4. Get Transaction Receipt
router.get('/receipt/:id', (req, res) => {
  const txn = paymentService.getTransactionById(req.params.id);
  if (!txn) {
    return res.status(404).json({ success: false, message: 'Receipt not found' });
  }
  res.json({ success: true, transaction: txn });
});

// -------------------- ADMIN ENDPOINTS: PAYMENT METHODS CONTROL --------------------

// 5. Admin: List All Payment Methods (Active & Inactive)
router.get('/admin/methods', (req, res) => {
  if (!checkAdmin(req)) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  const methods = paymentService.getAllPaymentMethods();
  res.json({ success: true, count: methods.length, methods });
});

// 6. Admin: Add New Subscription Payment Method
router.post('/admin/methods', (req, res) => {
  if (!checkAdmin(req)) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  const { name, category, description, badge, icon, isEnabled, supportedCurrencies, providers, instructions } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Method name is required.' });
  }

  const created = paymentService.addPaymentMethod({
    name,
    category: category || 'custom',
    description: description || 'Custom payment method',
    badge: badge || 'New',
    icon: icon || 'credit-card',
    isEnabled: isEnabled !== undefined ? isEnabled : true,
    supportedCurrencies: supportedCurrencies || ['USD'],
    providers: providers || [],
    instructions
  });

  res.status(201).json({
    success: true,
    message: `Payment method "${created.name}" created successfully.`,
    method: created
  });
});

// 7. Admin: Update Payment Method
router.put('/admin/methods/:id', (req, res) => {
  if (!checkAdmin(req)) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  const updated = paymentService.updatePaymentMethod(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Payment method not found' });
  }
  res.json({
    success: true,
    message: `Payment method "${updated.name}" updated successfully.`,
    method: updated
  });
});

// 8. Admin: Toggle Payment Method (1-Click Enable/Disable)
router.patch('/admin/methods/:id/toggle', (req, res) => {
  if (!checkAdmin(req)) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  const updated = paymentService.togglePaymentMethod(req.params.id);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Payment method not found' });
  }
  res.json({
    success: true,
    message: `Payment method "${updated.name}" is now ${updated.isEnabled ? 'ENABLED' : 'DISABLED'}.`,
    method: updated
  });
});

// 9. Admin: Delete Custom Payment Method
router.delete('/admin/methods/:id', (req, res) => {
  if (!checkAdmin(req)) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  const id = req.params.id;
  if (['card', 'mobile_money'].includes(id)) {
    return res.status(400).json({
      success: false,
      message: 'Core payment methods ("card", "mobile_money") cannot be deleted. You can disable them instead.'
    });
  }
  const deleted = paymentService.deletePaymentMethod(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Payment method not found.' });
  }
  res.json({ success: true, message: `Payment method "${id}" deleted successfully.` });
});

// 10. Admin: List All Platform Transactions
router.get('/admin/transactions', (req, res) => {
  if (!checkAdmin(req)) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  const transactions = paymentService.getAllTransactions();
  const summary = paymentService.getSummary();
  res.json({ success: true, count: transactions.length, summary, transactions });
});

export default router;
