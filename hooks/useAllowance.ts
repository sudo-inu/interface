import BigNumber from 'bignumber.js'
import { erc20ABI, useAccount, useContractRead } from 'wagmi'

export const useAllowance = (tokenAddress: string, targetAddress: string) => {
  const { address } = useAccount()

  const GetAllowance = {
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
    functionName: 'allowance',
    args: [address, targetAddress],
    watch: true,
  }

  const { data: allowance } = useContractRead(GetAllowance)

  return new BigNumber(Number(allowance))
}

export default useAllowance
