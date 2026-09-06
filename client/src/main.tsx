import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { DeviceModeProvider } from './context/DeviceModeContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SiteSettingsProvider>
        <AuthProvider>
          <PlayerProvider>
            <DeviceModeProvider>
              <App />
            </DeviceModeProvider>
          </PlayerProvider>
        </AuthProvider>
      </SiteSettingsProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

