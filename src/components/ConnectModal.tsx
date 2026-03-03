import { X, Wallet, Globe, Shield } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { useMiniKit } from '../hooks/use-minikit';
import { cn } from '../lib/utils';

export function ConnectModal() {
  const { showConnectModal, setShowConnectModal } = useAppStore();
  const { connect, isLoading, isInstalled }
