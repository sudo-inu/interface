import { useCallback, useEffect, useState } from 'react'
import { Contract, BigNumber } from 'ethers'
import { erc20ABI, useAccount, useProvider } from 'wagmi'

import contracts from 'constants/contracts'
import pools, { Pool } from 'constants/pools'
import { SnackShackAbi } from 'constants/abi'
import { useBlock, useChainId } from 'hooks'
import get0xPrice from 'utils/get0xPrice'

export interface StakedValue {
  tokenAmount: BigNumber
  tokenPriceInWeth: BigNumber
  totalWethValue: BigNumber
  poolWeight: BigNumber
}

const tokenPrice = {
  0: BigNumber.from('1000000000000000000'),
  1: BigNumber.from('100000000000000000'),
  2: BigNumber.from('10000000000000'),
  3: BigNumber.from('50000000000000000'),
  4: BigNumber.from('100000000000000000'),
}

export const getTotalLPWethValue = async (
  snackShackContract: Contract,
  lpTokenContract: Contract,
  pid: number
) => {
  const tokenHolder = await snackShackContract.approvalTarget(pid)
  // Get balance of the token address
  const tokenAmount = await lpTokenContract.balanceOf(tokenHolder)

  const { allocPoint } = await snackShackContract.poolInfo(pid)
  const totalAllocPoint = await snackShackContract.totalAllocPoint()

  const poolWeight = BigNumber.from(allocPoint)
    .mul(BigNumber.from(100))
    .div(BigNumber.from(totalAllocPoint))

  if (Number(tokenAmount) > 0) {
    const { buyAmount: totalWethValue, price: tokenPriceInWeth } =
      await get0xPrice(lpTokenContract.address, tokenAmount)

    return {
      tokenAmount,
      poolWeight,
      totalWethValue: totalWethValue
        ? BigNumber.from(totalWethValue)
        : BigNumber.from(tokenAmount)
            .mul(tokenPrice[pid as keyof typeof tokenPrice])
            .div(BigNumber.from(10).pow(18)),
      tokenPriceInWeth: tokenPriceInWeth
        ? BigNumber.from(tokenPriceInWeth)
        : tokenPrice[pid as keyof typeof tokenPrice],
    }
  }

  const tokenPriceInWeth = BigNumber.from(
    tokenPrice[pid as keyof typeof tokenPrice]
  )

  return {
    tokenAmount,
    poolWeight,
    tokenPriceInWeth,
    totalWethValue: BigNumber.from(1),
  }
}

export const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { address } = useAccount()
  const provider = useProvider()
  const chainId = useChainId()
  const block = useBlock()

  const fetchAllStakedValue = useCallback(async () => {
    const snackShackContract = new Contract(
      contracts[chainId].SNACK_SHACK_FARM,
      SnackShackAbi,
      provider
    )

    const balances: Array<StakedValue> = await Promise.all(
      pools.map(({ pid, lpAddress }: Pool) =>
        getTotalLPWethValue(
          snackShackContract,
          new Contract(lpAddress[chainId], erc20ABI, provider),
          pid
        )
      )
    )

    setBalance(balances)
  }, [provider, chainId])

  useEffect(() => {
    if (address && block) {
      fetchAllStakedValue()
    }
  }, [address, block, fetchAllStakedValue])

  return balances
}

export default useAllStakedValue
