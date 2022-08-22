import { useTransact } from 'hooks'
import { LSSVMPairAbi } from 'constants/abi'

export const useDepositSudoLp = (
  tokenName: string,
  lpAddress: string,
  pairAddress: string,
  onSuccess?: () => void
) => {
  const { transact, isError, error } = useTransact({
    contractAddress: pairAddress,
    contractInterface: LSSVMPairAbi,
    functionName: 'transferOwnership',
    args: [lpAddress],
    description: `Depositing ${tokenName}`,
    onSuccess,
    overrides: {
      gasLimit: '300000',
    },
  })

  return {
    onDeposit: transact,
    isError,
    error,
  }
}

export default useDepositSudoLp
