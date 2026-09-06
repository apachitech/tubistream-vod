import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Tv, QrCode, Smartphone, CheckCircle, AlertCircle, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const TvActivationScreen: React.FC<{ onActivationSuccess?: () => void }> = ({ onActivationSuccess }) => {
  const { user } = useAuth();
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || 'TubiStream';
  const [activationCode, setActivationCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TV Generator Mode
  const [generatedPairingCode, setGeneratedPairingCode] = useState<string>('');
  const [isTvActive, setIsTvActive] = useState<boolean>(false);

  const generateNewTvCode = async () => {
    try {
      const res = await api.generateDeviceCode('smart_tv', 'Living Room OLED TV');
      if (res.success && res.pairing) {
        setGeneratedPairingCode(res.pairing.code);
        setIsTvActive(false);
      }
    } catch (err) {
      console.error('Failed to generate TV code', err);
    }
  };

  useEffect(() => {
    generateNewTvCode();
  }, []);

  // Poll for TV authorization
  useEffect(() => {
    if (!generatedPairingCode || isTvActive) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.pollDeviceCode(generatedPairingCode);
        if (res.success && res.status === 'authorized') {
          setIsTvActive(true);
          clearInterval(interval);
        }
      } catch (err) {
        // ignore polling errors
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [generatedPairingCode, isTvActive]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await api.verifyDeviceCode(user?.id || 'usr-default-tubi-fan', activationCode.trim());
      if (res.success) {
        setStatusMessage({ text: res.message, type: 'success' });
        setActivationCode('');
        if (onActivationSuccess) onActivationSuccess();
      } else {
        setStatusMessage({ text: res.message, type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Verification failed', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 24px',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 42, 109, 0.15)',
            border: '1px solid rgba(255, 42, 109, 0.3)',
            color: 'var(--accent-pink)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}
        >
          <Tv size={16} /> {siteName.toUpperCase()} DEVICE LINKING PORTAL
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>
          Activate Your Smart TV on {siteName}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          Connect your Apple TV, Samsung Smart TV, Roku, or Amazon Fire TV in seconds without typing passwords on your remote.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '32px',
          width: '100%',
          maxWidth: '1000px'
        }}
      >
        {/* Left Card: Web/Mobile Code Entry */}
        <div
          className="glass-panel"
          style={{
            padding: '36px',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Smartphone size={24} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Enter Activation Code</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px' }}>
              Look at the 6-character activation code displayed on your television screen and enter it below:
            </p>

            <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="e.g. TB79K2"
                value={activationCode}
                maxLength={6}
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  letterSpacing: '0.25em',
                  outline: 'none',
                  textTransform: 'uppercase'
                }}
              />

              {statusMessage && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background:
                      statusMessage.type === 'success'
                        ? 'rgba(0, 240, 118, 0.15)'
                        : 'rgba(255, 42, 109, 0.15)',
                    color: statusMessage.type === 'success' ? '#00f076' : '#ff2a6d',
                    border: `1px solid ${statusMessage.type === 'success' ? 'rgba(0, 240, 118, 0.3)' : 'rgba(255, 42, 109, 0.3)'}`
                  }}
                >
                  {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {statusMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || activationCode.length < 4}
                className="btn-primary"
                style={{
                  padding: '16px',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  justifyContent: 'center',
                  opacity: activationCode.length < 4 ? 0.6 : 1
                }}
              >
                {isSubmitting ? 'Linking Device...' : 'Activate Device'} <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Logged in as: <strong style={{ color: '#fff' }}>{user?.email || 'viewer@tubistream.com'}</strong>
          </div>
        </div>

        {/* Right Card: Smart TV Simulation Screen */}
        <div
          className="glass-panel"
          style={{
            padding: '36px',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #101320 0%, #171b2d 100%)',
            border: '2px solid rgba(0, 240, 118, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <Tv size={20} color="var(--accent-green)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-green)', letterSpacing: '0.1em' }}>
                TELEVISION DISPLAY SIMULATION
              </span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>
              Pair Your TV Screen
            </h3>

            {isTvActive ? (
              <div
                className="animate-fade-in"
                style={{
                  padding: '30px 20px',
                  background: 'rgba(0, 240, 118, 0.1)',
                  borderRadius: '16px',
                  border: '1px solid #00f076',
                  margin: '20px 0'
                }}
              >
                <CheckCircle size={48} color="#00f076" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00f076', marginBottom: '6px' }}>
                  Smart TV Linked & Ready!
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Your account was successfully paired. Enjoy unlimited streaming.
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Go to <code style={{ color: 'var(--accent-pink)' }}>{siteName.toLowerCase().replace(/\s+/g, '')}.com/activate</code> on your phone/laptop and enter:
                </p>

                {/* Big 6-Digit Alphanumeric Code Display */}
                <div
                  style={{
                    fontSize: '2.8rem',
                    fontWeight: 900,
                    letterSpacing: '0.2em',
                    color: '#fff',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '2px solid rgba(255, 42, 109, 0.6)',
                    textShadow: '0 0 20px rgba(255, 42, 109, 0.7)',
                    marginBottom: '16px',
                    userSelect: 'all'
                  }}
                >
                  {generatedPairingCode || 'TB79X2'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <RefreshCw size={14} className="animate-spin" />
                  Listening for activation confirmation...
                </div>
              </div>
            )}
          </div>

          <button
            onClick={generateNewTvCode}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 16px', marginTop: '16px' }}
          >
            Generate New TV Code
          </button>
        </div>
      </div>
    </div>
  );
};
