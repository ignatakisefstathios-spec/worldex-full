import { useState, useEffect } from 'react';
import { ArrowDown, Settings, RefreshCw, Info, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { formatCurrency, formatNumber } from '../lib/utils';
import { addToast } from '../components/ToastContainer';
import { WORLD_CHAIN_TOKENS } from '../lib/uniswap-integration';

const tokens = [
  { symbol: 'ETH', name: 'Ether', balance: '2.45', price: 2850 },
  { symbol: 'WLD', name: 'Worldcoin', balance: '1250', price: 2.35 },
  { symbol: 'WDX', name: 'Worldex', balance: '5000', price: 0.85 },
  { symbol: 'SWLD', name: 'StableWorld', balance: '10000', price: 1.00 },
  { symbol: 'USDC', name: 'USD Coin', balance: '5000', price: 1.00 },
];

export function SwapPage() {
  const { isAuthenticated } = useAppStore();
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('WLD');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const fromTokenData = tokens.find(t => t.symbol === fromToken);
  const toTokenData = tokens.find(t => t.symbol === toToken);

  // Calculate output amount (simulated)
  useEffect(() => {
    if (fromAmount && fromTokenData && toTokenData) {
      const inputValue = parseFloat(fromAmount) * fromTokenData.price;
      const outputAmount = inputValue / toTokenData.price * 0.997; // 0.3% fee
      setToAmount(outputAmount.toFixed(6));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwap = async () => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet to swap',
      });
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    setIsSwapping(true);
    
    // Simulate swap
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSwapping(false);
    setFromAmount('');
    setToAmount('');
    
    addToast({
      type: 'success',
      title: 'Swap Successful',
      message: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
    });
  };

  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const getPriceImpact = () => {
    if (!fromAmount || parseFloat(fromAmount) < 100) return 0;
    return Math.min(parseFloat(fromAmount) * 0.001, 5);
  };

  const priceImpact = getPriceImpact();

  return (
    <div className="max-w-lg mx-auto animate-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Swap</h1>
        <p className="text-gray-400">Trade tokens with best rates via Uniswap</p>
      </div>

      {/* Swap Card */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5">
        {/* Settings */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400">Trade</span>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-4 p-4 bg-dark-900 rounded-xl">
            <p className="text-sm text-gray-400 mb-2">Slippage Tolerance</p>
            <div className="flex gap-2">
              {[0.5, 1, 2].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    slippage === value
                      ? 'bg-worldcoin-blue text-white'
                      : 'bg-dark-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* From Token */}
        <div className="bg-dark-900 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">From</span>
            <span className="text-sm text-gray-400">
              Balance: {fromTokenData?.balance} {fromToken}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-gray-600 outline-none"
            />
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="bg-dark-700 text-white px-3 py-2 rounded-lg font-medium"
            >
              {tokens.map(t => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {fromAmount && fromTokenData 
              ? formatCurrency(parseFloat(fromAmount) * fromTokenData.price)
              : '$0.00'
            }
          </p>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={handleSwitchTokens}
            className="w-10 h-10 bg-dark-700 hover:bg-dark-600 rounded-xl border-4 border-dark-800 flex items-center justify-center transition-colors"
          >
            <ArrowDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* To Token */}
        <div className="bg-dark-900 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">To (estimated)</span>
            <span className="text-sm text-gray-400">
              Balance: {toTokenData?.balance} {toToken}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-gray-600 outline-none"
            />
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-dark-700 text-white px-3 py-2 rounded-lg font-medium"
            >
              {tokens.map(t => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {toAmount && toTokenData
              ? formatCurrency(parseFloat(toAmount) * toTokenData.price)
              : '$0.00'
            }
          </p>
        </div>

        {/* Route Info */}
        {fromAmount && (
          <div className="mt-4 p-4 bg-dark-900 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Rate</span>
              <span className="text-white">
                1 {fromToken} = {(fromTokenData!.price / toTokenData!.price).toFixed(6)} {toToken}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Price Impact</span>
              <span className={priceImpact > 2 ? 'text-red-400' : 'text-green-400'}>
                {priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Fee (0.3%)</span>
              <span className="text-white">
                {fromAmount ? (parseFloat(fromAmount) * 0.003).toFixed(6) : '0'} {fromToken}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Minimum Received</span>
              <span className="text-white">
                {toAmount ? (parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6) : '0'} {toToken}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Route</span>
              <span className="text-worldcoin-blue">Uniswap V3</span>
            </div>
          </div>
        )}

        {/* Warning */}
        {priceImpact > 2 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">
              High price impact! Consider splitting your trade into smaller amounts.
            </p>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={isSwapping || !fromAmount}
          className="w-full btn-primary mt-4 py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSwapping ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Swapping...
            </>
          ) : !isAuthenticated ? (
            'Connect Wallet'
          ) : !fromAmount ? (
            'Enter Amount'
          ) : (
            'Swap'
          )}
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-dark-800 rounded-xl border border-dark-700">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-worldcoin-blue flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-white">Powered by Uniswap V3</h4>
            <p className="text-sm text-gray-400 mt-1">
              All swaps are executed through Uniswap V3 on World Chain for the best rates and deepest liquidity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
