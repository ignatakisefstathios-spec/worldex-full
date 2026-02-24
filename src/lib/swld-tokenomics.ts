/**
 * SWLD (StableWorld) Tokenomics
 * Forked from satUSD/River Protocol design
 * 
 * SWLD is an over-collateralized stablecoin pegged to USD
 * Backed by WLD and ETH collateral on World Chain
 */

import { ethers } from 'ethers';

// SWLD Token Configuration
export const SWLD_CONFIG = {
  // Token Basics
  NAME: 'StableWorld Dollar',
  SYMBOL: 'SWLD',
  DECIMALS: 18,
  
  // Collateral Configuration
  COLLATERAL: {
    MIN_RATIO: 1.50,           // 150% minimum collateral ratio
    LIQUIDATION_RATIO: 1.20,   // 120% liquidation threshold
    OPTIMAL_RATIO: 2.00,       // 200% recommended ratio
  },
  
  // Fees
  STABILITY_FEE: 0.02,         // 2% annual stability fee
  LIQUIDATION_PENALTY: 0.13,   // 13% liquidation penalty
  MINT_FEE: 0.001,             // 0.1% mint fee
  
  // Debt Ceiling
  DEBT_CEILING: ethers.parseUnits('100000000', 18), // 100M SWLD max supply
  
  // Collateral Types
  SUPPORTED_COLLATERAL: [
    {
      token: 'WLD',
      address: '0x2cFc85d8E48F8EAB294Ae52D5cF72f17FbCF07b8', // Worldcoin on World Chain
      decimals: 18,
      maxLTV: 0.60,            // 60% loan-to-value
      liquidationThreshold: 0.75,
      stabilityFee: 0.025,     // 2.5% for WLD (higher volatility)
    },
    {
      token: 'ETH',
      address: '0x4200000000000000000000000000000000000006', // WETH on World Chain
      decimals: 18,
      maxLTV: 0.75,            // 75% loan-to-value
      liquidationThreshold: 0.80,
      stabilityFee: 0.015,     // 1.5% for ETH (lower volatility)
    },
    {
      token: 'WBTC',
      address: '0x03C705Bcb5dB5907289b9C7D9166bB9de1E25b9c', // WBTC on World Chain
      decimals: 8,
      maxLTV: 0.70,
      liquidationThreshold: 0.78,
      stabilityFee: 0.018,
    },
  ],
  
  // Price Oracle Configuration
  ORACLE: {
    PRICE_FEED_WLD: '0x...',   // Chainlink WLD/USD
    PRICE_FEED_ETH: '0x...',   // Chainlink ETH/USD
    PRICE_FEED_BTC: '0x...',   // Chainlink BTC/USD
    HEARTBEAT: 3600,           // 1 hour max staleness
    DEVIATION_THRESHOLD: 0.01, // 1% price deviation trigger
  },
  
  // Liquidation Configuration
  LIQUIDATION: {
    BONUS: 0.08,               // 8% liquidation bonus for liquidators
    PENALTY: 0.13,             // 13% total penalty (8% bonus + 5% protocol)
    COOLDOWN: 300,             // 5 min cooldown between liquidations
    MAX_LIQUIDATION: 0.50,     // Max 50% of position per liquidation
  },
  
  // Stability Module (PSM-like)
  PSM: {
    ENABLED: true,
    FEE_IN: 0.001,             // 0.1% fee to mint with USDC
    FEE_OUT: 0.001,            // 0.1% fee to redeem for USDC
    USDC_COLLATERAL: '0x...',
  },
};

// Calculate maximum borrow amount
export function calculateMaxBorrow(
  collateralAmount: bigint,
  collateralPrice: bigint,
  collateralDecimals: number,
  maxLTV: number
): bigint {
  const collateralValue = (collateralAmount * collateralPrice) / BigInt(10 ** collateralDecimals);
  return (collateralValue * BigInt(Math.floor(maxLTV * 10000))) / BigInt(10000);
}

