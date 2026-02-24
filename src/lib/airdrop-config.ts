/**
 * Worldex Protocol Airdrop Configuration
 * Based on research from successful airdrops: Arbitrum, Optimism, EigenLayer, Ethena
 * 
 * Key Design Principles:
 * 1. User Airdrop: Vested with real-time rewards (prevents dumps, rewards loyalty)
 * 2. Team Airdrop: 50% instant, 50% vested over 4 years (aligns long-term interests)
 * 3. Fee Distribution: 50% team, 50% stakers (sustainable revenue model)
 */

// Total WDX Supply: 300M tokens
export const WDX_TOTAL_SUPPLY = 300_000_000;

// Team Wallet Address (provided by user)
export const TEAM_WALLET = '0xf7165cfa4ceccb3f54b07214079bc034ca303b4f';

// Team Airdrop Configuration
// 10% of total supply = 30M WDX
export const TEAM_AIRDROP = {
  WALLET: TEAM_WALLET,
  TOTAL: 30_000_000,
  INSTANT_DROP: 15_000_000, // 50% available immediately
  VESTED: 15_000_000,       // 50% vested over 4 years
  VESTING: {
    DURATION_YEARS: 4,
    CLIFF_MONTHS: 12,       // 1 year cliff before any vesting
    MONTHLY_UNLOCK: 15_000_000 / 36, // ~416,667 WDX per month after cliff
  },
};

// User Airdrop Configuration
// 15% of total supply = 45M WDX (vested with real-time staking rewards)
export const USER_AIRDROP = {
  TOTAL: 45_000_000,
  VESTING: {
    ENABLED: true,
    DURATION_MONTHS: 12,    // 12 month linear vesting
    CLIFF_DAYS: 7,          // 7 day cliff before vesting starts
    REALTIME_REWARDS: true, // Users earn rewards immediately
    REWARD_APY: 0.15,       // 15% APY on vested tokens
    IMMEDIATE_CLAIMABLE: 0, // 0% immediately claimable (full vesting)
  },
  ELIGIBILITY: {
    WORLD_ID_VERIFIED: true,
    MIN_WALLET_AGE_DAYS: 30,
    MIN_TRANSACTIONS: 5,
  },
};

// Ecosystem & Partnership Allocation
// 20% = 60M WDX
export const ECOSYSTEM_ALLOCATION = {
  TOTAL: 60_000_000,
  BREAKDOWN: {
    LIQUIDITY_INCENTIVES: 30_000_000,  // 50% - DEX liquidity mining
    PARTNERSHIPS: 15_000_000,          // 25% - Strategic partnerships
    GRANTS: 10_000_000,                // 17% - Developer grants
    MARKETING: 5_000_000,              // 8% - Marketing campaigns
  },
};

// Treasury Allocation
// 25% = 75M WDX (governance controlled)
export const TREASURY_ALLOCATION = {
  TOTAL: 75_000_000,
  VESTING: {
    ENABLED: true,
    DURATION_YEARS: 5,
    CLIFF_MONTHS: 6,
  },
};

// Staking Rewards Allocation
// 20% = 60M WDX (emitted over 5 years)
export const STAKING_REWARDS = {
  TOTAL: 60_000_000,
  EMISSION_SCHEDULE: {
    YEAR_1: 24_000_000,  // 40% - highest inflation early
    YEAR_2: 15_000_000,  // 25%
    YEAR_3: 12_000_000,  // 20%
    YEAR_4: 6_000_000,   // 10%
    YEAR_5: 3_000_000,   // 5%
  },
};

// Advisors & Early Contributors
// 10% = 30M WDX
export const ADVISOR_ALLOCATION = {
  TOTAL: 30_000_000,
  VESTING: {
    DURATION_YEARS: 3,
    CLIFF_MONTHS: 12,
  },
};

// Full Token Distribution
export const TOKEN_DISTRIBUTION = [
  { category: 'User Airdrop', percentage: 15, amount: 45_000_000, color: '#0052FF' },
  { category: 'Team', percentage: 10, amount: 30_000_000, color: '#8B5CF6' },
  { category: 'Ecosystem', percentage: 20, amount: 60_000_000, color: '#06B6D4' },
  { category: 'Treasury', percentage: 25, amount: 75_000_000, color: '#10B981' },
  { category: 'Staking Rewards', percentage: 20, amount: 60_000_000, color: '#F59E0B' },
  { category: 'Advisors', percentage: 10, amount: 30_000_000, color: '#EC4899' },
];

// Anti-Sybil Protection Measures
export const ANTISYBIL_MEASURES = {
  WORLD_ID_VERIFICATION: true,
  MINIMUM_WALLET_AGE_DAYS: 30,
  MINIMUM_TRANSACTION_COUNT: 5,
  UNIQUE_DEVICE_CHECK: true,
  BEHAVIORAL_ANALYSIS: true,
  BLACKLISTED_ADDRESSES: [], // Known bot addresses
};

// Calculate vested amount at given timestamp
export function calculateVestedAmount(
  totalAmount: number,
  startTime: number,
  cliffMonths: number,
  durationMonths: number,
  currentTime: number = Date.now()
): number {
  const cliffMs = cliffMonths * 30 * 24 * 60 * 60 * 1000;
  const durationMs = durationMonths * 30 * 24 * 60 * 60 * 1000;
  
  if (currentTime < startTime + cliffMs) {
    return 0; // Still in cliff period
  }
  
  const timeSinceCliff = currentTime - (startTime + cliffMs);
  
  if (timeSinceCliff >= durationMs) {
    return totalAmount; // Fully vested
  }
  
  return (timeSinceCliff / durationMs) * totalAmount;
}

// Calculate real-time rewards for vested position
export function calculateRealtimeRewards(
  amount: number,
  apy: number,
  stakedTime: number,
  currentTime: number = Date.now()
): number {
  const timeDiff = currentTime - stakedTime;
  const yearMs = 365 * 24 * 60 * 60 * 1000;
  return amount * apy * (timeDiff / yearMs);
}

// Fee Distribution Configuration
export const FEE_DISTRIBUTION = {
  TEAM_SHARE: 0.50,     // 50% to team wallet
  STAKERS_SHARE: 0.50,  // 50% to stakers (pro-rata)
  TEAM_WALLET: TEAM_WALLET,
  DISTRIBUTION_INTERVAL: 7 * 24 * 60 * 60 * 1000, // Weekly distribution
};

// Airdrop Claim Schedule (prevents immediate dumps)
export const CLAIM_SCHEDULE = {
  PHASE_1: {
    name: 'Early Adopters',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    multiplier: 1.5,
  },
  PHASE_2: {
    name: 'Active Users',
    startDate: '2024-03-15',
    endDate: '2024-04-01',
    multiplier: 1.2,
  },
  PHASE_3: {
    name: 'General Public',
    startDate: '2024-04-01',
    endDate: '2024-05-01',
    multiplier: 1.0,
  },
};
