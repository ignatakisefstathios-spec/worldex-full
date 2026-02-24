import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Home, 
  Layers, 
  Droplets, 
  ArrowLeftRight, 
  Gift, 
  TrendingUp,
  Shield,
  Briefcase,
  Menu,
  X,
  Wallet,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import { useMiniKit } from '../../hooks/use-minikit';
import { cn } from '../../lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/products', label: 'Products', icon: Layers },
  { path: '/pools', label: 'Pools', icon: Droplets },
  { path: '/swap', label: 'Swap', icon: ArrowLeftRight },
  { path: '/airdrop', label: 'Airdrop', icon: Gift },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
];

const productItems = [
  { path: '/staking', label: 'Staking', icon: TrendingUp, color: 'text-green-400' },
  { path: '/cdp', label: 'CDP Vault', icon: Shield, color: 'text-blue-400' },
  { path: '/arbitrage', label: 'Arbitrage', icon: ArrowLeftRight, color: 'text-purple-400' },
  { path: '/safety', label: 'Safety', icon: Shield, color: 'text-yellow-400' },
  { path: '/lending', label: 'Lending', icon: Briefcase, color: 'text-cyan-400' },
];

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, walletAddress, walletBalance, setShowConnectModal } = useAppStore();
  const { connect, isLoading } = useMiniKit();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleConnect = async () => {
    if (!isAuthenticated) {
      setShowConnectModal(true);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex min-h-screen bg-dark-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-800 border-r border-dark-700 fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-worldcoin-blue to-worldcoin-purple flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Worldex</h1>
              <p className="text-xs text-gray-400">DeFi Protocol</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Main
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-worldcoin-blue/20 text-worldcoin-blue border border-worldcoin-blue/30'
                    : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}

          <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mt-6 mb-2">
            Products
          </p>
          {productItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-dark-700 text-white'
                    : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                )}
              >
                <Icon className={cn('w-5 h-5', item.color)} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Wallet Section */}
        <div className="p-4 border-t border-dark-700">
          {isAuthenticated && walletAddress ? (
            <div className="bg-dark-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400">Connected</span>
              </div>
              <p className="text-white font-mono text-sm">{formatAddress(walletAddress)}</p>
              <p className="text-gray-400 text-sm mt-1">{parseFloat(walletBalance).toFixed(4)} ETH</p>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-xl border-b border-dark-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-worldcoin-blue to-worldcoin-purple flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="text-white font-bold">Worldex</span>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated && walletAddress && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-300 font-mono">
                  {formatAddress(walletAddress)}
                </span>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-dark-900 pt-16">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-worldcoin-blue/20 text-worldcoin-blue'
                      : 'text-gray-400 hover:bg-dark-800'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              );
            })}
            
            <div className="border-t border-dark-700 my-4" />
            
            {productItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-dark-800 text-white'
                      : 'text-gray-400 hover:bg-dark-800'
                  )}
                >
                  <Icon className={cn('w-5 h-5', item.color)} />
                  {item.label}
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              );
            })}
            
            {!isAuthenticated && (
              <button
                onClick={handleConnect}
                className="w-full btn-primary mt-4 flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