// Calculate collateral ratio
export function calculateCollateralRatio(
  collateralAmount: bigint,
  collateralPrice: bigint,
  collateralDecimals: number,
  debtAmount: bigint
): number {
  if (debtAmount === BigInt(0)) return Infinity;
  
  const collateralValue = (collateralAmount * collateralPrice) / BigInt(10 ** collateralDecimals);
  return Number((collateralValue * BigInt(10000)) / debtAmount) / 100;
}

// Check if position is liquidatable
export function isLiquidatable(
  collateralAmount: bigint,
  collateralPrice: bigint,
  collateralDecimals: number,
  debtAmount: bigint,
  liquidationThreshold: number
): boolean {
  const ratio = calculateCollateralRatio(collateralAmount, collateralPrice, collateralDecimals, debtAmount);
  return ratio < liquidationThreshold * 100;
}

// Calculate liquidation price
export function calculateLiquidationPrice(
  collateralAmount: bigint,
  collateralDecimals: number,
  debtAmount: bigint,
  liquidationThreshold: number
): bigint {
  if (collateralAmount === BigInt(0)) return BigInt(0);
  
  const requiredValue = (debtAmount * BigInt(Math.floor(liquidationThreshold * 100))) / BigInt(100);
  return (requiredValue * BigInt(10 ** collateralDecimals)) / collateralAmount;
}

// Calculate stability fee accrued
export function calculateStabilityFee(
  debtAmount: bigint,
  stabilityFee: number,
  timeElapsed: number // in seconds
): bigint {
  const yearSeconds = 365 * 24 * 60 * 60;
  const fee = (debtAmount * BigInt(Math.floor(stabilityFee * 10000)) * BigInt(timeElapsed)) 
              / BigInt(yearSeconds * 10000);
  return fee;
}

// Arbitrage Pool Configuration
export const ARBITRAGE_POOL_CONFIG = {
  // Only SWLD deposits allowed
  DEPOSIT_TOKEN: 'SWLD',
  
  // Yield Sources
  YIELD_SOURCES: {
    LIQUIDATION_PENALTIES: 0.60,  // 60% from liquidation penalties
    STABILITY_FEES: 0.30,         // 30% from stability fees
    SWAP_FEES: 0.10,              // 10% from DEX swap fees
  },
  
  // APY Targets
  TARGET_APY: {
    MIN: 0.15,  // 15% minimum
    MAX: 0.35,  // 35% maximum
    OPTIMAL: 0.25, // 25% target
  },
  
  // Deposit Limits
  LIMITS: {
    MIN_DEPOSIT: ethers.parseUnits('100', 18),     // 100 SWLD minimum
    MAX_DEPOSIT: ethers.parseUnits('1000000', 18), // 1M SWLD maximum per user
    TOTAL_CAP: ethers.parseUnits('50000000', 18),  // 50M SWLD total cap
  },
  
  // Withdrawal
  WITHDRAWAL: {
    COOLDOWN: 7 * 24 * 60 * 60, // 7 day cooldown
    INSTANT_WITHDRAW_FEE: 0.005, // 0.5% fee for instant withdrawal
  },
};

// Calculate arbitrage pool APY based on protocol revenue
export function calculateArbitrageAPY(
  totalLiquidations24h: bigint,
  totalStabilityFees24h: bigint,
  totalSwapFees24h: bigint,
  poolTVL: bigint
): number {
  if (poolTVL === BigInt(0)) return 0;
  
  const dailyRevenue = totalLiquidations24h + totalStabilityFees24h + totalSwapFees24h;
  const annualRevenue = dailyRevenue * BigInt(365);
  
  return Number((annualRevenue * BigInt(10000)) / poolTVL) / 100;
}

// Flash Loan Configuration (for arbitrageurs)
export const FLASH_LOAN_CONFIG = {
  ENABLED: true,
  FEE: 0.0009, // 0.09% flash loan fee
  MAX_AMOUNT: ethers.parseUnits('10000000', 18), // 10M SWLD max
  SUPPORTED_TOKENS: ['SWLD', 'WLD', 'ETH'],
};
