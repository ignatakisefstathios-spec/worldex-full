import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useAppStore } from '../store/app-store';

// Contract ABIs (simplified)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
  'event Approval(address indexed owner, address indexed spender, uint256 amount)',
];

const POOL_ABI = [
  'function deposit(uint256 amount) external',
  'function withdraw(uint256 amount) external',
  'function claimRewards() external',
  'function balanceOf(address account) view returns (uint256)',
  'function earned(address account) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function apy() view returns (uint256)',
];

const STAKING_ABI = [
  'function stake(uint256 amount) external',
  'function unstake(uint256 amount) external',
  'function claimRewards() external',
  'function getRewards(address account) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
];

export function useContracts() {
  const { walletAddress } = useAppStore();

  const getProvider = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    // Try to get provider from window.ethereum
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      return new ethers.BrowserProvider(ethereum);
    }
    
    // Fallback to read-only provider
    return new ethers.JsonRpcProvider('https://worldchain-mainnet.g.alchemy.com/public');
  }, []);

  const getSigner = useCallback(async () => {
    const provider = getProvider();
    if (!provider || !(provider instanceof ethers.BrowserProvider)) {
      throw new Error('No wallet connected');
    }
    return provider.getSigner();
  }, [getProvider]);

  // Get token balance
  const getTokenBalance = useCallback(async (tokenAddress: string): Promise<string> => {
    if (!walletAddress) return '0';
    
    try {
      const provider = getProvider();
      if (!provider) return '0';
      
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const balance = await token.balanceOf(walletAddress);
      const decimals = await token.decimals();
      
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }, [walletAddress, getProvider]);

  // Get ETH balance
  const getEthBalance = useCallback(async (): Promise<string> => {
    if (!walletAddress) return '0';
    
    try {
      const provider = getProvider();
      if (!provider) return '0';
      
      const balance = await provider.getBalance(walletAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting ETH balance:', error);
      return '0';
    }
  }, [walletAddress, getProvider]);

  // Approve token spending
  const approveToken = useCallback(async (
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ): Promise<{ success: boolean; hash?: string; error?: string }> => {
    try {
      const signer = await getSigner();
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      
      const decimals = await token.decimals();
      const amountBN = ethers.parseUnits(amount, decimals);
      
      const tx = await token.approve(spenderAddress, amountBN);
      const receipt = await tx.wait();
      
      return { success: true, hash: receipt?.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [getSigner]);

  // Check allowance
  const checkAllowance = useCallback(async (
    tokenAddress: string,
    spenderAddress: string
  ): Promise<string> => {
    if (!walletAddress) return '0';
    
    try {
      const provider = getProvider();
      if (!provider) return '0';
      
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const allowance = await token.allowance(walletAddress, spenderAddress);
      const decimals = await token.decimals();
      
      return ethers.formatUnits(allowance, decimals);
    } catch (error) {
      console.error('Error checking allowance:', error);
      return '0';
    }
  }, [walletAddress, getProvider]);

  // Deposit to pool
  const depositToPool = useCallback(async (
    poolAddress: string,
    amount: string,
    tokenDecimals: number = 18
  ): Promise<{ success: boolean; hash?: string; error?: string }> => {
    try {
      const signer = await getSigner();
      const pool = new ethers.Contract(poolAddress, POOL_ABI, signer);
      
      const amountBN = ethers.parseUnits(amount, tokenDecimals);
      const tx = await pool.deposit(amountBN);
      const receipt = await tx.wait();
      
      return { success: true, hash: receipt?.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [getSigner]);

  // Withdraw from pool
  const withdrawFromPool = useCallback(async (
    poolAddress: string,
    amount: string,
    tokenDecimals: number = 18
  ): Promise<{ success: boolean; hash?: string; error?: string }> => {
    try {
      const signer = await getSigner();
      const pool = new ethers.Contract(poolAddress, POOL_ABI, signer);
      
      const amountBN = ethers.parseUnits(amount, tokenDecimals);
      const tx = await pool.withdraw(amountBN);
      const receipt = await tx.wait();
      
      return { success: true, hash: receipt?.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [getSigner]);

  // Stake tokens
  const stakeTokens = useCallback(async (
    stakingAddress: string,
    amount: string,
    tokenDecimals: number = 18
  ): Promise<{ success: boolean; hash?: string; error?: string }> => {
    try {
      const signer = await getSigner();
      const staking = new ethers.Contract(stakingAddress, STAKING_ABI, signer);
      
      const amountBN = ethers.parseUnits(amount, tokenDecimals);
      const tx = await staking.stake(amountBN);
      const receipt = await tx.wait();
      
      return { success: true, hash: receipt?.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [getSigner]);

  // Unstake tokens
  const unstakeTokens = useCallback(async (
    stakingAddress: string,
    amount: string,
    tokenDecimals: number = 18
  ): Promise<{ success: boolean; hash?: string; error?: string }> => {
    try {
      const signer = await getSigner();
      const staking = new ethers.Contract(stakingAddress, STAKING_ABI, signer);
      
      const amountBN = ethers.parseUnits(amount, tokenDecimals);
      const tx = await staking.unstake(amountBN);
      const receipt = await tx.wait();
      
      return { success: true, hash: receipt?.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [getSigner]);

  // Claim rewards
  const claimRewards = useCallback(async (
    contractAddress: string,
    contractType: 'pool' | 'staking' = 'pool'
  ): Promise<{ success: boolean; hash?: string; amount?: string; error?: string }> => {
    try {
      const signer = await getSigner();
      const abi = contractType === 'pool' ? POOL_ABI : STAKING_ABI;
      const contract = new ethers.Contract(contractAddress, abi, signer);
      
      const tx = await contract.claimRewards();
      const receipt = await tx.wait();
      
      // Parse claimed amount from event (simplified)
      return { success: true, hash: receipt?.hash, amount: '0' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [getSigner]);

  return {
    getProvider,
    getSigner,
    getTokenBalance,
    getEthBalance,
    approveToken,
    checkAllowance,
    depositToPool,
    withdrawFromPool,
    stakeTokens,
    unstakeTokens,
    claimRewards,
  };
}
