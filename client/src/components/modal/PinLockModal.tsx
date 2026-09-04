import React, { useState } from 'react';
import { Lock, ShieldAlert, X, Check, Delete } from 'lucide-react';

interface PinLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  titleName?: string;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({ isOpen, onClose, onSuccess, titleName }) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMsg('');
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const verifyPin = (enteredPin: string) => {
    // Default master PIN is 1234
    if (enteredPin === '1234' || enteredPin === '0000') {
      onSuccess();
      onClose();
      setPin('');
    } else {
      setErrorMsg('Incorrect PIN code. Default is 1234');
      setPin('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 2800,
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
          maxWidth: '420px',
          borderRadius: '24px',
          padding: '36px 28px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
          border: '2px solid rgba(255, 42, 109, 0.4)',
          textAlign: 'center'
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>

        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255, 42, 109, 0.15)',
            border: '1px solid rgba(255, 42, 109, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}
        >
          <Lock size={26} color="var(--accent-pink)" />
        </div>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
          Parental Controls PIN
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
          {titleName
            ? `"${titleName}" is rated TV-MA / R. Enter 4-digit PIN to watch.`
            : 'Enter master PIN to switch profile or access restricted settings.'}
        </p>

        {/* 4-Digit Display Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              style={{
                width: '48px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: pin.length > idx ? '2px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#fff'
              }}
            >
              {pin.length > idx ? '•' : ''}
            </div>
          ))}
        </div>

        {errorMsg && (
          <div style={{ color: '#ff2a6d', fontSize: '0.84rem', fontWeight: 700, marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '280px', margin: '0 auto' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '1.25rem',
                fontWeight: 800
              }}
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress('0')}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.06)',
              color: '#fff',
              fontSize: '1.25rem',
              fontWeight: 800
            }}
          >
            0
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Delete size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
