import { X, Wallet, Globe, Shield } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { useMiniKit } from '../hooks/use-minikit';
import { cn } from '../lib/utils';

export function ConnectModal() {
  const { showConnectModal, setShowConnectModal } = useAppStore();
  const { connect, isLoading, isInstalled } = useMiniKit();

  if (!showConnectModal) return null;

  const handleConnect = async () => {
    // If not in World App, redirect to open it
    if (!isInstalled) {
      const appId = 'app_aa859437d880d7c1419933a0c93e3bac
