import { BaseProvider } from '@ethersproject/providers'
import { useCallback, useEffect, useState } from 'react'
import { Contract, BigNumber } from 'ethers'
import { erc20ABI, useAccount, useProvider } from 'wagmi'

import contracts from 'constants/contracts'
import pools, { Pool } from 'constants/pools'
import { SnackShackAbi } from 'constants/abi'
import { useChainId } from 'hooks'
import getUniV2Price, { getUniV2LpTokenPrice } from 'utils/getUniV2Price'
import getOpenseaPrice from 'utils/getOpenseaPrice'
import getFarm from 'utils/getFarm'
import stringToBigNumber from 'utils/stringToBigNumber'

export interface StakedValue {
  tokenAmount: BigNumber
  tokenPriceInWeth: BigNumber
  totalWethValue: BigNumber
  poolWeight: BigNumber
}

export enum TokenType {
  ERC20,
  UNIV2,
  ERC721,
  ETH,
}

const tokenType = {
  0: TokenType.UNIV2,
  1: TokenType.ERC721,
  2: TokenType.ERC20,
  3: TokenType.ETH,
  4: TokenType.ETH,
  5: TokenType.UNIV2,
}

const tokenPrice = {
  0: BigNumber.from('20000000000000'),
  1: BigNumber.from('100000000000000000'),
  2: BigNumber.from('5000000000'),
  3: BigNumber.from('50000000000000000'),
  4: BigNumber.from('100000000000000000'),
  5: BigNumber.from('200000000000000'),
}

export const getTotalLPWethValue = async (
  provider: BaseProvider,
  snackShackContract: Contract,
  lpTokenContract: Contract,
  pid: number
) => {
  const tokenHolder = await snackShackContract.approvalTarget(pid)
  // Get balance of the token address
  const tokenAmount = await lpTokenContract.balanceOf(tokenHolder)
  const pool = getFarm(pid)

  const { allocPoint } = await snackShackContract.poolInfo(pid)
  const totalAllocPoint = await snackShackContract.totalAllocPoint()

  const poolWeight = BigNumber.from(allocPoint)
    .mul(BigNumber.from(100))
    .div(BigNumber.from(totalAllocPoint))

  let tokenPriceInWeth = BigNumber.from(
    tokenPrice[pid as keyof typeof tokenPrice]
  )

  if (tokenType[pid as keyof typeof tokenType] == TokenType.ERC721) {
    try {
      const openSeaPrice = await getOpenseaPrice(pool?.openseaSlug ?? '')
      tokenPriceInWeth = stringToBigNumber(openSeaPrice, 18)
    } catch (err) {
      console.error('Error fetching Opensea price: ', err)
    }
  }

  if (tokenType[pid as keyof typeof tokenType] == TokenType.ERC20) {
    try {
      const uniPrice: string = await getUniV2Price(
        lpTokenContract.address,
        provider
      )
      tokenPriceInWeth = stringToBigNumber(uniPrice, 18)
    } catch (err) {
      console.error('Error fetching Uni-v2 price: ', err)
    }
  }

  if (tokenType[pid as keyof typeof tokenType] == TokenType.UNIV2) {
    try {
      const lpPrice: BigNumber = await getUniV2LpTokenPrice(
        lpTokenContract.address,
        provider
      )
      tokenPriceInWeth = lpPrice
    } catch (err) {
      console.error('Error fetching Uni-v2 LP price: ', err)
    }
  }

  return {
    tokenAmount,
    poolWeight,
    tokenPriceInWeth,
    totalWethValue:
      Number(tokenAmount) > 0
        ? tokenPriceInWeth
            .mul(tokenAmount)
            .div(BigNumber.from('1' + '0'.repeat(18)))
        : BigNumber.from(1),
  }
}

export const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { address } = useAccount()
  const provider = useProvider()
  const chainId = useChainId()

  const fetchAllStakedValue = useCallback(async () => {
    const snackShackContract = new Contract(
      contracts[chainId].SNACK_SHACK_FARM,
      SnackShackAbi,
      provider
    )

    const balances: Array<StakedValue> = await Promise.all(
      pools.map(({ pid, lpAddress }: Pool) =>
        getTotalLPWethValue(
          provider,
          snackShackContract,
          new Contract(lpAddress[chainId], erc20ABI, provider),
          pid
        )
      )
    )

    setBalance(balances)
  }, [provider, chainId])

  useEffect(() => {
    if (address) {
      fetchAllStakedValue()
    }
  }, [address, fetchAllStakedValue])

  return balances
}

export default useAllStakedValue
