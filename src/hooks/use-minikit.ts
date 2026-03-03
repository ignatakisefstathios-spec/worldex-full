import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/app-store';
import { MiniKit } from '@worldcoin/minikit-js';

export function useMiniKit() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const { 
    setAuthenticated, 
    setWalletAddress, 
    setWorldIDVerified,
    setUser 
  } = useAppStore();

  // Check MiniKit availability safely
  useEffect(() => {
    const checkMiniKit = () => {
      try {
        if (MiniKit && typeof MiniKit.isInstalled === 'function') {
          const installed = MiniKit.isInstalled();
          setIsInstalled(installed);
          setIsReady(true);
        } else {
          // MiniKit not ready yet, try again in 500ms
          setTimeout(checkMiniKit, 500);
        }
      } catch (err) {
        console.log('MiniKit not ready yet');
        setTimeout(checkMiniKit, 500);
      }
    };

    // Wait a bit for MiniKit to initialize
    setTimeout(checkMiniKit, 1000);
  }, []);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!MiniKit || !MiniKit.isInstalled()) {
        throw new Error('Please open in World App');
      }

      const result = await MiniKit.commandsAsync.walletAuth({
        statement: 'Sign in to Worldex Protocol',
        nonce: Math.random().toString(36).substring(2),
      });

      if (result.status === 'success') {
        setAuthenticated(true);
        setWalletAddress(result.address);
        setUser({
          id: result.address,
          walletAddress: result.address,
          worldId: null,
          verified: false,
          createdAt: new Date().toISOString(),
        });
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Connection failed');
      console.error('Connection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setAuthenticated, setWalletAddress, setUser]);

  // THIS IS THE IMPORTANT PART - Verify World ID for airdrop
  const verifyWorldID = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!MiniKit || !MiniKit.isInstalled()) {
        throw new Error('Please open in World App');
      }

      // This matches your action in the Dev Portal
      const result = await MiniKit.commandsAsync.verify({
        action: 'verify-worldex-user',
        signal: useAppStore.getState().walletAddress || '',
      });

      if (result.status === 'success') {
        setWorldIDVerified(true);
        return true;
      } else {
        throw new Error('Verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      console.error('World ID verification error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setWorldIDVerified]);

  return {
    isInstalled,
    isLoading,
    isReady,
    error,
    connect,
    verifyWorldID, // NOW EXPORTED
  };
}

// Hook for checking if running in World App
export function useIsWorldApp() {
  const [isWorldApp, setIsWorldApp] = useState(false);

  useEffect(() => {
    const check = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      setIsWorldApp(
        MiniKit?.isInstalled() || 
        userAgent.includes('worldapp') || 
        userAgent.includes('world app')
      );
    };

    check();
  }, []);

  return isWorldApp;
}

// Hook for MiniKit commands
export function useMiniKitCommands() {
  const getMiniKit = useCallback(() => {
    return MiniKit;
  }, []);

  const openUrl = useCallback((url: string) => {
    const miniKit = getMiniKit();
    if (miniKit?.commands?.openUrl) {
      miniKit.commands.openUrl({ url });
    } else {
      window.open(url, '_blank');
    }
  }, [getMiniKit]);

  const shareText = useCallback((text: string) => {
    const miniKit = getMiniKit();
    if (miniKit?.commands?.shareText) {
      miniKit.commands.shareText({ text });
    } else if (navigator.share) {
      navigator.share({ text });
    }
  }, [getMiniKit]);

  const vibrate = useCallback((pattern: number | number[] = 50) => {
    const miniKit = getMiniKit();
    if (miniKit?.commands?.hapticFeedback) {
      miniKit.commands.hapticFeedback({ type: 'impact' });
    } else if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [getMiniKit]);

  return {
    openUrl,
    shareText,
    vibrate,
    getMiniKit,
  };
}
