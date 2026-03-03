import { useState, useEffect } from 'react';
import { Gift, Clock, Lock, TrendingUp, Users, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { useMiniKit } from '../hooks/use-minikit';
import { formatNumber } from '../lib/utils';
import { addToast } from '../components/ToastContainer';
import { 
  WDX_TOTAL_SUPPLY, 
  TEAM_AIRDROP, 
  USER_AIRDROP, 
  TOKEN_DISTRIBUTION,
  TEAM_WALLET 
} from '../lib/airdrop-config';

export function AirdropPage() {
  const { 
    isAuthenticated, 
    walletAddress, 
    airdropClaimed, 
    setAirdropClaimed,
    isWorldIDVerified,
    setWorldIDVerified 
  } = useAppStore();
  
  const { isInstalled, verifyWorldID } = useMiniKit();
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'user'>('overview');
  const [isClaiming, setIsClaiming] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if current wallet is team wallet
  const isTeamWallet = walletAddress?.toLowerCase() === TEAM_WALLET.toLowerCase();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle World ID Verification
  const handleVerify = async () => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet first',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const success = await verifyWorldID();
      if (success) {
        setWorldIDVerified(true);
        addToast({
          type: 'success',
          title: 'Verified!',
          message: 'World ID verification successful',
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Verification Failed',
        message: 'Please try again',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Team Claim (for your wallet only!)
  const handleTeamClaim = async () => {
    if (!isTeamWallet) {
      addToast({
        type: 'error',
        title: 'Not Authorized',
        message: 'This is not the team wallet',
      });
      return;
    }

    if (!isWorldIDVerified) {
      addToast({
        type: 'warning',
        title: 'Verification Required',
        message: 'Please verify your World ID first',
      });
      return;
    }

    setIsClaiming(true);
    
    // Simulate claim process (replace with actual contract call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAirdropClaimed(true);
    setIsClaiming(false);
    
    addToast({
      type: 'success',
      title: 'Team Allocation Claimed!',
      message: `15M WDX instant + 15M WDX vested over 4 years`,
    });
  };

  // Handle User Claim
  const handleUserClaim = async () => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet to claim',
      });
      return;
    }

    if (!isWorldIDVerified) {
      addToast({
        type: 'warning',
        title: 'Verification Required',
        message: 'Please verify your World ID first',
      });
      return;
    }

    setIsClaiming(true);
    
    // Simulate claim process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAirdropClaimed(true);
    setIsClaiming(false);
    
    addToast({
      type: 'success',
      title: 'Airdrop Claimed!',
      message: 'Your WDX has been vested and staked',
    });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-worldcoin-blue to-worldcoin-purple flex items-center justify-center mx-auto mb-4">
          <Gift className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">WDX Airdrop</h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          {isTeamWallet 
            ? 'Welcome Team! Claim your 30M WDX allocation.' 
            : 'Claim your vested WDX tokens with real-time staking rewards.'}
        </p>
      </div>

      {/* World ID Verification Banner */}
      {isAuthenticated && !isWorldIDVerified && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="font-medium text-white">World ID Verification Required</h3>
                <p className="text-sm text-gray-400">Verify you are a unique human to claim airdrop</p>
              </div>
            </div>
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="btn-primary px-6 py-2"
            >
              {isVerifying ? 'Verifying...' : 'Verify Now'}
            </button>
          </div>
        </div>
      )}

      {/* Team Wallet Banner */}
      {isTeamWallet && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-medium text-white">Team Wallet Detected</h3>
          </div>
          <p className="text-gray-400 mb-4">
            You have access to the team allocation: 30M WDX (15M instant + 15M vested)
          </p>
          {!airdropClaimed ? (
            <button
              onClick={handleTeamClaim}
              disabled={isClaiming || !isWorldIDVerified}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50"
            >
              {isClaiming ? 'Claiming...' : 'Claim Team Allocation'}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Team allocation claimed!</span>
            </div>
          )}
        </div>
      )}

      {/* User Claim Section */}
      {!isTeamWallet && isAuthenticated && (
        <div className="bg-gradient-to-br from-worldcoin-blue/20 to-worldcoin-purple/20 rounded-2xl p-6 border border-worldcoin-blue/30">
          <h2 className="text-lg font-semibold text-white mb-4">Community Airdrop</h2>
          
          {isWorldIDVerified ? (
            !airdropClaimed ? (
              <button
                onClick={handleUserClaim}
                disabled={isClaiming}
                className="w-full btn-primary py-3 text-lg"
              >
                {isClaiming ? 'Claiming...' : 'Claim Airdrop'}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Airdrop claimed successfully!</span>
              </div>
            )
          ) : (
            <p className="text-gray-400">Complete World ID verification to claim</p>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-dark-800 rounded-xl p-1 border border-dark-700">
          {(['overview', 'team', 'user'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-worldcoin-blue text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content - Overview, Team, User */}
      {activeTab === 'overview' && (
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <h2 className="text-lg font-semibold text-white mb-6">Token Distribution</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOKEN_DISTRIBUTION.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-dark-900 rounded-xl">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">{item.category}</p>
                  <p className="text-white font-medium">
                    {formatNumber(item.amount)} WDX ({item.percentage}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <h2 className="text-lg font-semibold text-white mb-4">Team Allocation</h2>
          <div className="space-y-4">
            <div className="p-4 bg-dark-900 rounded-xl">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-bold text-white">{formatNumber(TEAM_AIRDROP.TOTAL)} WDX</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-dark-900 rounded-xl">
                <p className="text-sm text-gray-400">Instant (50%)</p>
                <p className="text-xl font-bold text-green-400">{formatNumber(TEAM_AIRDROP.INSTANT_DROP)} WDX</p>
              </div>
              <div className="p-4 bg-dark-900 rounded-xl">
                <p className="text-sm text-gray-400">Vested (50%)</p>
                <p className="text-xl font-bold text-yellow-400">{formatNumber(TEAM_AIRDROP.VESTED)} WDX</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'user' && (
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <h2 className="text-lg font-semibold text-white mb-4">Community Allocation</h2>
          <div className="p-4 bg-dark-900 rounded-xl">
            <p className="text-sm text-gray-400">Total for Users</p>
            <p className="text-2xl font-bold text-white">{formatNumber(USER_AIRDROP.TOTAL)} WDX</p>
            <p className="text-sm text-gray-500 mt-2">Vested over 12 months with real-time rewards</p>
          </div>
        </div>
      )}
    </div>
  );
}
