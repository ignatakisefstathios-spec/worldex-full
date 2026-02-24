/**
 * Worldex Protocol Fee Distribution System
 * 50% Team / 50% Stakers Model
 * 
 * This creates a sustainable revenue model where:
 * - Team is incentivized to grow the protocol
 * - Stakers are rewarded for providing security and liquidity
 */

import { ethers } from 'ethers';

// Fee Distribution Configuration
export const FEE_CONFIG = {
  // Split Configuration
  TEAM_SHARE: 0.50,      // 50% to team
  STAKERS_SHARE: 0.50,   // 50% to stakers
  
  // Wallets
  TEAM_WALLET: '0xf7165cfa4ceccb3f54b07214079bc034ca303b4f',
  STAKING_REWARDS_POOL: '0x...', // Staking rewards contract
  
  // Distribution Settings
  MIN_DISTRIBUTION_AMOUNT: ethers.parseUnits('100', 18), // Min 100 WDX to distribute
  DISTRIBUTION_INTERVAL: 7 * 24 * 60 * 60 * 1000, // Weekly (7 days)
  
  // Emergency Pause
  EMERGENCY_WITHDRAWAL_DELAY: 2 * 24 * 60 * 60, // 2 days delay for emergency
};

// Fee Sources
export const FEE_SOURCES = {
  // Trading Fees
  SWAP_FEE: 0.003,           // 0.3% per swap
  
  // Lending Fees
  LENDING_ORIGINATION_FEE: 0.001,  // 0.1% on loan origination
  LENDING_INTEREST_PROTOCOL_SHARE: 0.10, // 10% of interest goes to protocol
  
  // Liquidation Fees
  LIQUIDATION_PENALTY: 0.13,  // 13% liquidation penalty
  LIQUIDATION_PROTOCOL_SHARE: 0.05, // 5% to protocol (8% to liquidator)
  
  // CDP/Stability Fees
  STABILITY_FEE: 0.02,        // 2% annual on CDP debt
  MINT_FEE: 0.001,            // 0.1% on minting SWLD
  
  // Arbitrage Pool Fees
  ARBITRAGE_PERFORMANCE_FEE: 0.10, // 10% of arbitrage profits
  
  // Withdrawal Fees
  INSTANT_WITHDRAW_FEE: 0.005, // 0.5% for instant withdrawal
};

// Fee Distribution Event
export interface FeeDistributionEvent {
  id: string;
  timestamp: number;
  totalFees: bigint;
  teamShare: bigint;
  stakersShare: bigint;
  breakdown: {
    source: string;
    amount: bigint;
  }[];
  distributed: boolean;
  transactionHash?: string;
}

// Staker Reward Info
export interface StakerReward {
  address: string;
  stakedAmount: bigint;
  sharePercentage: number;
  rewardAmount: bigint;
  claimed: boolean;
  claimTime?: number;
}

// Calculate fee distribution
export function calculateFeeDistribution(
  totalFees: bigint
): { teamShare: bigint; stakersShare: bigint } {
  const teamShare = (totalFees * BigInt(Math.floor(FEE_CONFIG.TEAM_SHARE * 10000))) / BigInt(10000);
  const stakersShare = totalFees - teamShare;
  
  return { teamShare, stakersShare };
}

// Calculate staker rewards (pro-rata based on stake)
export function calculateStakerRewards(
  stakersShare: bigint,
  stakers: { address: string; amount: bigint }[]
): StakerReward[] {
  const totalStaked = stakers.reduce((sum, s) => sum + s.amount, BigInt(0));
  
  if (totalStaked === BigInt(0)) return [];
  
  return stakers.map(staker => {
    const sharePercentage = Number((staker.amount * BigInt(1000000)) / totalStaked) / 10000;
    const rewardAmount = (stakersShare * staker.amount) / totalStaked;
    
    return {
      address: staker.address,
      stakedAmount: staker.amount,
      sharePercentage,
      rewardAmount,
      claimed: false,
    };
  });
}

