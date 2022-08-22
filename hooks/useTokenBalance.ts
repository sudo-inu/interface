import BigNumber from 'bignumber.js'
import { erc20ABI, useAccount, useContractRead } from 'wagmi'

export const useTokenBalance = (tokenAddress: string) => {
  const { address } = useAccount()

  const GetTokenBalance = {
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  }

  const { data: balance } = useContractRead(GetTokenBalance)

  return new BigNumber(Number(balance ?? 0))
}

export default useTokenBalance
