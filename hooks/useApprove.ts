import { ethers } from 'ethers'
import { erc20ABI } from 'wagmi'
import { useTransact } from './useTransact'

export const useApprove = (
  tokenName: string,
  tokenAddress: string,
  targetAddress: string
) => {
  const { transact } = useTransact({
    contractAddress: tokenAddress,
    contractInterface: erc20ABI,
    functionName: 'approve',
    args: [targetAddress, ethers.constants.MaxUint256],
    description: `Approving ${tokenName} transfer`,
  })

  return { onApprove: transact }
}

export default useApprove
