import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { DeviceModeProvider } from './context/DeviceModeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <PlayerProvider>
          <DeviceModeProvider>
            <App />
          </DeviceModeProvider>
        </PlayerProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
