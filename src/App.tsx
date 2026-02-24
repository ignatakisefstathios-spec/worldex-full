import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './store/app-store';
import { useMiniKit } from './hooks/use-minikit';

// Layouts
import { MainLayout } from './components/layouts/MainLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { PoolsPage } from './pages/PoolsPage';
import { SwapPage } from './pages/SwapPage';
import { AirdropPage } from './pages/AirdropPage';
import { StakingPage } from './pages/StakingPage';
import { CDPPage } from './pages/CDPPage';
import { ArbitragePage } from './pages/ArbitragePage';
import { SafetyPage } from './pages/SafetyPage';
import { LendingPage } from './pages/LendingPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { SettingsPage } from './pages/SettingsPage';

// Components
import { ConnectModal } from './components/ConnectModal';
import { ToastContainer } from './components/ToastContainer';

function App() {
  const { isAuthenticated, walletAddress, setWalletBalance } = useAppStore();
  const { isInstalled } = useMiniKit();

  // Fetch wallet balance
  useEffect(() => {
    if (walletAddress && typeof window !== 'undefined') {
      const fetchBalance = async () => {
        try {
          const provider = new (await import('ethers')).ethers.JsonRpcProvider(
            'https://worldchain-mainnet.g.alchemy.com/public'
          );
          const balance = await provider.getBalance(walletAddress);
          setWalletBalance(import('ethers').then(e => e.ethers.formatEther(balance)));
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };
      fetchBalance();
    }
  }, [walletAddress, setWalletBalance]);

  return (
    <div className="mini-app-container bg-dark-900 min-h-screen">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:productId" element={<ProductsPage />} />
          <Route path="pools" element={<PoolsPage />} />
          <Route path="swap" element={<SwapPage />} />
          <Route path="airdrop" element={<AirdropPage />} />
          <Route path="staking" element={<StakingPage />} />
          <Route path="cdp" element={<CDPPage />} />
          <Route path="arbitrage" element={<ArbitragePage />} />
          <Route path="safety" element={<SafetyPage />} />
          <Route path="lending" element={<LendingPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      
      <ConnectModal />
      <ToastContainer />
    </div>
  );
}

export default App;
