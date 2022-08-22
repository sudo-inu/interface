import _BigNumberJS from 'bignumber.js'
import { useAccount, useContractRead } from 'wagmi'
import { BigNumber } from 'ethers'

import { SnackShackAbi, SudoControllerAbi } from 'constants/abi'
import contracts from 'constants/contracts'
import { useChainId, useTransact } from 'hooks'
import pools from 'constants/pools'

export const useUnstake = (
  pid: number,
  amount: string,
  pairAddresses: string[],
  controllerAddress?: string,
  onSuccess?: () => void
) => {
  const { address } = useAccount()
  const chainId = useChainId()
  const pool = pools.find((pool) => pool.pid === pid)

  const tokenName = pool?.token
  const snackShackAddress = contracts[chainId].SNACK_SHACK_FARM
  const amountNotNaN = !amount || amount === '' ? 0 : amount
  const formattedAmount = new _BigNumberJS(amountNotNaN)
    .times(new _BigNumberJS('1' + '0'.repeat(18)))
    .toString()

  const GetPairAmount = {
    addressOrName: controllerAddress || '',
    contractInterface: SudoControllerAbi,
    functionName: 'getPairAmount',
    args: [pairAddresses],
  }

  const GetPairData = {
    addressOrName: controllerAddress || '',
    contractInterface: SudoControllerAbi,
    functionName: 'getPairBytes',
    args: [pairAddresses],
  }

  const {
    data: _amount,
    isError: _isAmountError,
    error: _amountError,
  } = useContractRead(GetPairAmount)
  const {
    data: _pairData,
    isError: _isDataError,
    error: _dataError,
  } = useContractRead(GetPairData)

  const stakeAmount = Number(_amount)
    ? BigNumber.from(String(_amount))
    : BigNumber.from(formattedAmount)
  const pairData = _pairData ? _pairData : []

  const { transact, error, isError } = useTransact({
    contractAddress: snackShackAddress,
    contractInterface: SnackShackAbi,
    functionName: 'withdraw',
    args: [pid, stakeAmount, address, pairData],
    description: `Withdrawing ${tokenName}`,
    onSuccess,
  })

  return {
    onUnstake: transact,
    isError: isError || _isDataError || _isAmountError,
    error: error || _dataError || _amountError,
  }
}

export default useUnstake
