import { useAccount } from 'wagmi'

import { useTransact } from 'hooks'
import { SudoInuLPAbi } from 'constants/abi'

export const useWithdrawSudoLp = (
  tokenName: string,
  lpAddress: string,
  pairAddress: string,
  onSuccess?: () => void
) => {
  const { address } = useAccount()

  const { transact, isError, error } = useTransact({
    contractAddress: lpAddress,
    contractInterface: SudoInuLPAbi,
    functionName: 'withdraw',
    args: [pairAddress, address],
    description: `Withdrawing ${tokenName}`,
    onSuccess,
  })

  return {
    onWithdraw: transact,
    isError,
    error,
  }
}

export default useWithdrawSudoLp
