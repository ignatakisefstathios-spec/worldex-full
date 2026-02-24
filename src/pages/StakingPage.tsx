import { useState } from 'react';
import { TrendingUp, Lock, Unlock, Gift, Clock, Info } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { formatPercent, formatNumber, formatCurrency } from '../lib/utils';
import { addToast } from '../components/ToastContainer';

const stakingPools = [
  {
    id: 'wdx-staking',
    name: 'WDX Staking',
    token: 'WDX',
    apy: 15.0,
    tvl: 2500000,
    lockPeriod: 0,
    minStake: 100,
    userStaked: 0,
    userRewards: 0,
  },
  {
    id: 'wdx-locked-30',
    name: 'WDX 30-Day Lock',
    token: 'WDX',
    apy: 22.5,
    tvl: 1200000,
    lockPeriod: 30,
    minStake: 500,
    userStaked: 0,
    userRewards: 0,
  },
  {
    id: 'wdx-locked-90',
    name: 'WDX 90-Day Lock',
    token: 'WDX',
    apy: 35.0,
    tvl: 800000,
    lockPeriod: 90,
    minStake: 1000,
    userStaked: 0,
    userRewards: 0,
  },
  {
    id: 'lp-wdx-eth',
    name: 'WDX/ETH LP Staking',
    token: 'WDX-ETH LP',
    apy: 45.2,
    tvl: 1800000,
    lockPeriod: 0,
    minStake: 50,
    userStaked: 0,
    userRewards: 0,
  },
];

export function StakingPage() {
  const { isAuthenticated } = useAppStore();
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [isStaking, setIsStaking] = useState(false);

  const handleStake = async (poolId: string) => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet to stake',
      });
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount to stake',
      });
      return;
    }

    setIsStaking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsStaking(false);
    setStakeAmount('');
    setSelectedPool(null);
    
    addToast({
      type: 'success',
      title: 'Staking Successful',
      message: `Staked ${stakeAmount} tokens successfully`,
    });
  };

  const handleClaim = async (poolId: string) => {
    addToast({
      type: 'info',
      title: 'Coming Soon',
      message: 'Reward claiming will be available after protocol launch',
    });
  };

  const handleUnstake = async (poolId: string) => {
    addToast({
      type: 'info',
      title: 'Coming Soon',
      message: 'Unstaking will be available after protocol launch',
    });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Staking</h1>
        <p className="text-gray-400">Stake WDX and LP tokens to earn rewards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Total Staked</p>
          <p className="text-xl font-bold text-white">{formatCurrency(6300000)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Avg APY</p>
          <p className="text-xl font-bold text-green-400">{formatPercent(0.294)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Rewards Distributed</p>
          <p className="text-xl font-bold text-worldcoin-blue">{formatCurrency(450000)}</p>
        </div>
      </div>

      {/* Staking Pools */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Staking Pools</h2>
        {stakingPools.map((pool) => (
          <div
            key={pool.id}
            className="bg-dark-800 rounded-2xl p-5 border border-dark-700"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-worldcoin-blue to-worldcoin-purple flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{pool.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {pool.lockPeriod > 0 ? (
                      <span className="flex items-center gap-1 text-xs text-yellow-400">
                        <Lock className="w-3 h-3" />
                        {pool.lockPeriod} day lock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <Unlock className="w-3 h-3" />
                        No lock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 lg:gap-8">
                <div>
                  <p className="text-xs text-gray-500">APY</p>
                  <p className="text-lg font-bold text-green-400">{formatPercent(pool.apy / 100)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">TVL</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(pool.tvl, 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Min Stake</p>
                  <p className="text-lg font-bold text-white">{pool.minStake} {pool.token}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPool(selectedPool === pool.id ? null : pool.id)}
                  className="btn-primary px-6"
                >
                  Stake
                </button>
                {pool.userStaked > 0 && (
                  <button
                    onClick={() => handleClaim(pool.id)}
                    className="btn-secondary px-4"
                  >
                    <Gift className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Stake Input */}
            {selectedPool === pool.id && (
              <div className="mt-4 pt-4 border-t border-dark-700">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder={`Min ${pool.minStake} ${pool.token}`}
                    className="flex-1 input"
                  />
                  <button
                    onClick={() => handleStake(pool.id)}
                    disabled={isStaking}
                    className="btn-primary px-8 flex items-center justify-center gap-2"
                  >
                    {isStaking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Staking...
                      </>
                    ) : (
                      'Confirm Stake'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Your Positions */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <h2 className="text-lg font-semibold text-white mb-4">Your Positions</h2>
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No active staking positions</p>
          <p className="text-sm text-gray-500 mt-1">Stake tokens to start earning rewards</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-worldcoin-blue" />
          How Staking Works
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-worldcoin-blue/20 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4 text-worldcoin-blue" />
            </div>
            <h4 className="font-medium text-white mb-1">Stake Tokens</h4>
            <p className="text-sm text-gray-400">Lock your WDX or LP tokens</p>
          </div>
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-worldcoin-blue/20 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4 text-worldcoin-blue" />
            </div>
            <h4 className="font-medium text-white mb-1">Earn Rewards</h4>
            <p className="text-sm text-gray-400">Rewards accrue every block</p>
          </div>
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-worldcoin-blue/20 flex items-center justify-center mb-3">
              <Gift className="w-4 h-4 text-worldcoin-blue" />
            </div>
            <h4 className="font-medium text-white mb-1">Claim Anytime</h4>
            <p className="text-sm text-gray-400">Harvest rewards when you want</p>
          </div>
        </div>
      </div>
    </div>
  );
}
