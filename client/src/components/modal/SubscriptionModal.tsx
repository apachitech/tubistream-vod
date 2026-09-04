import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Crown, Check, X, Sparkles, ShieldCheck, Zap, Lock } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { user, upgradeToVip } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      await upgradeToVip();
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
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
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-heavy animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '840px',
          borderRadius: '28px',
          padding: '40px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
          border: '2px solid rgba(255, 215, 0, 0.4)',
          background: 'linear-gradient(180deg, #10121d 0%, #0d0e17 100%)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)'
          }}
        >
          <X size={22} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.7)'
              }}
            >
              <Crown size={38} color="#000" />
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffd700', marginBottom: '8px' }}>
              Welcome to Tubi+ VIP!
            </h2>
            <p style={{ color: '#fff', fontSize: '1.1rem' }}>
              You now have 100% ad-free 4K streaming and Dolby Atmos audio.
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '12px'
                }}
              >
                <Crown size={14} /> VIP PREMIUM UPGRADE
              </div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
                Upgrade to Tubi+ VIP
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Keep watching thousands of movies & shows with ZERO commercial interruptions.
              </p>

              {/* Billing Toggle */}
              <div
                style={{
                  display: 'inline-flex',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px',
                  marginTop: '20px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <button
                  onClick={() => setBillingCycle('monthly')}
                  style={{
                    padding: '6px 18px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: billingCycle === 'monthly' ? '#ffd700' : 'transparent',
                    color: billingCycle === 'monthly' ? '#000' : 'var(--text-secondary)'
                  }}
                >
                  Monthly ($4.99/mo)
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  style={{
                    padding: '6px 18px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: billingCycle === 'annual' ? '#ffd700' : 'transparent',
                    color: billingCycle === 'annual' ? '#000' : 'var(--text-secondary)'
                  }}
                >
                  Annual ($49.99/yr • Save 17%)
                </button>
              </div>
            </div>

            {/* Plan Comparison Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '32px'
              }}
            >
              {/* Free Plan */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                  Tubi Free
                </h4>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
                  $0 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ forever</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} color="var(--accent-green)" /> Full VOD & FAST Catalog
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} color="var(--accent-green)" /> Up to 1080p HD Streaming
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <X size={16} color="var(--accent-pink)" /> Ad-Supported (Short Breaks)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <X size={16} color="var(--accent-pink)" /> Offline Downloads Not Included
                  </li>
                </ul>
              </div>

              {/* VIP Premium Plan */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 136, 0, 0.05) 100%)',
                  border: '2px solid rgba(255, 215, 0, 0.6)',
                  boxShadow: '0 8px 30px rgba(255, 215, 0, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffd700' }}>
                    Tubi+ VIP Premium
                  </h4>
                  <span className="badge-vip">RECOMMENDED</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
                  {billingCycle === 'monthly' ? '$4.99' : '$49.99'}{' '}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {billingCycle === 'monthly' ? '/ month' : '/ year'}
                  </span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#fff' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={16} color="#ffd700" /> <strong>100% Zero Ads</strong>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} color="var(--accent-green)" /> 4K Ultra HD + HDR10 & Dolby Atmos
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} color="var(--accent-green)" /> Unlimited Offline Downloads
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} color="var(--accent-green)" /> 4 Simultaneous Streams & Profiles
                  </li>
                </ul>
              </div>
            </div>

            {/* Subscribe Action Button */}
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
                color: '#000',
                fontWeight: 900,
                fontSize: '1.1rem',
                boxShadow: '0 4px 20px rgba(255, 215, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isProcessing ? 'Authorizing Secure Payment...' : 'Start VIP Membership • Cancel Anytime'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <Lock size={12} /> 256-Bit SSL Encrypted Mock Stripe Checkout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
