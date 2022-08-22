import { useContractRead } from 'wagmi'

import { SnackShackAbi } from 'constants/abi'
import contracts from 'constants/contracts'
import { useChainId } from 'hooks'

export const usePoolApprovalTarget = (pid: number) => {
  const chainId = useChainId()
  const snackShackAddress = contracts[chainId].SNACK_SHACK_FARM

  const GetPoolApprovalTarget = {
    addressOrName: snackShackAddress,
    contractInterface: SnackShackAbi,
    functionName: 'approvalTarget',
    args: [pid],
  }
  const { data } = useContractRead(GetPoolApprovalTarget)

  return data ? String(data) : ''
}

export default usePoolApprovalTarget
