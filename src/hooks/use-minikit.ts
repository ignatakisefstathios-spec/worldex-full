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
          setTimeout(checkMiniKit, 500);
        }
      } catch (err) {
        console.log('MiniKit not ready yet');
        setTimeout(checkMiniKit, 500);
      }
    };

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

  // THIS WAS MISSING - Verify World ID for airdrop
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
