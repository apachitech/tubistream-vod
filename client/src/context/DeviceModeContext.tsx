import React, { createContext, useContext, useState, useEffect } from 'react';

export type DeviceMode = 'web' | 'mobile' | 'tv';

interface DeviceModeContextType {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  isVirtualRemoteOpen: boolean;
  setIsVirtualRemoteOpen: (open: boolean) => void;
  toggleVirtualRemote: () => void;
}

const DeviceModeContext = createContext<DeviceModeContextType | undefined>(undefined);

export const DeviceModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('web');
  const [isVirtualRemoteOpen, setIsVirtualRemoteOpen] = useState<boolean>(false);

  useEffect(() => {
    if (deviceMode === 'tv') {
      document.body.classList.add('tv-mode-active');
      setIsVirtualRemoteOpen(true);
    } else {
      document.body.classList.remove('tv-mode-active');
    }
  }, [deviceMode]);

  const toggleVirtualRemote = () => {
    setIsVirtualRemoteOpen((prev) => !prev);
  };

  return (
    <DeviceModeContext.Provider
      value={{
        deviceMode,
        setDeviceMode,
        isVirtualRemoteOpen,
        setIsVirtualRemoteOpen,
        toggleVirtualRemote
      }}
    >
      {children}
    </DeviceModeContext.Provider>
  );
};

export const useDeviceMode = () => {
  const context = useContext(DeviceModeContext);
  if (!context) {
    throw new Error('useDeviceMode must be used within a DeviceModeProvider');
  }
  return context;
};
