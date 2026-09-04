import React, { useEffect, useState } from 'react';
import { AdCreative } from '../../types';
import { api } from '../../services/api';
import { ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';

interface AdBreakOverlayProps {
  ad: AdCreative;
  onAdComplete: () => void;
  titleId?: string;
  userId?: string;
}

export const AdBreakOverlay: React.FC<AdBreakOverlayProps> = ({
  ad,
  onAdComplete,
  titleId,
  userId
}) => {
  const [secondsLeft, setSecondsLeft] = useState(ad.durationSeconds);
  const [reportedQuartiles, setReportedQuartiles] = useState<{ [q: string]: boolean }>({});

  useEffect(() => {
    // Fire Impression and Start beacons
    api.trackAd('impression', ad.id, titleId, userId);
    api.trackAd('start', ad.id, titleId, userId);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        const elapsed = ad.durationSeconds - next;
        const progress = elapsed / ad.durationSeconds;

        if (progress >= 0.25 && !reportedQuartiles['25']) {
          api.trackAd('firstQuartile', ad.id, titleId, userId);
          setReportedQuartiles((r) => ({ ...r, '25': true }));
        }
        if (progress >= 0.50 && !reportedQuartiles['50']) {
          api.trackAd('midpoint', ad.id, titleId, userId);
          setReportedQuartiles((r) => ({ ...r, '50': true }));
        }
        if (progress >= 0.75 && !reportedQuartiles['75']) {
          api.trackAd('thirdQuartile', ad.id, titleId, userId);
          setReportedQuartiles((r) => ({ ...r, '75': true }));
        }

        if (next <= 0) {
          clearInterval(timer);
          api.trackAd('complete', ad.id, titleId, userId);
          onAdComplete();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ad]);

  const handleLearnMore = () => {
    api.trackAd('click', ad.id, titleId, userId);
    window.open(ad.clickThroughUrl, '_blank');
  };

  const progressPercent = Math.round(((ad.durationSeconds - secondsLeft) / ad.durationSeconds) * 100);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '32px'
      }}
    >
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          className="glass-heavy"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}
        >
          <span
            style={{
              background: '#ffb703',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.72rem',
              padding: '2px 6px',
              borderRadius: '3px'
            }}
          >
            AD BREAK
          </span>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
            Ad 1 of 1 • 0:{secondsLeft.toString().padStart(2, '0')}
          </span>
        </div>

        <div
          className="glass-heavy"
          style={{
            pointerEvents: 'auto',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)'
          }}
        >
          Free with Ads • Upgrade to <span style={{ color: '#ffd700', fontWeight: 700 }}>VIP</span> for Ad-Free
        </div>
      </div>

      {/* Bottom Ad Info & Learn More CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          pointerEvents: 'auto'
        }}
      >
        <div className="glass-heavy" style={{ padding: '12px 20px', borderRadius: '12px', maxWidth: '400px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffb703', textTransform: 'uppercase' }}>
            Sponsored by {ad.advertiserName}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
            {ad.title}
          </div>
        </div>

        <button
          onClick={handleLearnMore}
          className="btn-primary"
          style={{
            padding: '12px 24px',
            fontSize: '0.95rem',
            background: 'linear-gradient(135deg, #ffb703 0%, #ff6e00 100%)',
            color: '#000',
            fontWeight: 800
          }}
        >
          Visit {ad.advertiserName} <ExternalLink size={16} />
        </button>
      </div>

      {/* Ad Progress Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '5px',
          background: 'rgba(255,255,255,0.2)'
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: '#ffb703',
            transition: 'width 1s linear'
          }}
        />
      </div>
    </div>
  );
};
