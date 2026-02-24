import { useState } from 'react';
import { Droplets, TrendingUp, ArrowUpRight, Wallet } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { formatPercent, formatCurrency } from '../lib/utils';
import { addToast } from '../components/ToastContainer';

const pools = [
  {
    id: 'wdx-eth',
    name: 'WDX/ETH',
    token0: 'WDX',
    token1: 'ETH',
    apy: 45.2,
    tvl: 1250000,
    volume24h: 320000,
    fee: 0.003,
    userDeposit: 0,
  },
  {
    id: 'wld-eth',
    name: 'WLD/ETH',
    token0: 'WLD',
    token1: 'ETH',
    apy: 32.8,
    tvl: 2100000,
    volume24h: 580000,
    fee: 0.003,
    userDeposit: 0,
  },
  {
    id: 'swld-usdc',
    name: 'SWLD/USDC',
    token0: 'SWLD',
    token1: 'USDC',
    apy: 18.5,
    tvl: 890000,
    volume24h: 210000,
    fee: 0.0005,
    userDeposit: 0,
  },
  {
    id: 'wdx-swld',
    name: 'WDX/SWLD',
    token0: 'WDX',
    token1: 'SWLD',
    apy: 52.3,
    tvl: 650000,
    volume24h: 180000,
    fee: 0.003,
    userDeposit: 0,
  },
];

export function PoolsPage() {
  const { isAuthenticated } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  const handleAddLiquidity = (poolId: string) => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet to add liquidity',
      });
      return;
    }
    addToast({
      type: 'info',
      title: 'Coming Soon',
      message: 'Liquidity provision will be available after protocol launch',
    });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Liquidity Pools</h1>
          <p className="text-gray-400">Provide liquidity and earn trading fees</p>
        </div>
        <div className="flex bg-dark-800 rounded-xl p-1 border border-dark-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-worldcoin-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Pools
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'my'
                ? 'bg-worldcoin-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Positions
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Total TVL</p>
          <p className="text-xl font-bold text-white">{formatCurrency(4890000)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">24h Volume</p>
          <p className="text-xl font-bold text-white">{formatCurrency(1290000)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">24h Fees</p>
          <p className="text-xl font-bold text-green-400">{formatCurrency(3870)}</p>
        </div>
      </div>

      {/* Pools List */}
      {activeTab === 'all' ? (
        <div className="space-y-4">
          {pools.map((pool) => (
            <div
              key={pool.id}
              className="bg-dark-800 rounded-2xl p-5 border border-dark-700 hover:border-dark-600 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-worldcoin-blue flex items-center justify-center border-2 border-dark-800">
                      <span className="text-white text-xs font-bold">{pool.token0[0]}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-worldcoin-purple flex items-center justify-center border-2 border-dark-800">
                      <span className="text-white text-xs font-bold">{pool.token1[0]}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{pool.name}</h3>
                    <p className="text-sm text-gray-400">Fee: {formatPercent(pool.fee)}</p>
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
                    <p className="text-xs text-gray-500">24h Volume</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(pool.volume24h, 0)}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAddLiquidity(pool.id)}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Droplets className="w-4 h-4" />
                  Add Liquidity
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Wallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Positions</h3>
          <p className="text-gray-400 mb-6">You haven't added liquidity to any pools yet</p>
          <button
            onClick={() => setActiveTab('all')}
            className="btn-secondary"
          >
            Explore Pools
          </button>
        </div>
      )}

      {/* Info */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-worldcoin-blue" />
          How It Works
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-worldcoin-blue/20 flex items-center justify-center mb-3">
              <span className="text-worldcoin-blue font-bold">1</span>
            </div>
            <h4 className="font-medium text-white mb-1">Add Liquidity</h4>
            <p className="text-sm text-gray-400">Deposit token pairs to provide liquidity</p>
          </div>
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-worldcoin-blue/20 flex items-center justify-center mb-3">
              <span className="text-worldcoin-blue font-bold">2</span>
            </div>
            <h4 className="font-medium text-white mb-1">Earn Fees</h4>
            <p className="text-sm text-gray-400">Receive trading fees from every swap</p>
          </div>
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-worldcoin-blue/20 flex items-center justify-center mb-3">
              <span className="text-worldcoin-blue font-bold">3</span>
            </div>
            <h4 className="font-medium text-white mb-1">Claim Rewards</h4>
            <p className="text-sm text-gray-400">Withdraw your LP tokens and earned fees</p>
          </div>
        </div>
      </div>
    </div>
  );
}
