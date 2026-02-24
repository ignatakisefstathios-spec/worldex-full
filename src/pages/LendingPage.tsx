import { useState } from 'react';
import { Briefcase, TrendingUp, ArrowDownLeft, ArrowUpRight, Info, Clock } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { formatPercent, formatCurrency } from '../lib/utils';
import { addToast } from '../components/ToastContainer';

const lendingMarkets = [
  {
    id: 'wld-lend',
    asset: 'WLD',
    supplyApy: 8.5,
    borrowApy: 15.2,
    totalSupply: 2500000,
    totalBorrow: 1200000,
    utilization: 0.48,
    collateralFactor: 0.75,
    userSupply: 0,
    userBorrow: 0,
  },
  {
    id: 'eth-lend',
    asset: 'ETH',
    supplyApy: 3.2,
    borrowApy: 6.8,
    totalSupply: 4200000,
    totalBorrow: 1800000,
    utilization: 0.43,
    collateralFactor: 0.80,
    userSupply: 0,
    userBorrow: 0,
  },
  {
    id: 'usdc-lend',
    asset: 'USDC',
    supplyApy: 5.8,
    borrowApy: 9.5,
    totalSupply: 1800000,
    totalBorrow: 950000,
    utilization: 0.53,
    collateralFactor: 0.85,
    userSupply: 0,
    userBorrow: 0,
  },
  {
    id: 'wdx-lend',
    asset: 'WDX',
    supplyApy: 12.5,
    borrowApy: 22.0,
    totalSupply: 850000,
    totalBorrow: 320000,
    utilization: 0.38,
    collateralFactor: 0.65,
    userSupply: 0,
    userBorrow: 0,
  },
];

export function LendingPage() {
  const { isAuthenticated } = useAppStore();
  const [activeTab, setActiveTab] = useState<'supply' | 'borrow'>('supply');
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const handleAction = async (action: 'supply' | 'borrow') => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet',
      });
      return;
    }

    addToast({
      type: 'info',
      title: 'Coming Soon',
      message: 'Lending will be available after protocol launch',
    });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Lending</h1>
        <p className="text-gray-400">Supply assets to earn interest or borrow against collateral</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Total Supplied</p>
          <p className="text-xl font-bold text-white">{formatCurrency(9350000)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Total Borrowed</p>
          <p className="text-xl font-bold text-worldcoin-blue">{formatCurrency(4270000)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Avg Supply APY</p>
          <p className="text-xl font-bold text-green-400">{formatPercent(0.075)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Avg Borrow APY</p>
          <p className="text-xl font-bold text-yellow-400">{formatPercent(0.134)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-dark-800 rounded-xl p-1 border border-dark-700 w-fit">
        <button
          onClick={() => setActiveTab('supply')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'supply'
              ? 'bg-green-500/20 text-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          Supply
        </button>
        <button
          onClick={() => setActiveTab('borrow')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'borrow'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          Borrow
        </button>
      </div>

      {/* Markets */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {activeTab === 'supply' ? 'Supply Markets' : 'Borrow Markets'}
        </h2>
        {lendingMarkets.map((market) => (
          <div
            key={market.id}
            className="bg-dark-800 rounded-2xl p-5 border border-dark-700"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-worldcoin-blue to-worldcoin-purple flex items-center justify-center">
                  <span className="text-white font-bold">{market.asset[0]}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{market.asset}</h3>
                  <p className="text-sm text-gray-400">
                    CF: {formatPercent(market.collateralFactor)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6 lg:gap-8">
                <div>
                  <p className="text-xs text-gray-500">
                    {activeTab === 'supply' ? 'Supply APY' : 'Borrow APY'}
                  </p>
                  <p className={`text-lg font-bold ${
                    activeTab === 'supply' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {formatPercent(activeTab === 'supply' ? market.supplyApy / 100 : market.borrowApy / 100)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Supply</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(market.totalSupply, 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Borrow</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(market.totalBorrow, 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Utilization</p>
                  <p className="text-lg font-bold text-worldcoin-blue">{formatPercent(market.utilization)}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMarket(selectedMarket === market.id ? null : market.id)}
                className={`btn-primary px-6 ${
                  activeTab === 'supply' ? '' : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {activeTab === 'supply' ? 'Supply' : 'Borrow'}
              </button>
            </div>

            {/* Action Form */}
            {selectedMarket === market.id && (
              <div className="mt-4 pt-4 border-t border-dark-700">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 input"
                  />
                  <button
                    onClick={() => handleAction(activeTab)}
                    className={`btn-primary px-8 ${
                      activeTab === 'borrow' ? 'bg-yellow-500 hover:bg-yellow-600' : ''
                    }`}
                  >
                    {activeTab === 'supply' ? 'Supply' : 'Borrow'} {market.asset}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-worldcoin-blue" />
          How Lending Works
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="font-medium text-white">Supply</h4>
            </div>
            <p className="text-sm text-gray-400">
              Deposit assets to earn interest. Your supplied assets can be used as collateral 
              to borrow other assets. Interest accrues every block.
            </p>
          </div>
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-yellow-400" />
              </div>
              <h4 className="font-medium text-white">Borrow</h4>
            </div>
            <p className="text-sm text-gray-400">
              Borrow assets against your supplied collateral. Maintain a healthy collateral 
              ratio to avoid liquidation. Repay anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
