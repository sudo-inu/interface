import { BaseProvider } from '@ethersproject/providers'
import {
  Token,
  ChainId,
  Fetcher,
  Route,
  Trade,
  TokenAmount,
} from '@uniswap/sdk'
import { UniswapV2Pair__factory } from 'contracts'
import { BigNumber } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import stringToBigNumber from './stringToBigNumber'

const ONE_E_18 = BigNumber.from('1' + '0'.repeat(18))
const WETH = new Token(
  ChainId.MAINNET,
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  18
)

export async function getUniV2Price(
  tokenAddress: string,
  provider?: BaseProvider | undefined
): Promise<string> {
  const token = new Token(ChainId.MAINNET, getAddress(tokenAddress), 18)
  const pair = await Fetcher.fetchPairData(token, WETH, provider)

  const sellRoute = new Route([pair], token)
  const sellTrade = Trade.exactIn(
    sellRoute,
    new TokenAmount(token, BigInt(1e18))
  )

  return sellTrade.executionPrice.toSignificant(18)
}

export async function getUniV2LpTokenPrice(
  tokenAddress: string,
  provider: BaseProvider
): Promise<BigNumber> {
  const lpContract = UniswapV2Pair__factory.connect(tokenAddress, provider)

  const tokenA = await lpContract.token0()
  const tokenB = await lpContract.token1()

  let tokenAPrice
  let tokenBPrice

  if (tokenA == WETH.address) {
    tokenAPrice = '1'
  } else {
    tokenAPrice = await getUniV2Price(tokenA, provider)
  }

  if (tokenB == WETH.address) {
    tokenBPrice = '1'
  } else {
    tokenBPrice = await getUniV2Price(tokenB, provider)
  }

  const reserves = await lpContract.getReserves()
  const totalSupply = await lpContract.totalSupply()

  const supplyTokenA = reserves._reserve0
  const supplyTokenB = reserves._reserve1

  const tokenAPerLp = supplyTokenA.mul(ONE_E_18).div(totalSupply)
  const tokenBPerLp = supplyTokenB.mul(ONE_E_18).div(totalSupply)

  const tokenAPriceBn = stringToBigNumber(tokenAPrice, 18)
  const tokenBPriceBn = stringToBigNumber(tokenBPrice, 18)

  const lpTokenAPrice = tokenAPerLp.mul(tokenAPriceBn).div(ONE_E_18)
  const lpTokenBPrice = tokenBPerLp.mul(tokenBPriceBn).div(ONE_E_18)

  return lpTokenAPrice.add(lpTokenBPrice)
}

export default getUniV2Price
