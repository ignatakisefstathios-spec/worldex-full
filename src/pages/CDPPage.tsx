import { useState } from 'react';
import { Shield, Plus, Minus, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { formatCurrency, formatPercent, formatNumber } from '../lib/utils';
import { addToast } from '../components/ToastContainer';
import { SWLD_CONFIG } from '../lib/swld-tokenomics';

const collateralTypes = [
  {
    token: 'WLD',
    price: 2.35,
    balance: 1250,
    maxLTV: 0.60,
    liquidationThreshold: 1.20,
    stabilityFee: 0.025,
  },
  {
    token: 'ETH',
    price: 2850,
    balance: 2.45,
    maxLTV: 0.75,
    liquidationThreshold: 1.20,
    stabilityFee: 0.015,
  },
];

export function CDPPage() {
  const { isAuthenticated } = useAppStore();
  const [selectedCollateral, setSelectedCollateral] = useState('WLD');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'mint' | 'manage'>('mint');

  const collateral = collateralTypes.find(c => c.token === selectedCollateral);
  
  const collateralValue = collateral && collateralAmount 
    ? parseFloat(collateralAmount) * collateral.price 
    : 0;
  
  const maxMint = collateral 
    ? collateralValue * collateral.maxLTV 
    : 0;
  
  const collateralRatio = mintAmount > '0' && collateralValue > 0
    ? (collateralValue / parseFloat(mintAmount)) * 100
    : 0;
  
  const liquidationPrice = mintAmount > '0' && collateralAmount > '0' && collateral
    ? (parseFloat(mintAmount) * 1.20) / parseFloat(collateralAmount)
    : 0;

  const handleMint = async () => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet to mint SWLD',
      });
      return;
    }

    if (collateralRatio < 150) {
      addToast({
        type: 'error',
        title: 'Insufficient Collateral',
        message: 'Collateral ratio must be at least 150%',
      });
      return;
    }

    addToast({
      type: 'success',
      title: 'SWLD Minted',
      message: `Minted ${mintAmount} SWLD against ${collateralAmount} ${selectedCollateral}`,
    });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">CDP Vault</h1>
        <p className="text-gray-400">Mint SWLD stablecoin by locking collateral</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">SWLD Circulating</p>
          <p className="text-xl font-bold text-white">{formatCurrency(2800000)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Total Collateral</p>
          <p className="text-xl font-bold text-white">{formatCurrency(4200000)}</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Avg Collateral Ratio</p>
          <p className="text-xl font-bold text-green-400">185%</p>
        </div>
        <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
          <p className="text-sm text-gray-400">Stability Fee</p>
          <p className="text-xl font-bold text-worldcoin-blue">2.0%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-dark-800 rounded-xl p-1 border border-dark-700 w-fit">
        <button
          onClick={() => setActiveTab('mint')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'mint'
              ? 'bg-worldcoin-blue text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Mint SWLD
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'manage'
              ? 'bg-worldcoin-blue text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Manage Vaults
        </button>
      </div>

      {activeTab === 'mint' ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mint Form */}
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Open Vault</h2>
            
            {/* Collateral Selection */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">Collateral Type</label>
              <div className="grid grid-cols-2 gap-2">
                {collateralTypes.map((c) => (
                  <button
                    key={c.token}
                    onClick={() => setSelectedCollateral(c.token)}
                    className={`p-3 rounded-xl border transition-all ${
                      selectedCollateral === c.token
                        ? 'border-worldcoin-blue bg-worldcoin-blue/10'
                        : 'border-dark-600 hover:border-dark-500'
                    }`}
                  >
                    <p className="font-medium text-white">{c.token}</p>
                    <p className="text-sm text-gray-400">{formatCurrency(c.price)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Collateral Input */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">
                Collateral Amount
                <span className="text-gray-500 ml-2">
                  (Balance: {collateral?.balance} {selectedCollateral})
                </span>
              </label>
              <input
                type="number"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                placeholder="0.0"
                className="input"
              />
              <p className="text-sm text-gray-500 mt-1">
                Value: {formatCurrency(collateralValue)}
              </p>
            </div>

            {/* Mint Input */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">
                Mint SWLD
                <span className="text-gray-500 ml-2">
                  (Max: {formatCurrency(maxMint)})
                </span>
              </label>
              <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="0.0"
                className="input"
              />
            </div>

            {/* Mint Button */}
            <button
              onClick={handleMint}
              className="w-full btn-primary py-4"
            >
              Mint SWLD
            </button>
          </div>

          {/* Position Summary */}
          <div className="space-y-4">
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <h2 className="text-lg font-semibold text-white mb-4">Position Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Collateral Ratio</span>
                  <span className={`font-bold ${
                    collateralRatio >= 150 ? 'text-green-400' :
                    collateralRatio >= 120 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {collateralRatio > 0 ? collateralRatio.toFixed(1) : '0'}%
                  </span>
                </div>
                
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      collateralRatio >= 150 ? 'bg-green-400' :
                      collateralRatio >= 120 ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(collateralRatio / 3, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Liquidation (120%)</span>
                  <span>Minimum (150%)</span>
                  <span>Safe (200%+)</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Liquidation Price</span>
                  <span className="text-white">{formatCurrency(liquidationPrice)}/{selectedCollateral}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stability Fee</span>
                  <span className="text-white">{formatPercent(collateral?.stabilityFee || 0.02)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max LTV</span>
                  <span className="text-white">{formatPercent(collateral?.maxLTV || 0.6)}</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            {collateralRatio > 0 && collateralRatio < 150 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-400">Low Collateral Ratio</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Your position is below the recommended 150% ratio. 
                    Consider adding more collateral or repaying some debt.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-dark-800 rounded-2xl p-8 border border-dark-700 text-center">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Active Vaults</h3>
          <p className="text-gray-400">Open a vault to start minting SWLD</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-worldcoin-blue" />
          How CDP Works
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-worldcoin-blue/20 flex items-center justify-center mb-3">
              <Plus className="w-4 h-4 text-worldcoin-blue" />
            </div>
            <h4 className="font-medium text-white mb-1">Deposit Collateral</h4>
            <p className="text-sm text-gray-400">Lock WLD or ETH as collateral</p>
          </div>
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-worldcoin-blue/20 flex items-center justify-center mb-3">
              <TrendingUp className="w-4 h-4 text-worldcoin-blue" />
            </div>
            <h4 className="font-medium text-white mb-1">Mint SWLD</h4>
            <p className="text-sm text-gray-400">Borrow up to 60-75% of collateral value</p>
          </div>
          <div className="p-4 bg-dark-900 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-worldcoin-blue/20 flex items-center justify-center mb-3">
              <Minus className="w-4 h-4 text-worldcoin-blue" />
            </div>
            <h4 className="font-medium text-white mb-1">Repay Anytime</h4>
            <p className="text-sm text-gray-400">Pay back SWLD to unlock collateral</p>
          </div>
        </div>
      </div>
    </div>
  );
}
