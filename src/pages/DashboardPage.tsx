import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Droplets, 
  Gift, 
  ArrowUpRight,
  Shield,
  Zap
} from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { useMiniKit } from '../hooks/use-minikit';
import { formatCurrency, formatNumber, formatPercent } from '../lib/utils';
import { addToast } from '../components/ToastContainer';

const stats = [
  { label: 'Total Value Locked', value: '$12.5M', change: '+15.3%', positive: true },
  { label: '24h Volume', value: '$2.1M', change: '+8.7%', positive: true },
  { label: 'Active Users', value: '8,432', change: '+23.1%', positive: true },
  { label: 'Fees Generated', value: '$145K', change: '+12.4%', positive: true },
];

const products = [
  {
    id: 'lwld',
    name: 'LWLD',
    description: 'Leveraged WLD staking for amplified yields',
    apy: 24.5,
    tvl: '$3.2M',
    risk: 'high' as const,
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'leth',
    name: 'LETH',
    description: 'Liquid ETH staking with auto-compounding',
    apy: 8.2,
    tvl: '$4.1M',
    risk: 'low' as const,
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'swld',
    name: 'SWLD',
    description: 'Over-collateralized stablecoin backed by WLD',
    apy: 12.8,
    tvl: '$2.8M',
    risk: 'medium' as const,
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'arbitrage',
    name: 'Arbitrage Pool',
    description: 'Earn from liquidation penalties and price discrepancies',
    apy: 28.3,
    tvl: '$1.4M',
    risk: 'medium' as const,
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
  },
];

export function DashboardPage() {
  const { isAuthenticated, walletAddress, walletBalance } = useAppStore();
  const { isInstalled } = useMiniKit();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProductClick = (productId: string) => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet to access this product',
      });
      return;
    }
    window.location.href = `/products/${productId}`;
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back to Worldex Protocol</p>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <div className="bg-dark-800 rounded-xl px-4 py-2 border border-dark-700">
              <p className="text-xs text-gray-400">Portfolio Value</p>
              <p className="text-lg font-bold text-white">{formatCurrency(12500)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-dark-800 rounded-2xl p-4 border border-dark-700"
          >
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingUp className="w-4 h-4" />
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Featured Products</h2>
          <a href="/products" className="text-sm text-worldcoin-blue hover:underline">
            View All
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="bg-dark-800 rounded-2xl p-5 border border-dark-700 hover:border-dark-600 transition-all text-left group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white group-hover:text-worldcoin-blue transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-gray-500">APY</p>
                    <p className="text-lg font-bold text-green-400">{formatPercent(product.apy / 100)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">TVL</p>
                    <p className="text-sm text-white">{product.tvl}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="/airdrop"
          className="bg-gradient-to-br from-worldcoin-blue/20 to-worldcoin-purple/20 rounded-2xl p-5 border border-worldcoin-blue/30 hover:border-worldcoin-blue/50 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-worldcoin-blue/20 flex items-center justify-center mb-3">
                <Gift className="w-5 h-5 text-worldcoin-blue" />
              </div>
              <h3 className="font-semibold text-white">Claim Airdrop</h3>
              <p className="text-sm text-gray-400 mt-1">Get your WDX tokens</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-worldcoin-blue" />
          </div>
        </a>

        <a
          href="/swap"
          className="bg-dark-800 rounded-2xl p-5 border border-dark-700 hover:border-dark-600 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center mb-3">
                <Wallet className="w-5 h-5 text-worldcoin-purple" />
              </div>
              <h3 className="font-semibold text-white">Swap Tokens</h3>
              <p className="text-sm text-gray-400 mt-1">Best rates via Uniswap</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400" />
          </div>
        </a>

        <a
          href="/pools"
          className="bg-dark-800 rounded-2xl p-5 border border-dark-700 hover:border-dark-600 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center mb-3">
                <Droplets className="w-5 h-5 text-worldcoin-cyan" />
              </div>
              <h3 className="font-semibold text-white">Add Liquidity</h3>
              <p className="text-sm text-gray-400 mt-1">Earn fees from swaps</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400" />
          </div>
        </a>
      </div>

      {/* World App Notice */}
      {!isInstalled && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h4 className="font-medium text-yellow-400">Open in World App</h4>
              <p className="text-sm text-gray-400 mt-1">
                For the best experience and full Mini App features, please open this app in World App.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
