import { X, Wallet, Globe, Shield } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { useMiniKit } from '../hooks/use-minikit';
import { cn } from '../lib/utils';

export function ConnectModal() {
  const { showConnectModal, setShowConnectModal } = useAppStore();
  const { connect, verifyWorldID, isLoading, isInstalled } = useMiniKit();

  if (!showConnectModal) return null;

  const handleConnect = async () => {
    await connect();
    setShowConnectModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowConnectModal(false)}
      />
      
      <div className="relative bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md p-6 animate-in">
        <button
          onClick={() => setShowConnectModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-worldcoin-blue to-worldcoin-purple flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Connect Wallet</h2>
          <p className="text-gray-400 text-sm">
            Connect your wallet to access Worldex Protocol
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-xl border transition-all',
              isInstalled
                ? 'border-worldcoin-blue/50 bg-worldcoin-blue/10 hover:bg-worldcoin-blue/20'
                : 'border-dark-600 bg-dark-700/50 opacity-50 cursor-not-allowed'
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center">
              <Globe className="w-6 h-6 text-worldcoin-blue" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-white">World App</p>
              <p className="text-sm text-gray-400">
                {isInstalled ? 'Recommended' : 'Open in World App'}
              </p>
            </div>
            {isLoading && (
              <div className="w-5 h-5 border-2 border-worldcoin-blue border-t-transparent rounded-full animate-spin" />
            )}
          </button>

          <button
            disabled
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-dark-600 bg-dark-700/50 opacity-50 cursor-not-allowed"
          >
            <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center">
              <Shield className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-400">MetaMask</p>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </button>

          <button
            disabled
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-dark-600 bg-dark-700/50 opacity-50 cursor-not-allowed"
          >
            <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-400">WalletConnect</p>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By connecting, you agree to Worldex Protocol's Terms of Service
        </p>
      </div>
    </div>
  );
}
