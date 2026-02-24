import { useState } from 'react';
import { TrendingUp, ArrowLeftRight, Zap, AlertTriangle, Info, Clock } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { formatCurrency, formatPercent } from '../lib/utils';
import { addToast } from '../components/ToastContainer';
import { ARBITRAGE_POOL_CONFIG } from '../lib/swld-tokenomics';

export function ArbitragePage() {
  const { isAuthenticated } = useAppStore();
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  const handleDeposit = async () => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet to deposit',
      });
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) < 100) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Minimum deposit is 100 SWLD',
      });
      return;
    }

    setIsDepositing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDepositing(false);
    setDepositAmount('');
    
    addToast({
      type: 'success',
      title: 'Deposit Successful',
      message: `Deposited ${depositAmount} SWLD to arbitrage pool`,
    });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Arbitrage Pool</h1>
        <p className="text-gray-400">Earn from liquidation penalties and price discrepancies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Pool APY</p>
          <p className="text-xl font-bold text-green-400">{formatPercent(0.283)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Total Deposits</p>
          <p className="text-xl font-bold text-white">{formatCurrency(1400000)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">24h Profit</p>
          <p className="text-xl font-bold text-worldcoin-blue">{formatCurrency(1085)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Deposit Token</p>
          <p className="text-xl font-bold text-white">SWLD Only</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Deposit Card */}
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <ArrowLeftRight className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Deposit SWLD</h2>
              <p className="text-sm text-gray-400">Minimum: 100 SWLD</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="100"
                  className="input pr-20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  SWLD
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Balance: 10,000 SWLD
              </p>
            </div>

            <div className="p-4 bg-dark-900 rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Expected APY</span>
                <span className="text-green-400 font-medium">{formatPercent(0.283)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Daily Earnings (est.)</span>
                <span className="text-white">
                  {depositAmount ? (parseFloat(depositAmount) * 0.283 / 365).toFixed(4) : '0'} SWLD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Withdrawal Cooldown</span>
                <span className="text-white">7 days</span>
              </div>
            </div>

            <button
              onClick={handleDeposit}
              disabled={isDepositing}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2"
            >
              {isDepositing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Depositing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Deposit SWLD
                </>
              )}
            </button>
          </div>
        </div>

        {/* Yield Sources */}
        <div className="space-y-4">
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Yield Sources</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Liquidation Penalties</p>
                    <p className="text-sm text-gray-400">13% from liquidated positions</p>
                  </div>
                </div>
                <span className="text-green-400 font-medium">60%</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-worldcoin-blue/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-worldcoin-blue" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Stability Fees</p>
                    <p className="text-sm text-gray-400">2% annual on CDP debt</p>
                  </div>
                </div>
                <span className="text-green-400 font-medium">30%</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">DEX Swap Fees</p>
                    <p className="text-sm text-gray-400">0.3% from Uniswap trades</p>
                  </div>
                </div>
                <span className="text-green-400 font-medium">10%</span>
              </div>
            </div>
          </div>

          {/* Recent Profits */}
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Profits</h2>
            <div className="space-y-3">
              {[
                { source: 'Liquidation', amount: 245.50, time: '2 min ago' },
                { source: 'Stability Fee', amount: 128.30, time: '15 min ago' },
                { source: 'Swap Fee', amount: 45.20, time: '32 min ago' },
                { source: 'Liquidation', amount: 892.00, time: '1 hour ago' },
              ].map((profit, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">{profit.source}</p>
                      <p className="text-xs text-gray-500">{profit.time}</p>
                    </div>
                  </div>
                  <span className="text-green-400 font-medium">+{formatCurrency(profit.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-worldcoin-blue" />
          How Arbitrage Pool Works
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
              <ArrowLeftRight className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="font-medium text-white mb-1">Deposit SWLD</h4>
            <p className="text-sm text-gray-400">Only SWLD deposits accepted</p>
          </div>
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="font-medium text-white mb-1">Earn Yield</h4>
            <p className="text-sm text-gray-400">Profits from liquidations & fees</p>
          </div>
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="font-medium text-white mb-1">7-Day Cooldown</h4>
            <p className="text-sm text-gray-400">Withdraw after cooldown period</p>
          </div>
        </div>
      </div>
    </div>
  );
}
