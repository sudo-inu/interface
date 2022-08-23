import contracts from 'constants/contracts'
import { useAccount } from 'wagmi'

import { useChainId, useTransact } from 'hooks'
import { SnackShackAbi } from 'constants/abi'
import pools from 'constants/pools'

export const useReward = (pid: number) => {
  const { address } = useAccount()
  const chainId = useChainId()
  const pool = pools.find((pool) => pool.pid === pid)
  const tokenName = pool?.token
  const snackShackAddress = contracts[chainId].SNACK_SHACK_FARM

  const { transact } = useTransact({
    contractAddress: snackShackAddress,
    contractInterface: SnackShackAbi,
    functionName: 'harvest',
    args: [pid, address],
    description: `Harvesting ${tokenName} rewards`,
    overrides: {
      gasLimit: '250000',
    },
  })

  return { onReward: transact }
}

export default useReward
