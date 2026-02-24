import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Pool, Position, Transaction, Product, CDP, StakingPosition } from '../types';

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  isWorldIDVerified: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setWorldIDVerified: (value: boolean) => void;
  
  // Wallet
  walletAddress: string | null;
  walletBalance: string;
  setWalletAddress: (address: string | null) => void;
  setWalletBalance: (balance: string) => void;
  
  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  
  // Pools
  pools: Pool[];
  userPools: Pool[];
  setPools: (pools: Pool[]) => void;
  setUserPools: (pools: Pool[]) => void;
  
  // Positions
  positions: Position[];
  addPosition: (position: Position) => void;
  removePosition: (id: string) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  
  // Staking
  stakingPositions: StakingPosition[];
  addStakingPosition: (position: StakingPosition) => void;
  updateStakingRewards: (id: string, rewards: string) => void;
  
  // CDPs
  cdps: CDP[];
  addCDP: (cdp: CDP) => void;
  updateCDP: (id: string, updates: Partial<CDP>) => void;
  removeCDP: (id: string) => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  
  // UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  showConnectModal: boolean;
  setShowConnectModal: (value: boolean) => void;
  
  // Airdrop
  airdropClaimed: boolean;
  airdropAmount: string;
  setAirdropClaimed: (value: boolean) => void;
  setAirdropAmount: (amount: string) => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isWorldIDVerified: false,
  walletAddress: null,
  walletBalance: '0',
  products: [],
  pools: [],
  userPools: [],
  positions: [],
  stakingPositions: [],
  cdps: [],
  transactions: [],
  activeTab: 'dashboard',
  isLoading: false,
  showConnectModal: false,
  airdropClaimed: false,
  airdropAmount: '0',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setUser: (user) => set({ user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setWorldIDVerified: (value) => set({ isWorldIDVerified: value }),
      
      setWalletAddress: (address) => set({ walletAddress: address }),
      setWalletBalance: (balance) => set({ walletBalance: balance }),
      
      setProducts: (products) => set({ products }),
      
      setPools: (pools) => set({ pools }),
      setUserPools: (pools) => set({ userPools: pools }),
      
      addPosition: (position) => set((state) => ({ 
        positions: [...state.positions, position] 
      })),
      removePosition: (id) => set((state) => ({ 
        positions: state.positions.filter((p) => p.id !== id) 
      })),
      updatePosition: (id, updates) => set((state) => ({
        positions: state.positions.map((p) => 
          p.id === id ? { ...p, ...updates } : p
        ),
      })),
      
      addStakingPosition: (position) => set((state) => ({
        stakingPositions: [...state.stakingPositions, position],
      })),
      updateStakingRewards: (id, rewards) => set((state) => ({
        stakingPositions: state.stakingPositions.map((p) =>
          p.id === id ? { ...p, rewards } : p
        ),
      })),
      
      addCDP: (cdp) => set((state) => ({ cdps: [...state.cdps, cdp] })),
      updateCDP: (id, updates) => set((state) => ({
        cdps: state.cdps.map((c) => c.id === id ? { ...c, ...updates } : c),
      })),
      removeCDP: (id) => set((state) => ({
        cdps: state.cdps.filter((c) => c.id !== id),
      })),
      
      addTransaction: (tx) => set((state) => ({
        transactions: [tx, ...state.transactions].slice(0, 50),
      })),
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      })),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      setIsLoading: (value) => set({ isLoading: value }),
      setShowConnectModal: (value) => set({ showConnectModal: value }),
      
      setAirdropClaimed: (value) => set({ airdropClaimed: value }),
      setAirdropAmount: (amount) => set({ airdropAmount: amount }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'worldex-storage',
      partialize: (state) => ({
        user: state.user,
        isWorldIDVerified: state.isWorldIDVerified,
        walletAddress: state.walletAddress,
        airdropClaimed: state.airdropClaimed,
        airdropAmount: state.airdropAmount,
        transactions: state.transactions.slice(0, 10),
      }),
    }
  )
);
