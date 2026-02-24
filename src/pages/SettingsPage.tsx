import { useState } from 'react';
import { Settings, Bell, Shield, Globe, Moon, User, ChevronRight, ExternalLink } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { useMiniKit } from '../hooks/use-minikit';
import { formatAddress } from '../lib/utils';
import { addToast } from '../components/ToastContainer';

export function SettingsPage() {
  const { isAuthenticated, walletAddress, isWorldIDVerified, reset } = useAppStore();
  const { disconnect } = useMiniKit();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleDisconnect = () => {
    disconnect();
    addToast({
      type: 'success',
      title: 'Disconnected',
      message: 'Wallet disconnected successfully',
    });
  };

  const handleClearData = () => {
    reset();
    addToast({
      type: 'success',
      title: 'Data Cleared',
      message: 'All local data has been cleared',
    });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Account Section */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
        <div className="p-4 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-worldcoin-blue" />
            Account
          </h2>
        </div>
        
        {isAuthenticated ? (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
              <div>
                <p className="text-sm text-gray-400">Wallet Address</p>
                <p className="text-white font-mono">{formatAddress(walletAddress || '')}</p>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
              >
                Disconnect
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isWorldIDVerified ? 'bg-green-500/20' : 'bg-yellow-500/20'
                }`}>
                  <Shield className={`w-5 h-5 ${
                    isWorldIDVerified ? 'text-green-400' : 'text-yellow-400'
                  }`} />
                </div>
                <div>
                  <p className="text-white">World ID</p>
                  <p className="text-sm text-gray-400">
                    {isWorldIDVerified ? 'Verified' : 'Not verified'}
                  </p>
                </div>
              </div>
              {!isWorldIDVerified && (
                <button className="btn-primary px-4 py-2 text-sm">
                  Verify
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to manage account settings</p>
            <button className="btn-primary">Connect Wallet</button>
          </div>
        )}
      </div>

      {/* Preferences Section */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
        <div className="p-4 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-worldcoin-blue" />
            Preferences
          </h2>
        </div>
        
        <div className="divide-y divide-dark-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="text-white">Notifications</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications ? 'bg-worldcoin-blue' : 'bg-dark-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                notifications ? 'left-6' : 'left-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-gray-400" />
              <span className="text-white">Dark Mode</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                darkMode ? 'bg-worldcoin-blue' : 'bg-dark-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                darkMode ? 'left-6' : 'left-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <span className="text-white">Language</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span>English</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
        <div className="p-4 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white">Links</h2>
        </div>
        
        <div className="divide-y divide-dark-700">
          <a 
            href="https://docs.worldex.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors"
          >
            <span className="text-white">Documentation</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
          
          <a 
            href="https://github.com/worldex-protocol" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors"
          >
            <span className="text-white">GitHub</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
          
          <a 
            href="https://discord.gg/worldex" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors"
          >
            <span className="text-white">Discord</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
          
          <a 
            href="https://twitter.com/worldexprotocol" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors"
          >
            <span className="text-white">Twitter</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-red-500/30">
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Clear Local Data</p>
              <p className="text-sm text-gray-400">Remove all cached data from this device</p>
            </div>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
            >
              Clear Data
            </button>
          </div>
        </div>
      </div>

      {/* Version */}
      <div className="text-center text-sm text-gray-500">
        <p>Worldex Protocol v1.0.0</p>
        <p className="mt-1">Built on World Chain</p>
      </div>
    </div>
  );
}
