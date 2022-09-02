import { chainId } from 'wagmi'
import contracts, { SupportedChains } from './contracts'

export type ContractAddress = {
  [chainId in SupportedChains]: string
}

export enum TokenType {
  ERC20,
  ERC721,
  WETH,
}

export enum PoolId {
  XMON_SNACK_UNIV2_LP = 0,
  WRAPPED_XMINU_ERC20 = 1,
  SNACK_ERC20 = 2,
  SUDO_XMINU_BUY_WALL_LP_ERC20 = 3,
  SUDO_XMINU_HIGH_FEE_TRADE_LP_ERC20 = 4,
  ETH_SNACK_UNIV2_LP = 5,
}

export enum SudoswapPoolType {
  TOKEN = 'Buy-side',
  NFT = 'Sell-side',
  TRADE = 'Trade',
}

export enum SudoswapCurveType {
  LINEAR = 'Linear',
  EXPONENTIAL = 'Exponential',
}

export interface Pool {
  pid: number
  slug: string
  emoji: string
  name: string
  token: string
  rewards: string
  exponential?: boolean
  transferToken?: string
  tokenAddressA?: ContractAddress
  tokenTypeA?: TokenType
  tokenAddressB?: ContractAddress
  tokenTypeB?: TokenType
  lpAddress: ContractAddress
  controllerAddress?: ContractAddress
  sudoswapPool?: {
    type: SudoswapPoolType
    curve: SudoswapCurveType
    nft: ContractAddress
    minimumDeposit: string
  }
}

export const pools: Pool[] = [
  {
    pid: PoolId.XMON_SNACK_UNIV2_LP,
    slug: 'snack-fest',
    emoji: '🦑🍪',
    name: 'Snack Fest!',
    token: 'SNACK/XMON Uni-v2 LP',
    rewards: '10x',
    lpAddress: {
      [chainId.mainnet]: contracts[chainId.mainnet].XMON_SNACK_UNIV2_LP,
      [chainId.rinkeby]: contracts[chainId.rinkeby].XMON_SNACK_UNIV2_LP,
    },
  },
  {
    pid: PoolId.SUDO_XMINU_BUY_WALL_LP_ERC20,
    slug: 'saudis',
    emoji: '🐶💪',
    name: 'Sudo Inu Saudis',
    token: 'Sudo INU Buy Wall LP',
    rewards: '25x',
    exponential: true,
    transferToken: 'Sudo INU Buy-Side SudoSwap LP',
    lpAddress: {
      [chainId.mainnet]:
        contracts[chainId.mainnet].SUDO_XMINU_BUY_WALL_LP_ERC20,
      [chainId.rinkeby]:
        contracts[chainId.rinkeby].SUDO_XMINU_BUY_WALL_LP_ERC20,
    },
    controllerAddress: {
      [chainId.mainnet]: contracts[chainId.mainnet].BUY_WALL_CONTROLLER,
      [chainId.rinkeby]: contracts[chainId.rinkeby].BUY_WALL_CONTROLLER,
    },
    sudoswapPool: {
      type: SudoswapPoolType.TOKEN,
      curve: SudoswapCurveType.LINEAR,
      nft: {
        [chainId.mainnet]: contracts[chainId.mainnet].XMINU_ERC721,
        [chainId.rinkeby]: contracts[chainId.rinkeby].XMINU_ERC721,
      },
      minimumDeposit: '0.05 ETH',
    },
  },
  {
    pid: PoolId.SUDO_XMINU_HIGH_FEE_TRADE_LP_ERC20,
    slug: 'interesting',
    emoji: '🐕',
    name: 'Interesting...aaaaaaaa',
    token: 'Sudo INU High-Fee Trade Pool LP',
    rewards: '10x',
    exponential: true,
    transferToken: 'Sudo INU Trade SudoSwap LP',
    lpAddress: {
      [chainId.mainnet]:
        contracts[chainId.mainnet].SUDO_XMINU_HIGH_FEE_TRADE_LP_ERC20,
      [chainId.rinkeby]:
        contracts[chainId.rinkeby].SUDO_XMINU_HIGH_FEE_TRADE_LP_ERC20,
    },
    controllerAddress: {
      [chainId.mainnet]: contracts[chainId.mainnet].HIGH_FEE_TRADE_CONTROLLER,
      [chainId.rinkeby]: contracts[chainId.rinkeby].HIGH_FEE_TRADE_CONTROLLER,
    },
    sudoswapPool: {
      type: SudoswapPoolType.TRADE,
      curve: SudoswapCurveType.EXPONENTIAL,
      nft: {
        [chainId.mainnet]: contracts[chainId.mainnet].XMINU_ERC721,
        [chainId.rinkeby]: contracts[chainId.rinkeby].XMINU_ERC721,
      },
      minimumDeposit: '0.1 ETH or 1 Sudo INU NFT',
    },
  },
  {
    pid: PoolId.SNACK_ERC20,
    slug: 'snack-time',
    emoji: '🍪',
    name: 'Snack Time',
    token: 'SNACK',
    rewards: '2.5x',
    lpAddress: {
      [chainId.mainnet]: contracts[chainId.mainnet].SNACK_ERC20,
      [chainId.rinkeby]: contracts[chainId.rinkeby].SNACK_ERC20,
    },
  },
  {
    pid: PoolId.WRAPPED_XMINU_ERC20,
    slug: 'pups',
    emoji: '🐶',
    name: 'Sudo Inu Pups',
    token: 'Wrapped Sudo INU NFT',
    rewards: '2x',
    lpAddress: {
      [chainId.mainnet]: contracts[chainId.mainnet].WRAPPED_XMINU_ERC20,
      [chainId.rinkeby]: contracts[chainId.rinkeby].WRAPPED_XMINU_ERC20,
    },
  },
  {
    pid: PoolId.ETH_SNACK_UNIV2_LP,
    slug: 'snack-party',
    emoji: '🐈🍪',
    name: 'Snack Party!',
    token: 'SNACK/ETH Uni-v2 LP',
    rewards: '10x',
    lpAddress: {
      [chainId.mainnet]: contracts[chainId.mainnet].ETH_SNACK_UNIV2_LP,
      [chainId.rinkeby]: contracts[chainId.rinkeby].ETH_SNACK_UNIV2_LP,
    },
  },
]

export default pools
