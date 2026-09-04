import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaymentMethodType, MobileMoneyProvider, PaymentTransaction } from '../../types';
import {
  Crown, Check, X, Sparkles, ShieldCheck, Zap, Lock, CreditCard,
  Smartphone, ArrowRight, RefreshCw, Download, AlertCircle, UserCheck, LogIn
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { user, upgradeToVip, isAuthenticated, isGuest, openAuthModal } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  
  // Card Form State
  const [cardholderName, setCardholderName] = useState(user?.name || 'Alex Rivera');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');

  // Mobile Money Form State
  const [momoProvider, setMomoProvider] = useState<MobileMoneyProvider>('mtn');
  const [countryCode, setCountryCode] = useState('+233');
  const [phoneNumber, setPhoneNumber] = useState('055 123 4567');

  // Checkout Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [ussdWaiting, setUssdWaiting] = useState(false);
  const [ussdCountdown, setUssdCountdown] = useState(3);
  const [completedTransaction, setCompletedTransaction] = useState<PaymentTransaction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Compute live price
  const price = billingCycle === 'annual' ? 49.99 : 5.99;
  const formattedPrice = `$${price.toFixed(2)}`;

  // Card Brand Detection
  const getCardBrand = (num: string): 'visa' | 'mastercard' | 'amex' | 'generic' => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (clean.startsWith('5') || clean.startsWith('2')) return 'mastercard';
    if (clean.startsWith('3')) return 'amex';
    return 'generic';
  };

  const cardBrand = getCardBrand(cardNumber);

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.substring(0, 2)}/${raw.substring(2, 4)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Enforce: Only registered members can pay or checkout securely
    if (!isAuthenticated || isGuest) {
      setErrorMessage('Only registered members can pay or checkout securely. Please sign in or create an account.');
      onClose();
      openAuthModal('signin');
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'mobile_money') {
      // Simulate live USSD mobile prompt on customer's phone
      setUssdWaiting(true);
      setUssdCountdown(3);

      const interval = setInterval(() => {
        setUssdCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            executePayment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeout(() => {
        executePayment();
      }, 1200);
    }
  };

  const executePayment = async () => {
    try {
      const result = await upgradeToVip({
        billingCycle,
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? {
          cardNumber: cardNumber.replace(/\s+/g, ''),
          cardBrand,
          cardholderName,
          expiry,
          cvv
        } : undefined,
        mobileMoneyDetails: paymentMethod === 'mobile_money' ? {
          provider: momoProvider,
          phoneNumber: phoneNumber.replace(/\s+/g, ''),
          countryCode
        } : undefined
      });

      setIsProcessing(false);
      setUssdWaiting(false);

      if (result.success && result.transaction) {
        setCompletedTransaction(result.transaction);
      } else {
        setErrorMessage(result.message || 'Payment authorization failed');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setUssdWaiting(false);
      setErrorMessage(err.message || 'Payment processing error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="glass-heavy animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '92vh',
          borderRadius: '28px',
          padding: '36px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
          border: '2px solid rgba(255, 215, 0, 0.4)',
          background: 'linear-gradient(180deg, #10121d 0%, #0d0e17 100%)',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        {completedTransaction ? (
          /* Success Screen with Digital Invoice Receipt */
          <div style={{ textAlign: 'center', padding: '20px 10px' }} className="animate-fade-in">
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.7)'
              }}
            >
              <Crown size={40} color="#000" />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 240, 118, 0.15)', border: '1px solid #00f076', color: '#00f076', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 800, marginBottom: '12px' }}>
              <Check size={16} /> PAYMENT SUCCESSFUL • VIP UNLOCKED
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffd700', marginBottom: '8px' }}>
              Welcome to Tubi+ VIP Premium!
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 24px' }}>
              Your subscription is officially active. You now enjoy zero ads, crisp 4K Ultra HD streaming, and unlimited offline downloads.
            </p>

            {/* Digital Receipt Card */}
            <div
              style={{
                maxWidth: '520px',
                margin: '0 auto 28px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '16px',
                padding: '20px 24px',
                textAlign: 'left',
                fontSize: '0.88rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Reference:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#00f076' }}>{completedTransaction.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Plan:</span>
                <span style={{ fontWeight: 800, color: '#fff' }}>Tubi+ VIP ({completedTransaction.billingCycle === 'annual' ? 'Annual Pass' : 'Monthly Pass'})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                <span style={{ fontWeight: 800, color: '#ffd700' }}>{completedTransaction.summary}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Billed:</span>
                <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#fff' }}>${completedTransaction.amount.toFixed(2)} USD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: '#00f076', fontWeight: 800 }}>● Settled & Verified</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-primary"
              style={{
                padding: '14px 36px',
                fontSize: '1rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
                color: '#000',
                border: 'none',
                boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)'
              }}
            >
              Start Streaming VIP Content Now
            </button>
          </div>
        ) : (
          <div>
            {/* Modal Top Banner */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '10px'
                }}
              >
                <Crown size={14} /> VIP PREMIUM CHECKOUT
              </div>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
                Choose Your Payment Method
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Enjoy 100% ad-free cinema, 4K HDR streams, and unlimited downloads.
              </p>

              {/* Billing Cycle Toggle */}
              <div
                style={{
                  display: 'inline-flex',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px',
                  marginTop: '16px',
                  border: '1px solid rgba(255,255,255,0.12)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  style={{
                    padding: '6px 20px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: billingCycle === 'monthly' ? '#ffd700' : 'transparent',
                    color: billingCycle === 'monthly' ? '#000' : 'var(--text-secondary)',
                    border: 'none'
                  }}
                >
                  Monthly ($5.99 / mo)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  style={{
                    padding: '6px 20px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: billingCycle === 'annual' ? '#ffd700' : 'transparent',
                    color: billingCycle === 'annual' ? '#000' : 'var(--text-secondary)',
                    border: 'none'
                  }}
                >
                  Annual ($49.99 / yr • Save 17%)
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div
                style={{
                  background: 'rgba(255, 42, 109, 0.15)',
                  border: '1px solid var(--accent-pink)',
                  color: '#ff2a6d',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}
              >
                <AlertCircle size={18} /> {errorMessage}
              </div>
            )}

            {/* Main Checkout Columns: Left = Payment Method & Form, Right = Order Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px', alignItems: 'start' }}>
              {/* Left Column: Payment Form */}
              <div>
                {/* Registered Member Verification Banner / Gate */}
                {!isAuthenticated || isGuest ? (
                  <div
                    style={{
                      padding: '18px 20px',
                      borderRadius: '16px',
                      background: 'rgba(255, 42, 109, 0.08)',
                      border: '1.5px solid rgba(255, 42, 109, 0.4)',
                      marginBottom: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255, 42, 109, 0.2)', color: '#ff2a6d' }}>
                        <Lock size={18} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                          Registered Member Account Required
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: '#ff2a6d', fontWeight: 700 }}>
                          Only registered members can pay or checkout securely
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      To securely protect your payment credentials and link your VIP ad-free access & 4K benefits across your devices, please sign in or register before checking out.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openAuthModal('signin');
                        }}
                        style={{
                          flex: 1,
                          padding: '9px 14px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
                          color: '#000',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <LogIn size={14} /> Sign In to Account
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openAuthModal('register');
                        }}
                        style={{
                          flex: 1,
                          padding: '9px 14px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        Create Free Account
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(0, 240, 118, 0.08)',
                      border: '1px solid rgba(0, 240, 118, 0.25)',
                      marginBottom: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={16} color="#00f076" />
                      <span style={{ color: '#fff', fontWeight: 600 }}>
                        Secure Checkout for: <strong style={{ color: '#00f076' }}>{user?.email}</strong>
                      </span>
                    </div>
                    <span style={{ fontSize: '0.70rem', background: 'rgba(0, 240, 118, 0.2)', color: '#00f076', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      VERIFIED MEMBER
                    </span>
                  </div>
                )}

                {/* Method Switcher Tabs: Card vs Mobile Money */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: paymentMethod === 'card' ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.12)',
                      background: paymentMethod === 'card' ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255,255,255,0.03)',
                      color: paymentMethod === 'card' ? '#ffd700' : 'var(--text-secondary)',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <CreditCard size={18} /> Credit / Debit Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: paymentMethod === 'mobile_money' ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.12)',
                      background: paymentMethod === 'mobile_money' ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255,255,255,0.03)',
                      color: paymentMethod === 'mobile_money' ? '#ffd700' : 'var(--text-secondary)',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Smartphone size={18} /> Mobile Money (MoMo)
                  </button>
                </div>

                <form onSubmit={handleSubscribe}>
                  {/* Option 1: Credit / Debit Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accepted: Visa, MasterCard, Amex</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCardNumber('4242 4242 4242 4242');
                            setExpiry('12/28');
                            setCvv('123');
                            setCardholderName(user?.name || 'Alex Rivera');
                          }}
                          style={{ background: 'none', border: 'none', color: '#ffd700', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Auto-fill Test Card
                        </button>
                      </div>

                      {/* Cardholder Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '5px' }}>
                          Cardholder Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder="e.g. Alex Rivera"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem' }}
                        />
                      </div>

                      {/* Card Number */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '5px' }}>
                          Card Number
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            style={{ width: '100%', padding: '10px 48px 10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontFamily: 'monospace', fontSize: '0.95rem' }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              fontSize: '0.72rem',
                              fontWeight: 900,
                              color: cardBrand === 'visa' ? '#00b4d8' : cardBrand === 'mastercard' ? '#ff6e00' : '#ffd700',
                              textTransform: 'uppercase'
                            }}
                          >
                            {cardBrand}
                          </span>
                        </div>
                      </div>

                      {/* Expiry & CVV */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '5px' }}>
                            Expiry Date (MM/YY)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem', fontFamily: 'monospace' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '5px' }}>
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem', fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Option 2: Mobile Money (MoMo) Form */}
                  {paymentMethod === 'mobile_money' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Select your mobile telecom carrier:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setMomoProvider('mtn');
                            setCountryCode('+233');
                            setPhoneNumber('055 123 4567');
                          }}
                          style={{ background: 'none', border: 'none', color: '#ffd700', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Auto-fill Test MTN
                        </button>
                      </div>

                      {/* Provider Radio Pills */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                        {[
                          { id: 'mtn', label: 'MTN MoMo', color: '#ffcc00' },
                          { id: 'orange', label: 'Orange Money', color: '#ff6600' },
                          { id: 'mpesa', label: 'M-Pesa', color: '#00b050' },
                          { id: 'airtel', label: 'Airtel Money', color: '#ff0000' },
                          { id: 'wave', label: 'Wave', color: '#1dc4e9' }
                        ].map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setMomoProvider(p.id as any)}
                            style={{
                              padding: '10px 8px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              border: momoProvider === p.id ? `2px solid ${p.color}` : '1px solid rgba(255,255,255,0.1)',
                              background: momoProvider === p.id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                              color: momoProvider === p.id ? '#fff' : 'var(--text-secondary)',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              textAlign: 'center'
                            }}
                          >
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, display: 'inline-block', marginRight: '5px' }} />
                            {p.label}
                          </button>
                        ))}
                      </div>

                      {/* Phone & Country Code */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '5px' }}>
                          Registered Mobile Money Phone Number
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            style={{
                              width: '110px',
                              padding: '10px',
                              borderRadius: '8px',
                              background: '#12141d',
                              border: '1px solid rgba(255,255,255,0.15)',
                              color: '#fff',
                              fontSize: '0.85rem'
                            }}
                          >
                            <option value="+233">🇬🇭 +233 (GH)</option>
                            <option value="+234">🇳🇬 +234 (NG)</option>
                            <option value="+254">🇰🇪 +254 (KE)</option>
                            <option value="+225">🇨🇮 +225 (CI)</option>
                            <option value="+221">🇸🇳 +221 (SN)</option>
                            <option value="+237">🇨🇲 +237 (CM)</option>
                            <option value="+256">🇺🇬 +256 (UG)</option>
                            <option value="+250">🇷🇼 +250 (RW)</option>
                          </select>

                          <input
                            type="tel"
                            required
                            placeholder="055 123 4567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              borderRadius: '8px',
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.15)',
                              color: '#fff',
                              fontSize: '0.92rem',
                              fontFamily: 'monospace'
                            }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: 'rgba(255, 204, 0, 0.08)',
                          border: '1px solid rgba(255, 204, 0, 0.25)',
                          fontSize: '0.78rem',
                          color: '#ffcc00',
                          lineHeight: 1.4
                        }}
                      >
                        📲 <strong>Instant USSD Authorization:</strong> Clicking Subscribe will send an authorization push prompt directly to your phone. Enter your Mobile Money PIN on your handset to approve.
                      </div>
                    </div>
                  )}

                  {/* Submit Action Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    style={{
                      width: '100%',
                      marginTop: '22px',
                      padding: '14px',
                      borderRadius: '12px',
                      background: (!isAuthenticated || isGuest)
                        ? 'linear-gradient(135deg, rgba(255, 42, 109, 0.25) 0%, rgba(255, 42, 109, 0.1) 100%)'
                        : 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
                      color: (!isAuthenticated || isGuest) ? '#ff4d84' : '#000',
                      border: (!isAuthenticated || isGuest) ? '1px solid #ff2a6d' : 'none',
                      fontWeight: 900,
                      fontSize: '1rem',
                      boxShadow: (!isAuthenticated || isGuest) ? 'none' : '0 4px 20px rgba(255, 215, 0, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: isProcessing ? 'wait' : 'pointer'
                    }}
                  >
                    {(!isAuthenticated || isGuest) ? (
                      <>
                        <Lock size={16} />
                        Sign In or Register to Checkout Securely
                      </>
                    ) : isProcessing ? (
                      ussdWaiting ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Waiting for Phone PIN Approval ({ussdCountdown}s)...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Authorizing 256-bit Payment...
                        </>
                      )
                    ) : (
                      <>
                        Pay {formattedPrice} with {paymentMethod === 'card' ? 'Card' : 'Mobile Money'}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <Lock size={12} /> Encrypted 256-bit SSL Gateway • Instant Auto-Activation
                </div>
              </div>

              {/* Right Column: Order Summary & Perks */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: '20px',
                  background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 136, 0, 0.04) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.35)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffd700' }}>
                    Tubi+ VIP Premium
                  </h4>
                  <span className="badge-vip" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    NO ADS
                  </span>
                </div>

                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    <span>Billing Term:</span>
                    <span style={{ color: '#fff', fontWeight: 700 }}>{billingCycle === 'annual' ? 'Annual (12 Months)' : 'Monthly Recurring'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    <span>Selected Payment:</span>
                    <span style={{ color: '#ffd700', fontWeight: 700 }}>{paymentMethod === 'card' ? 'Credit / Debit Card' : 'Mobile Money'}</span>
                  </div>
                </div>

                {/* Total Price Box */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Due Today:</span>
                  <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff' }}>
                    {formattedPrice}{' '}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>USD</span>
                  </span>
                </div>

                {/* Feature Checklist */}
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={14} color="#ffd700" /> 100% Commercial-Free Bypass
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={14} color="#00f076" /> 4K Ultra HD & HDR10 Resolution
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={14} color="#00f076" /> Unlimited Offline Video Downloads
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={14} color="#00f076" /> Dolby Atmos Spatial Surround Sound
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={14} color="#00f076" /> 4 Simultaneous Stream Screens
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
