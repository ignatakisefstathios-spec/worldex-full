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

  return {
    isInstalled,
    isLoading,
    isReady,
    error,
    connect,
  };
}
