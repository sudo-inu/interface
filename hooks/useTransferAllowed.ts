import { useContractReads } from 'wagmi'
import { SudoInuLPAbi } from 'constants/abi'

export const useTransferAllowed = (
  lpTokenAddress: string,
  targetAddress: string,
  pairAddresses: string[]
) => {
  const GetAllowed = {
    addressOrName: lpTokenAddress,
    contractInterface: SudoInuLPAbi,
    functionName: 'transferApprovals',
    watch: true,
  }

  const { data: allowances } = useContractReads({
    contracts: pairAddresses.map((pairAddress) => ({
      ...GetAllowed,
      args: [pairAddress, targetAddress],
    })),
  })

  const allAllowed = allowances?.reduce((sum, curr) => curr && sum, true)

  return allAllowed
}

export default useTransferAllowed