// Calculate swap fee
export function calculateSwapFee(
  amount: bigint,
  feeTier: number = FEE_SOURCES.SWAP_FEE
): bigint {
  return (amount * BigInt(Math.floor(feeTier * 10000))) / BigInt(10000);
}

// Calculate lending protocol revenue
export function calculateLendingRevenue(
  interestAccrued: bigint
): { protocolShare: bigint; lendersShare: bigint } {
  const protocolShare = (interestAccrued * BigInt(Math.floor(FEE_SOURCES.LENDING_INTEREST_PROTOCOL_SHARE * 10000))) / BigInt(10000);
  const lendersShare = interestAccrued - protocolShare;
  
  return { protocolShare, lendersShare };
}

// Calculate liquidation revenue split
export function calculateLiquidationSplit(
  totalPenalty: bigint,
  collateralAmount: bigint
): { liquidatorBonus: bigint; protocolShare: bigint; arbitragePoolShare: bigint } {
  // 8% to liquidator
  const liquidatorBonus = (collateralAmount * BigInt(800)) / BigInt(10000);
  
  // 5% to protocol (goes into fee distribution)
  const protocolShare = (totalPenalty * BigInt(500)) / BigInt(10000);
  
  // Remaining goes to arbitrage pool
  const arbitragePoolShare = totalPenalty - liquidatorBonus - protocolShare;
  
  return { liquidatorBonus, protocolShare, arbitragePoolShare };
}

// Weekly fee distribution tracker
export interface WeeklyDistribution {
  weekStart: number;
  weekEnd: number;
  totalFees: bigint;
  swapFees: bigint;
  lendingFees: bigint;
  liquidationFees: bigint;
  stabilityFees: bigint;
  teamDistributed: bigint;
  stakersDistributed: bigint;
  stakerCount: number;
}

// Generate weekly report
export function generateWeeklyReport(
  distributions: WeeklyDistribution[]
): {
  totalFeesAllTime: bigint;
  averageWeeklyFees: bigint;
  teamTotalReceived: bigint;
  stakersTotalReceived: bigint;
  topFeeSource: string;
} {
  const totalFeesAllTime = distributions.reduce((sum, d) => sum + d.totalFees, BigInt(0));
  const teamTotalReceived = distributions.reduce((sum, d) => sum + d.teamDistributed, BigInt(0));
  const stakersTotalReceived = distributions.reduce((sum, d) => sum + d.stakersDistributed, BigInt(0));
  
  const averageWeeklyFees = distributions.length > 0 
    ? totalFeesAllTime / BigInt(distributions.length)
    : BigInt(0);
  
  // Find top fee source
  const swapTotal = distributions.reduce((sum, d) => sum + d.swapFees, BigInt(0));
  const lendingTotal = distributions.reduce((sum, d) => sum + d.lendingFees, BigInt(0));
  const liquidationTotal = distributions.reduce((sum, d) => sum + d.liquidationFees, BigInt(0));
  const stabilityTotal = distributions.reduce((sum, d) => sum + d.stabilityFees, BigInt(0));
  
  const sources = [
    { name: 'Swap Fees', total: swapTotal },
    { name: 'Lending Fees', total: lendingTotal },
    { name: 'Liquidation Fees', total: liquidationTotal },
    { name: 'Stability Fees', total: stabilityTotal },
  ];
  
  const topFeeSource = sources.sort((a, b) => (b.total > a.total ? 1 : -1))[0]?.name || 'None';
  
  return {
    totalFeesAllTime,
    averageWeeklyFees,
    teamTotalReceived,
    stakersTotalReceived,
    topFeeSource,
  };
}

// Fee Distribution Contract ABI (simplified)
export const FEE_DISTRIBUTOR_ABI = [
  'function distributeFees() external',
  'function claimRewards() external',
  'function getPendingRewards(address staker) external view returns (uint256)',
  'function getTotalFeesAccumulated() external view returns (uint256)',
  'function getTeamWallet() external view returns (address)',
  'function getStakingPool() external view returns (address)',
  'event FeesDistributed(uint256 teamAmount, uint256 stakersAmount, uint256 timestamp)',
  'event RewardsClaimed(address indexed staker, uint256 amount)',
];
