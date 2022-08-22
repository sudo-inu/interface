import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { useContractRead } from 'wagmi'

import contracts from 'constants/contracts'
import SnackShackAbi from 'constants/abi/SnackShack.json'
import { useChainId } from 'hooks'

export const useEarnings = (pid: number) => {
  const { address } = useAccount()
  const chainId = useChainId()

  const GetPendingSnacks = {
    addressOrName: contracts[chainId].SNACK_SHACK_FARM,
    contractInterface: SnackShackAbi,
    functionName: 'pendingSnacks',
    args: [pid, address],
    watch: true,
  }

  const { data: balance } = useContractRead(GetPendingSnacks)

  return new BigNumber(Number(balance))
}

export default useEarnings
