import { useParams } from 'react-router-dom';
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  ArrowLeftRight, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { formatPercent, formatCurrency } from '../lib/utils';
import { addToast } from '../components/ToastContainer';

const productsData = {
  lwld: {
    id: 'lwld',
    name: 'LWLD',
    fullName: 'Leveraged WLD',
    description: 'Amplify your WLD exposure with up to 3x leverage while earning staking rewards.',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    apy: 24.5,
    tvl: 3200000,
    risk: 'high',
    leverage: 3,
    features: [
      'Up to 3x leverage on WLD',
      'Auto-compounding rewards',
      'Liquidation protection',
      'Instant withdrawals',
    ],
    risks: [
      'High volatility risk',
      'Potential liquidation',
      'Leverage amplification of losses',
    ],
  },
  leth: {
    id: 'leth',
    name: 'LETH',
    fullName: 'Liquid ETH',
    description: 'Stake your ETH and receive liquid staking tokens that earn rewards while staying liquid.',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    apy: 8.2,
    tvl: 4100000,
    risk: 'low',
    features: [
      'Liquid staking tokens',
      'Auto-compounding ETH rewards',
      'Use LETH in DeFi',
      'No lockup period',
    ],
    risks: [
      'Smart contract risk',
      'ETH price volatility',
    ],
  },
  swld: {
    id: 'swld',
    name: 'SWLD',
    fullName: 'StableWorld Dollar',
    description: 'Over-collateralized stablecoin backed by WLD and ETH with 150% minimum collateral ratio.',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    apy: 12.8,
    tvl: 2800000,
    risk: 'medium',
    features: [
      '150% minimum collateral ratio',
      'Decentralized stablecoin',
      'Earn from stability fees',
      'Instant minting',
    ],
    risks: [
      'Collateral volatility',
      'Liquidation risk below 120%',
      'Oracle failure risk',
    ],
  },
  arbitrage: {
    id: 'arbitrage',
    name: 'Arbitrage Pool',
    description: 'Deposit SWLD to earn from liquidation penalties and arbitrage opportunities across DEXs.',
    icon: ArrowLeftRight,
    color: 'from-purple-500 to-pink-500',
    apy: 28.3,
    tvl: 1400000,
    risk: 'medium',
    depositToken: 'SWLD',
    features: [
      'SWLD deposits only',
      'Earn liquidation penalties',
      'DEX arbitrage profits',
      'Auto-compounded yields',
    ],
    risks: [
      'Smart contract risk',
      'Reduced arbitrage opportunities',
      'Temporary IL risk',
    ],
  },
};

export function ProductsPage() {
  const { productId } = useParams();
  const { isAuthenticated } = useAppStore();

  const handleDeposit = (productId: string) => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Connect Wallet',
        message: 'Please connect your wallet to deposit',
      });
      return;
    }
    addToast({
      type: 'info',
      title: 'Coming Soon',
      message: 'Deposits will be available after protocol launch',
    });
  };

  // Show specific product if ID provided
  if (productId && productsData[productId as keyof typeof productsData]) {
    const product = productsData[productId as keyof typeof productsData];
    const Icon = product.icon;

    return (
      <div className="space-y-6 animate-in">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{product.fullName || product.name}</h1>
            <p className="text-gray-400 mt-1">{product.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-dark-800 rounded-2xl p-5 border border-dark-700">
            <p className="text-sm text-gray-400">APY</p>
            <p className={`text-2xl font-bold ${product.apy > 15 ? 'text-green-400' : 'text-worldcoin-blue'}`}>
              {formatPercent(product.apy / 100)}
            </p>
          </div>
          <div className="bg-dark-800 rounded-2xl p-5 border border-dark-700">
            <p className="text-sm text-gray-400">Total Value Locked</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(product.tvl)}</p>
          </div>
          <div className="bg-dark-800 rounded-2xl p-5 border border-dark-700">
            <p className="text-sm text-gray-400">Risk Level</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.risk === 'low' ? 'bg-green-500/20 text-green-400' :
                product.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {product.risk.charAt(0).toUpperCase() + product.risk.slice(1)} Risk
              </span>
            </div>
          </div>
        </div>

        {/* Features & Risks */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Features
            </h3>
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Risks
            </h3>
            <ul className="space-y-3">
              {product.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                  <span className="text-gray-300">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action */}
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Ready to start?</h3>
              <p className="text-gray-400 text-sm">
                Deposit to start earning {formatPercent(product.apy / 100)} APY
              </p>
            </div>
            <button 
              onClick={() => handleDeposit(product.id)}
              className="btn-primary px-8"
            >
              Deposit {product.depositToken || product.name}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show all products
  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <p className="text-gray-400">Explore our suite of DeFi products</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {Object.values(productsData).map((product) => {
          const Icon = product.icon;
          return (
            <a
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-dark-800 rounded-2xl p-6 border border-dark-700 hover:border-dark-600 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.risk === 'low' ? 'bg-green-500/20 text-green-400' :
                  product.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {product.risk.charAt(0).toUpperCase() + product.risk.slice(1)} Risk
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-worldcoin-blue transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
                <div>
                  <p className="text-xs text-gray-500">APY</p>
                  <p className={`text-lg font-bold ${product.apy > 15 ? 'text-green-400' : 'text-worldcoin-blue'}`}>
                    {formatPercent(product.apy / 100)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">TVL</p>
                  <p className="text-sm text-white">{formatCurrency(product.tvl)}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
