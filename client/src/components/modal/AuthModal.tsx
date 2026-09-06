import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, Sparkles, CheckCircle2, Crown, ShieldAlert, Film, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register } = useAuth();
  const { siteName } = useSiteSettings();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (authModalTab === 'signin') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.message || 'Failed to sign in. Please verify your credentials.');
      }
    } else {
      const res = await register(email, password, name);
      if (!res.success) {
        setError(res.message || 'Failed to register account.');
      }
    }
    setIsSubmitting(false);
  };

  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setIsSubmitting(true);
    login(demoEmail, demoPass).then((res) => {
      if (!res.success) {
        setError(res.message || 'Failed to log in with demo account.');
      }
      setIsSubmitting(false);
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        className="glass-heavy"
        style={{
          width: '100%',
          maxWidth: '460px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 42, 109, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 42, 109, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Header with Brand & Close */}
        <div
          style={{
            padding: '24px 24px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ff2a6d 0%, #ff6e00 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(255, 42, 109, 0.55)'
              }}
            >
              <Film size={20} color="#fff" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(90deg, #ffffff 0%, #ff2a6d 70%, #ff6e00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1
                }}
              >
                tubi<span style={{ fontWeight: 400, color: '#fff' }}>stream</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                Cinema Experience & Live FAST TV
              </div>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div style={{ padding: '16px 24px 0' }}>
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <button
              onClick={() => {
                setError(null);
                openAuthModal('signin');
              }}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.86rem',
                color: authModalTab === 'signin' ? '#fff' : 'var(--text-secondary)',
                background: authModalTab === 'signin' ? 'linear-gradient(135deg, rgba(255, 42, 109, 0.3) 0%, rgba(255, 110, 0, 0.2) 100%)' : 'transparent',
                border: authModalTab === 'signin' ? '1px solid rgba(255, 42, 109, 0.6)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setError(null);
                openAuthModal('register');
              }}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.86rem',
                color: authModalTab === 'register' ? '#fff' : 'var(--text-secondary)',
                background: authModalTab === 'register' ? 'linear-gradient(135deg, rgba(255, 42, 109, 0.3) 0%, rgba(255, 110, 0, 0.2) 100%)' : 'transparent',
                border: authModalTab === 'register' ? '1px solid rgba(255, 42, 109, 0.6)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              Create Free Account
            </button>
          </div>
        </div>

        {/* 1-Click Demo Accounts Quick-Select */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
            Instant 1-Click Demo Profiles
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('viewer@tubistream.com', 'password123')}
              style={{
                padding: '8px 6px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-pink)';
                e.currentTarget.style.background = 'rgba(255, 42, 109, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <Film size={14} color="var(--accent-pink)" />
              <span>Free Viewer</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('vip@tubistream.com', 'vip123')}
              style={{
                padding: '8px 6px',
                borderRadius: '8px',
                background: 'rgba(255, 215, 0, 0.08)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: '#ffd700',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ffd700';
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.08)';
              }}
            >
              <Crown size={14} color="#ffd700" />
              <span>VIP Member</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin@tubistream.com', 'admin123')}
              style={{
                padding: '8px 6px',
                borderRadius: '8px',
                background: 'rgba(157, 78, 221, 0.12)',
                border: '1px solid rgba(157, 78, 221, 0.35)',
                color: '#d8b4fe',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-purple)';
                e.currentTarget.style.background = 'rgba(157, 78, 221, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(157, 78, 221, 0.35)';
                e.currentTarget.style.background = 'rgba(157, 78, 221, 0.12)';
              }}
            >
              <Sparkles size={14} color="var(--accent-purple)" />
              <span>Admin Studio</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ padding: '12px 24px 0' }}>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 42, 109, 0.15)',
                border: '1px solid rgba(255, 42, 109, 0.5)',
                color: '#ff6b8b',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authModalTab === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>
                Your Name / Profile Name
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <UserIcon size={16} color="var(--text-muted)" style={{ marginRight: '10px', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: '0.88rem',
                    width: '100%'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>
              Email Address
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '10px 14px',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <Mail size={16} color="var(--text-muted)" style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.88rem',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>
              Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '10px 14px',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <Lock size={16} color="var(--text-muted)" style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.88rem',
                  width: '100%'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.94rem',
              justifyContent: 'center',
              marginTop: '6px',
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? (
              <span>Connecting...</span>
            ) : authModalTab === 'signin' ? (
              <>
                <span>Sign In to {siteName}</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>Create Free {siteName} Account</span>
                <Sparkles size={16} />
              </>
            )}
          </button>

          {/* Perks list */}
          <div
            style={{
              marginTop: '8px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
              <CheckCircle2 size={13} color="#00f076" />
              <span>Sync Watchlist & resume playback across all devices</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
              <CheckCircle2 size={13} color="#00f076" />
              <span>100% Free streaming — no credit card ever needed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
              <CheckCircle2 size={13} color="#00f076" />
              <span>Smart TV 1-click activation & Kids Zone profile</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
