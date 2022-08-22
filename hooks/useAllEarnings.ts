import BigNumber from 'bignumber.js'
import { useAccount, useContractReads } from 'wagmi'

import contracts from 'constants/contracts'
import pools from 'constants/pools'
import SnackShackAbi from 'constants/abi/SnackShack.json'
import { useChainId } from 'hooks'

export const useAllEarnings = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const GetPendingSnacks = {
    addressOrName: contracts[chainId].SNACK_SHACK_FARM,
    contractInterface: SnackShackAbi,
    functionName: 'pendingSnacks',
    watch: true,
  }

  const { data: balances } = useContractReads({
    contracts: pools.map(({ pid }: { pid: number }) => ({
      ...GetPendingSnacks,
      args: [pid, address],
    })),
  })

  return balances?.map((balance) => new BigNumber(Number(balance)))
}

export default useAllEarnings
