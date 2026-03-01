import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'

export const worldChain = defineChain({
  id: 480,
  name: 'World Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://worldchain-mainnet.g.alchemy.com/public'] },
  },
})
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [worldChain],
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
  transports: {
    [worldChain.id]: http('https://worldchain-mainnet.g.alchemy.com/public'),
  },
})

export const WORLD_CHAIN_CONFIG = {
  chainId: 480,
  rpcUrl: 'https://worldchain-mainnet.g.alchemy.com/public',
  explorerUrl: 'https://worldscan.org',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
}
