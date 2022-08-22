import { useTransact } from 'hooks'
import { SudoInuLPAbi } from 'constants/abi'

export const useApproveTransfer = (
  tokenName: string,
  lpTokenAddress: string,
  targetAddress: string,
  pairAddresses: string[]
) => {
  const { transact, isError, error } = useTransact({
    contractAddress: lpTokenAddress,
    contractInterface: SudoInuLPAbi,
    functionName: 'approveTransferrer',
    args: [targetAddress, pairAddresses],
    description: `Approve ${tokenName}`,
  })

  return {
    onApprove: transact,
    isError,
    error,
  }
}

export default useApproveTransfer
