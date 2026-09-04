import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in TubiStream UI:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#090a0f',
            color: '#fff',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <div
            className="glass-heavy"
            style={{
              maxWidth: '520px',
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 42, 109, 0.4)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 42, 109, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}
            >
              <AlertTriangle size={32} color="#ff2a6d" />
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>
              Something Went Wrong
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              TubiStream encountered an unexpected issue while rendering. Click below to recover the cinema player.
            </p>

            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="btn-primary"
              style={{ padding: '12px 28px', fontWeight: 800, margin: '0 auto' }}
            >
              <RefreshCw size={18} /> Reload Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
