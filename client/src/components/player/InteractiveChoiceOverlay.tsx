import React, { useState, useEffect } from 'react';
import { Sparkles, Compass } from 'lucide-react';

interface InteractiveChoiceOverlayProps {
  onChoiceMade: (choice: string) => void;
}

export const InteractiveChoiceOverlay: React.FC<InteractiveChoiceOverlayProps> = ({ onChoiceMade }) => {
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onChoiceMade('Option A: Stealth Infiltration');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="glass-heavy animate-fade-in"
      style={{
        position: 'absolute',
        bottom: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '680px',
        padding: '24px 32px',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.95)',
        border: '2px solid var(--accent-pink)',
        pointerEvents: 'auto',
        zIndex: 70,
        textAlign: 'center',
        background: 'rgba(9, 10, 15, 0.94)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
        <Compass size={20} color="var(--accent-pink)" />
        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-pink)', letterSpacing: '0.1em' }}>
          INTERACTIVE STORY BRANCHING • DECIDE THE OUTCOME ({secondsLeft}s)
        </span>
      </div>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>
        A patrol drone approaches! What should Sintel do next?
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <button
          onClick={() => onChoiceMade('Option A: Stealth Infiltration')}
          style={{
            padding: '16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(255, 42, 109, 0.2) 0%, rgba(255, 110, 0, 0.2) 100%)',
            border: '2px solid var(--accent-pink)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ⚔️ Option A: Stealth Attack
        </button>

        <button
          onClick={() => onChoiceMade('Option B: Hack AI Mainframe')}
          style={{
            padding: '16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(5, 217, 232, 0.2) 0%, rgba(157, 78, 221, 0.2) 100%)',
            border: '2px solid var(--accent-cyan)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          💻 Option B: Hack Mainframe
        </button>
      </div>
    </div>
  );
};
