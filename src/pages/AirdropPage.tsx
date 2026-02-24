import { useState, useEffect } from 'react';
import { Gift, Clock, Lock, TrendingUp, Users, Shield, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { useMiniKit } from '../hooks/use-minikit';
import { formatNumber, formatCurrency, formatPercent } from '../lib/utils';
import { addToast } from '../components/ToastContainer';
import { 
  WDX_TOTAL_SUPPLY, 
  TEAM_AIRDROP, 
  USER_AIRDROP, 
  TOKEN_DISTRIBUTION,
  calculateVestedAmount,
  calculateRealtimeRewards 
} from '../lib/airdrop-config';

// Research-based airdrop strategies
const AIRDROP_RESEARCH = {
  arbitrum: {
    name: 'Arbitrum',
    totalDistributed: '1.16B ARB',
    strategy: 'Points-based with multipliers for early users',
    result: 'Successful - price held above $1 for 6+ months',
  },
  optimism: {
    name: 'Optimism',
    totalDistributed: '214M OP',
    strategy: 'Retroactive + ongoing incentives',
    result: 'Strong ecosystem growth, OP price stable',
  },
  eigenlayer: {
    name: 'EigenLayer',
    totalDistributed: '86M EIGEN',
    strategy: 'Seasonal drops with vesting',
    result: 'High retention, strong restaking adoption',
  },
  ethena: {
    name: 'Ethena',
    totalDistributed: '750M ENA',
    strategy: 'Shards system with lockups',
    result: 'Massive TVL growth, ENA price appreciation',
  },
};

export function AirdropPage() {
  const { isAuthenticated, walletAddress, airdropClaimed, setAirdropClaimed } = useAppStore();
  const { isInstalled } = useMiniKit();
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'user'>('overview');
  const [isClaiming, setIsClaiming] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Simulated user airdrop data
  const userAirdropData = {
    eligible: true,
    totalAllocation: 2500,
    claimed: airdropClaimed,
    vestedAmount: airdropClaimed ? 208.33 : 0, // After 1 month
    claimableAmount: airdropClaimed ? 0 : 0, // 0% immediate
    realtimeRewards: airdropClaimed ? 31.25 : 0, // 15% APY on vested
    vestingStart: Date.now(),
    vestingEnd: Date.now() + 365 * 24 * 60 * 60 * 1000,
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClaim = async () => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet to claim airdrop',
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
      message: 'Your WDX has been vested and staked for real-time rewards',
    });
  };

  const getVestingProgress = () => {
    if (!airdropClaimed) return 0;
    const elapsed = Date.now() - userAirdropData.vestingStart;
    const total = userAirdropData.vestingEnd - userAirdropData.vestingStart;
    return Math.min((elapsed / total) * 100, 100);
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
          Claim your vested WDX tokens with real-time staking rewards. 
          Designed for long-term protocol growth.
        </p>
      </div>

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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Token Distribution */}
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
            <div className="mt-6 p-4 bg-dark-900 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Supply</span>
                <span className="text-white font-bold">{formatNumber(WDX_TOTAL_SUPPLY)} WDX</span>
              </div>
            </div>
          </div>

          {/* Research Insights */}
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Research-Based Design</h2>
            <p className="text-gray-400 text-sm mb-6">
              Our airdrop strategy is inspired by the most successful distributions in DeFi history.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.values(AIRDROP_RESEARCH).map((project, index) => (
                <div key={index} className="p-4 bg-dark-900 rounded-xl">
                  <h3 className="font-medium text-white">{project.name}</h3>
                  <p className="text-sm text-worldcoin-blue mt-1">{project.totalDistributed}</p>
                  <p className="text-xs text-gray-500 mt-2">{project.strategy}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">{project.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-worldcoin-purple/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-worldcoin-purple" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Team Allocation</h2>
                <p className="text-sm text-gray-400">10% of total supply</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-dark-900 rounded-xl">
                <p className="text-sm text-gray-400">Total Allocation</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(TEAM_AIRDROP.TOTAL)} WDX
                </p>
              </div>
              <div className="p-4 bg-dark-900 rounded-xl">
                <p className="text-sm text-gray-400">Instant Drop (50%)</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatNumber(TEAM_AIRDROP.INSTANT_DROP)} WDX
                </p>
              </div>
            </div>

            <div className="p-4 bg-dark-900 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-400">Vested Portion (50%)</span>
                </div>
                <span className="text-white font-medium">
                  {formatNumber(TEAM_AIRDROP.VESTED)} WDX
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cliff Period</span>
                  <span className="text-white">{TEAM_AIRDROP.VESTING.CLIFF_MONTHS} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Vesting Duration</span>
                  <span className="text-white">{TEAM_AIRDROP.VESTING.DURATION_YEARS} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Monthly Unlock</span>
                  <span className="text-white">
                    {formatNumber(Math.floor(TEAM_AIRDROP.VESTING.MONTHLY_UNLOCK))} WDX
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-dark-900 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">Team Wallet</p>
              <code className="text-xs text-worldcoin-blue font-mono break-all">
                {TEAM_AIRDROP.WALLET}
              </code>
            </div>
          </div>
        </div>
      )}

      {/* User Tab */}
      {activeTab === 'user' && (
        <div className="space-y-6">
          {/* User Airdrop Card */}
          <div className="bg-gradient-to-br from-worldcoin-blue/20 to-worldcoin-purple/20 rounded-2xl p-6 border border-worldcoin-blue/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-worldcoin-blue/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-worldcoin-blue" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Your Airdrop</h2>
                <p className="text-sm text-gray-400">15% of total supply for community</p>
              </div>
            </div>

            {isAuthenticated ? (
              userAirdropData.eligible ? (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-dark-900/50 rounded-xl">
                      <p className="text-sm text-gray-400">Total Allocation</p>
                      <p className="text-2xl font-bold text-white">
                        {formatNumber(userAirdropData.totalAllocation)} WDX
                      </p>
                    </div>
                    <div className="p-4 bg-dark-900/50 rounded-xl">
                      <p className="text-sm text-gray-400">Vested</p>
                      <p className="text-2xl font-bold text-worldcoin-blue">
                        {formatNumber(userAirdropData.vestedAmount)} WDX
                      </p>
                    </div>
                    <div className="p-4 bg-dark-900/50 rounded-xl">
                      <p className="text-sm text-gray-400">Real-time Rewards</p>
                      <p className="text-2xl font-bold text-green-400">
                        {formatNumber(userAirdropData.realtimeRewards)} WDX
                      </p>
                    </div>
                  </div>

                  {/* Vesting Progress */}
                  {airdropClaimed && (
                    <div className="p-4 bg-dark-900/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Vesting Progress</span>
                        <span className="text-sm text-white">{getVestingProgress().toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-worldcoin-blue to-worldcoin-purple transition-all"
                          style={{ width: `${getVestingProgress()}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        12-month linear vesting with 7-day cliff
                      </p>
                    </div>
                  )}

                  {/* Real-time Rewards Info */}
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-400">Real-time Staking Rewards</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Your vested WDX is automatically staked, earning {formatPercent(USER_AIRDROP.VESTING.REWARD_APY)} APY. 
                          Rewards are claimable immediately while principal remains locked.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Claim Button */}
                  {!airdropClaimed && (
                    <button
                      onClick={handleClaim}
                      disabled={isClaiming}
                      className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                    >
                      {isClaiming ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5" />
                          Claim & Stake Airdrop
                        </>
                      )}
                    </button>
                  )}

                  {airdropClaimed && (
                    <div className="flex items-center justify-center gap-2 p-4 bg-green-500/10 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">Airdrop Claimed & Staked</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Not Eligible</h3>
                  <p className="text-gray-400">
                    This wallet address is not eligible for the airdrop.
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Connect your wallet to check eligibility</p>
                <button className="btn-primary">Connect Wallet</button>
              </div>
            )}
          </div>

          {/* Vesting Schedule */}
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4">Vesting Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-dark-900 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">7-Day Cliff</p>
                  <p className="text-xs text-gray-500">No tokens unlock during this period</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-dark-900 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-worldcoin-blue/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-worldcoin-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">12-Month Linear Vesting</p>
                  <p className="text-xs text-gray-500">8.33% unlocks each month</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-dark-900 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Real-time Rewards</p>
                  <p className="text-xs text-gray-500">15% APY on vested amount, claimable anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
