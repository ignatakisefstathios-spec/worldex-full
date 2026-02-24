export interface User {
  id: string;
  walletAddress: string;
  worldId: string | null;
  verified: boolean;
  createdAt: string;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  price: number;
  priceChange24h: number;
  balance?: string;
}

export interface Pool {
  id: string;
  name: string;
  token: Token;
  tvl: number;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  userDeposit?: string;
  userEarnings?: string;
  depositToken: string;
  minDeposit: string;
  lockPeriod?: number;
}

export interface Position {
  id: string;
  poolId: string;
  amount: string;
  entryPrice: number;
  currentValue: number;
  pnl: number;
  pnlPercentage: number;
  openedAt: string;
  apy: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'claim' | 'swap' | 'stake' | 'unstake';
  amount: string;
  token: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  timestamp: string;
  gasFee?: string;
}

export interface AirdropAllocation {
  category: string;
  percentage: number;
  amount: number;
  description: string;
  vesting?: {
    enabled: boolean;
    cliffMonths: number;
    durationMonths: number;
  };
}

export interface StakingPosition {
  id: string;
  amount: string;
  stakedAt: string;
  unlockTime?: string;
  rewards: string;
  apy: number;
}

export interface ArbitrageOpportunity {
  id: string;
  pair: string;
  profitPercentage: number;
  expectedProfit: string;
  route: string[];
  timestamp: string;
}

export interface SafetyScore {
  overall: number;
  contractSecurity: number;
  liquidityRisk: number;
  volatilityRisk: number;
  centralizationRisk: number;
}

export interface CDP {
  id: string;
  collateralToken: string;
  collateralAmount: string;
  debtAmount: string;
  collateralRatio: number;
  liquidationPrice: number;
  status: 'safe' | 'warning' | 'danger';
}

export interface FeeDistribution {
  totalFees: string;
  teamShare: string;
  stakersShare: string;
  distributedAt: string;
}

export type ProductType = 'lwld' | 'leth' | 'swld' | 'arbitrage' | 'safety' | 'lending';

export interface Product {
  id: ProductType;
  name: string;
  description: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  icon: string;
  color: string;
}
