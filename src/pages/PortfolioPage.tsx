import { useState } from 'react';
import { Briefcase, TrendingUp, TrendingDown, PieChart, History, Wallet } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { formatCurrency, formatPercent, formatNumber } from '../lib/utils';

const portfolioData = {
  totalValue: 12500,
  totalDeposits: 10000,
  totalEarnings: 2500,
  pnl: 0.25,
  allocation: [
    { name: 'Staking', value: 4500, percentage: 0.36, color: '#0052FF' },
    { name: 'Pools', value: 3200, percentage: 0.26, color: '#8B5CF6' },
    { name: 'CDP', value: 2800, percentage: 0.22, color: '#10B981' },
    { name: 'Arbitrage', value: 2000, percentage: 0.16, color: '#EC4899' },
  ],
};

const transactions = [
  { type: 'deposit', amount: 1000, token: 'WDX', protocol: 'Staking', time: '2 hours ago', value: 850 },
  { type: 'claim', amount: 125, token: 'WDX', protocol: 'Staking', time: '1 day ago', value: 106 },
  { type: 'withdraw', amount: 500, token: 'ETH', protocol: 'Pools', time: '3 days ago', value: 1425 },
  { type: 'deposit', amount: 2000, token: 'SWLD', protocol: 'Arbitrage', time: '5 days ago', value: 2000 },
];

export function PortfolioPage() {
  const { isAuthenticated, walletAddress } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in">
        <Wallet className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Connect Wallet</h2>
        <p className="text-gray-400 text-center max-w-md">
          Connect your wallet to view your portfolio and track your DeFi positions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <p className="text-gray-400">Track your positions and earnings</p>
      </div>

      {/* Total Value Card */}
      <div className="bg-gradient-to-br from-worldcoin-blue/20 to-worldcoin-purple/20 rounded-2xl p-6 border border-worldcoin-blue/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-gray-400">Total Portfolio Value</p>
            <p className="text-4xl font-bold text-white">{formatCurrency(portfolioData.totalValue)}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className={`flex items-center gap-1 ${portfolioData.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioData.pnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">{formatPercent(portfolioData.pnl)}</span>
              </div>
              <span className="text-gray-500">all time</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Deposited</p>
              <p className="text-xl font-bold text-white">{formatCurrency(portfolioData.totalDeposits)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Earnings</p>
              <p className="text-xl font-bold text-green-400">+{formatCurrency(portfolioData.totalEarnings)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-dark-800 rounded-xl p-1 border border-dark-700 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-worldcoin-blue text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <PieChart className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-worldcoin-blue text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          History
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Allocation */}
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Asset Allocation</h2>
            <div className="space-y-4">
              {portfolioData.allocation.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white">{item.name}</span>
                      <span className="text-gray-400">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${item.percentage * 100}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-gray-400 w-16 text-right">
                    {formatPercent(item.percentage)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Positions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-dark-800 rounded-2xl p-5 border border-dark-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-worldcoin-blue/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-worldcoin-blue" />
                </div>
                <div>
                  <p className="text-gray-400">Staking</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(4500)}</p>
                </div>
              </div>
              <p className="text-sm text-green-400">+{formatCurrency(450)} earned</p>
            </div>

            <div className="bg-dark-800 rounded-2xl p-5 border border-dark-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-worldcoin-purple/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-worldcoin-purple" />
                </div>
                <div>
                  <p className="text-gray-400">Pools</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(3200)}</p>
                </div>
              </div>
              <p className="text-sm text-green-400">+{formatCurrency(320)} earned</p>
            </div>

            <div className="bg-dark-800 rounded-2xl p-5 border border-dark-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400">CDP Vault</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(2800)}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">1,200 SWLD minted</p>
            </div>

            <div className="bg-dark-800 rounded-2xl p-5 border border-dark-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-gray-400">Arbitrage</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(2000)}</p>
                </div>
              </div>
              <p className="text-sm text-green-400">+{formatCurrency(180)} earned</p>
            </div>
          </div>
        </>
      ) : (
        /* Transaction History */
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.type === 'deposit' ? 'bg-green-500/20' :
                    tx.type === 'withdraw' ? 'bg-red-500/20' :
                    'bg-worldcoin-blue/20'
                  }`}>
                    {tx.type === 'deposit' ? <TrendingUp className="w-5 h-5 text-green-400" /> :
                     tx.type === 'withdraw' ? <TrendingDown className="w-5 h-5 text-red-400" /> :
                     <Briefcase className="w-5 h-5 text-worldcoin-blue" />}
                  </div>
                  <div>
                    <p className="text-white capitalize">{tx.type}</p>
                    <p className="text-sm text-gray-400">{tx.protocol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white">{tx.amount} {tx.token}</p>
                  <p className="text-sm text-gray-400">{tx.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
