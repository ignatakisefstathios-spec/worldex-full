import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/app-store';

interface MiniKitUser {
  walletAddress: string;
  username?: string;
  profilePictureUrl?: string;
}

interface VerifyPayload {
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  verification_level: string;
}

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

  // Check if MiniKit is available
  useEffect(() => {
    const checkMiniKit = () => {
      const miniKit = (window as any).MiniKit;
      if (miniKit) {
        setIsInstalled(true);
        
        // Auto-connect if already authenticated
        if (miniKit.isInstalled && miniKit.walletAddress) {
          handleAuthSuccess({
            walletAddress: miniKit.walletAddress,
          });
        }
      }
    };

    checkMiniKit();
    
    // Listen for MiniKit installation
    window.addEventListener('MiniKitInstalled', checkMiniKit);
    return () => window.removeEventListener('MiniKitInstalled', checkMiniKit);
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

  // Connect wallet
  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const miniKit = (window as any).MiniKit;
      
      if (!miniKit) {
        throw new Error('MiniKit not installed. Please open in World App.');
      }

      // Request wallet connection
      const result = await miniKit.commandsAsync.walletAuth({
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

  // Verify with World ID
  const verifyWorldID = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const miniKit = (window as any).MiniKit;
      
      if (!miniKit) {
        throw new Error('MiniKit not installed');
      }

      const verifyPayload: { action: string; signal?: string } = {
        action: 'verify-worldex-user',
        signal: useAppStore.getState().walletAddress || '',
      };

      const result = await miniKit.commandsAsync.verify(verifyPayload);

      if (result.status === 'success') {
        const { proof, merkle_root, nullifier_hash, verification_level } = result as VerifyPayload;
        
        // Verify proof on backend
        const verifyRes = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proof,
            merkle_root,
            nullifier_hash,
            verification_level,
            action: verifyPayload.action,
            signal: verifyPayload.signal,
          }),
        });

        if (verifyRes.ok) {
          setWorldIDVerified(true);
          return true;
        } else {
          throw new Error('Verification failed on server');
        }
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

  // Sign message
  const signMessage = useCallback(async (message: string) => {
    try {
      const miniKit = (window as any).MiniKit;
      
      if (!miniKit) {
        throw new Error('MiniKit not installed');
      }

      const result = await miniKit.commandsAsync.signMessage({
        message,
      });

      if (result.status === 'success') {
        return result.signature;
      } else {
        throw new Error(result.error || 'Signing failed');
      }
    } catch (err: any) {
      console.error('Sign message error:', err);
      throw err;
    }
  }, []);

  // Send transaction
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
      const miniKit = (window as any).MiniKit;
      
      if (!miniKit) {
        throw new Error('MiniKit not installed');
      }

      const result = await miniKit.commandsAsync.sendTransaction({
        to,
        value: value || '0',
        data: data || '0x',
      });

      if (result.status === 'success') {
        return result.transaction_hash;
      } else {
        throw new Error(result.error || 'Transaction failed');
      }
    } catch (err: any) {
      console.error('Send transaction error:', err);
      throw err;
    }
  }, []);

  // Disconnect
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

// Hook for checking if running in World App
export function useIsWorldApp() {
  const [isWorldApp, setIsWorldApp] = useState(false);

  useEffect(() => {
    const check = () => {
      const miniKit = (window as any).MiniKit;
      const userAgent = navigator.userAgent.toLowerCase();
      setIsWorldApp(
        !!miniKit || 
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
    return (window as any).MiniKit;
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
