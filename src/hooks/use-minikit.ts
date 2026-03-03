import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/app-store';
// Πρόσθεσε αυτό το import
import { MiniKit } from '@worldcoin/minikit-js';

interface MiniKitUser {
  walletAddress: string;
  username?: string;
  profilePictureUrl?: string;
}

// ... rest of the interfaces remain the same ...

export function useMiniKit() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    setAuthenticated, 
    setWalletAddress, 
    setWorldIDVerified,
    setUser 
  } = useAppStore();

  // Check if MiniKit is available - χρησιμοποίησε το import αντί για window
  useEffect(() => {
    const checkMiniKit = () => {
      // Άλλαξε από (window as any).MiniKit σε MiniKit
      if (MiniKit && MiniKit.isInstalled()) {
        setIsInstalled(true);
      }
    };

    checkMiniKit();
  }, []);

  const handleAuthSuccess = useCallback((user: MiniKitUser) => {
    setAuthenticated(true);
    setWalletAddress(user.walletAddress);
    setUser({
      id: user.walletAddress,
      walletAddress: user.walletAddress,
      worldId: null,
      verified: false,
      createdAt: new Date().toISOString(),
    });
  }, [setAuthenticated, setWalletAddress, setUser]);

  // Connect wallet - χρησιμοποίησε το import
  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Άλλαξε από (window as any).MiniKit σε MiniKit
      if (!MiniKit) {
        throw new Error('MiniKit not initialized');
      }

      if (!MiniKit.isInstalled()) {
        throw new Error('MiniKit not installed. Please open in World App.');
      }

      // Request wallet connection - χρησιμοποίησε το σωστό API
      const result = await MiniKit.commandsAsync.walletAuth({
        statement: 'Sign in to Worldex Protocol',
        nonce: Math.random().toString(36).substring(2),
      });

      if (result.status === 'success') {
        handleAuthSuccess({
          walletAddress: result.address,
        });
      } else {
        throw new Error(result.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
      console.error('MiniKit connection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthSuccess]);

  // ... υπόλοιπος κώδικας παραμένει ίδιος, αλλά άλλαξε όλα τα (window as any).MiniKit σε MiniKit ...

  const verifyWorldID = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!MiniKit) {
        throw new Error('MiniKit not initialized');
      }

      if (!MiniKit.isInstalled()) {
        throw new Error('MiniKit not installed');
      }

      const verifyPayload = {
        action: 'verify-worldex-user',
        signal: useAppStore.getState().walletAddress || '',
      };

      const result = await MiniKit.commandsAsync.verify(verifyPayload);

      if (result.status === 'success') {
        // ... υπόλοιπος κώδικας ...
        setWorldIDVerified(true);
        return true;
      } else {
        throw new Error(result.error || 'Verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      console.error('World ID verification error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setWorldIDVerified]);

  // Ενημέρωσε και τα άλλα functions (signMessage, sendTransaction) με τον ίδιο τρόπο
  const signMessage = useCallback(async (message: string) => {
    try {
      if (!MiniKit) {
        throw new Error('MiniKit not initialized');
      }
      // ... υπόλοιπος κώδικας ...
    } catch (err: any) {
      console.error('Sign message error:', err);
      throw err;
    }
  }, []);

  const sendTransaction = useCallback(async ({
    to,
    value,
    data,
  }: {
    to: string;
    value?: string;
    data?: string;
  }) => {
    try {
      if (!MiniKit) {
        throw new Error('MiniKit not initialized');
      }
      // ... υπόλοιπος κώδικας ...
    } catch (err: any) {
      console.error('Send transaction error:', err);
      throw err;
    }
  }, []);

  const disconnect = useCallback(() => {
    setAuthenticated(false);
    setWalletAddress(null);
    setWorldIDVerified(false);
    setUser(null);
  }, [setAuthenticated, setWalletAddress, setWorldIDVerified, setUser]);

  return {
    isInstalled,
    isLoading,
    error,
    connect,
    disconnect,
    verifyWorldID,
    signMessage,
    sendTransaction,
  };
}

// Ενημέρωσε και αυτό το hook
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

// ... υπόλοιπος κώδικας παραμένει ίδιος ...
