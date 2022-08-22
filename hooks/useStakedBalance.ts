import BigNumber from 'bignumber.js'
import { useAccount, useContractRead } from 'wagmi'

import { SnackShackAbi } from 'constants/abi'
import contracts from 'constants/contracts'
import { useChainId } from 'hooks'

export const useStakedBalance = (pid: number) => {
  const { address } = useAccount()
  const chainId = useChainId()
  const snackShackAddress = contracts[chainId].SNACK_SHACK_FARM

  const GetUserInfo = {
    addressOrName: snackShackAddress,
    contractInterface: SnackShackAbi,
    functionName: 'userInfo',
    args: [pid, address],
    watch: true,
  }

  const { data: userInfo } = useContractRead(GetUserInfo)
  const { amount } = (userInfo ?? { amount: 0 }) as any

  return new BigNumber(Number(amount))
}

export default useStakedBalance
