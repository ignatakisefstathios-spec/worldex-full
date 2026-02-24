import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Info, TrendingUp, Lock } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { formatPercent, formatCurrency } from '../lib/utils';
import { addToast } from '../components/ToastContainer';

const safetyPools = [
  {
    id: 'safety-wld',
    name: 'WLD Insurance Pool',
    asset: 'WLD',
    coverage: 0.95, // 95% coverage
    premium: 0.02, // 2% annual premium
    tvl: 850000,
    maxPayout: 500000,
  },
  {
    id: 'safety-eth',
    name: 'ETH Insurance Pool',
    asset: 'ETH',
    coverage: 0.95,
    premium: 0.015,
    tvl: 1200000,
    maxPayout: 800000,
  },
  {
    id: 'safety-smart-contract',
    name: 'Smart Contract Cover',
    asset: 'All Pools',
    coverage: 0.90,
    premium: 0.05,
    tvl: 2100000,
    maxPayout: 1500000,
  },
];

const auditedContracts = [
  { name: 'WDX Token', auditor: 'CertiK', status: 'passed', date: '2024-01-15' },
  { name: 'Staking Contract', auditor: 'OpenZeppelin', status: 'passed', date: '2024-01-20' },
  { name: 'CDP Vault', auditor: 'Trail of Bits', status: 'passed', date: '2024-02-01' },
  { name: 'Arbitrage Pool', auditor: 'CertiK', status: 'passed', date: '2024-02-10' },
];

export function SafetyPage() {
  const { isAuthenticated } = useAppStore();
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [coverageAmount, setCoverageAmount] = useState('');

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet to purchase coverage',
      });
      return;
    }

    addToast({
      type: 'info',
      title: 'Coming Soon',
      message: 'Insurance coverage will be available after protocol launch',
    });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Safety</h1>
        <p className="text-gray-400">Insurance and security for your deposits</p>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Total Coverage</p>
          <p className="text-xl font-bold text-white">{formatCurrency(4150000)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Active Policies</p>
          <p className="text-xl font-bold text-worldcoin-blue">1,245</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Claims Paid</p>
          <p className="text-xl font-bold text-green-400">{formatCurrency(125000)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Security Score</p>
          <p className="text-xl font-bold text-green-400">98/100</p>
        </div>
      </div>

      {/* Insurance Pools */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Insurance Pools</h2>
        {safetyPools.map((pool) => (
          <div
            key={pool.id}
            className="bg-dark-800 rounded-2xl p-5 border border-dark-700"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{pool.name}</h3>
                  <p className="text-sm text-gray-400">
                    Up to {formatPercent(pool.coverage)} coverage
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 lg:gap-8">
                <div>
                  <p className="text-xs text-gray-500">Annual Premium</p>
                  <p className="text-lg font-bold text-yellow-400">{formatPercent(pool.premium)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pool Size</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(pool.tvl, 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Max Payout</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(pool.maxPayout, 0)}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPool(selectedPool === pool.id ? null : pool.id)}
                className="btn-primary px-6"
              >
                Get Coverage
              </button>
            </div>

            {/* Coverage Form */}
            {selectedPool === pool.id && (
              <div className="mt-4 pt-4 border-t border-dark-700">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="number"
                    value={coverageAmount}
                    onChange={(e) => setCoverageAmount(e.target.value)}
                    placeholder="Coverage amount"
                    className="flex-1 input"
                  />
                  <button
                    onClick={handlePurchase}
                    className="btn-primary px-8"
                  >
                    Purchase
                  </button>
                </div>
                {coverageAmount && (
                  <p className="text-sm text-gray-400 mt-2">
                    Annual premium: {formatCurrency(parseFloat(coverageAmount) * pool.premium)}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Security Audits */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Security Audits
        </h2>
        <div className="space-y-3">
          {auditedContracts.map((contract, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-dark-900 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{contract.name}</p>
                  <p className="text-sm text-gray-400">Audited by {contract.auditor}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  {contract.status === 'passed' ? 'Passed' : contract.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">{contract.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Warnings */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-400 mb-2">Risk Disclaimer</h3>
            <p className="text-sm text-gray-400">
              DeFi protocols carry inherent risks including smart contract bugs, oracle failures, 
              and market volatility. While we have been audited by leading security firms, 
              please only deposit what you can afford to lose. Insurance coverage has limits 
              and may not cover all types of losses.
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-worldcoin-blue" />
          How Insurance Works
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <h4 className="font-medium text-white mb-1">Purchase Coverage</h4>
            <p className="text-sm text-gray-400">Select pool and coverage amount</p>
          </div>
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <h4 className="font-medium text-white mb-1">Pay Premium</h4>
            <p className="text-sm text-gray-400">Annual fee based on coverage</p>
          </div>
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <h4 className="font-medium text-white mb-1">File Claims</h4>
            <p className="text-sm text-gray-400">Submit proof for valid claims</p>
          </div>
        </div>
      </div>
    </div>
  );
}
