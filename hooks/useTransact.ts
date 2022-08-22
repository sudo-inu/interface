import { useState } from 'react'
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { UpdateNotification } from 'bnc-notify'
import { ContractInterface } from 'ethers'

import { useNotify } from 'context'

interface TransactProps {
  contractAddress: string
  contractInterface: ContractInterface
  functionName: string
  args?: any | any[]
  overrides?: any
  description?: string
  onSuccess?: () => void
}

export const useTransact = ({
  contractAddress,
  contractInterface,
  functionName,
  args,
  overrides,
  description,
  onSuccess: _onSuccess,
}: TransactProps) => {
  const [updateCurrent, setUpdateCurrent] = useState<
    { [description: string]: UpdateNotification } | undefined
  >(undefined)
  const [_id, setId] = useState(0)

  const { notify } = useNotify()
  const {
    config,
    isError: _isPrepareError,
    error: _prepareError,
  } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface,
    functionName,
    args,
    overrides,
  })

  const { data, isError, error, write, writeAsync } = useContractWrite({
    ...config,
    onMutate: () => {
      if (!notify) {
        console.error('NOTFY FAILED')
        return
      }

      notify.notification({
        type: 'hint',
        message: description || 'Transaction started',
        autoDismiss: 3000,
      })
    },
    onSuccess: () => {
      if (!notify) return

      const { update } = notify.notification({
        type: 'pending',
        message: description || 'Transaction pending',
      })
      setUpdateCurrent({ ...updateCurrent, [_id]: update })

      if (requestAnimationFrame) {
        requestAnimationFrame(() => _onSuccess?.())
      }
    },
    onError: () => {
      if (!notify) return

      if (updateCurrent && updateCurrent[_id]) {
        updateCurrent[_id]({
          type: 'error',
          message: 'Transaction cancelled',
          autoDismiss: 4000,
        })
        setId(_id + 1)
      } else {
        notify?.notification({
          type: 'error',
          message: 'Transaction cancelled',
          autoDismiss: 4000,
        })
      }
    },
  })

  const {
    isLoading,
    isSuccess,
    isError: _isWaitError,
    error: _waitError,
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      if (!notify) return

      if (data.status == 0) {
        if (updateCurrent && updateCurrent[_id]) {
          updateCurrent[_id]({
            type: 'error',
            message: description || 'Transaction failed',
          })
          setId(_id + 1)
        } else {
          notify?.notification({
            type: 'error',
            message: description || 'Transaction failed',
          })
        }
      } else {
        if (updateCurrent && updateCurrent[_id]) {
          updateCurrent[_id]({
            type: 'success',
            message: description || 'Transaction succeeded',
          })
          setId(_id + 1)
        } else {
          notify?.notification({
            type: 'success',
            message: description || 'Transaction succeeded',
          })
        }
      }
    },
    onError: () => {
      if (!notify) return

      if (updateCurrent && updateCurrent[_id]) {
        updateCurrent[_id]({
          type: 'error',
          message: description || 'Transaction failed',
        })
        setId(_id + 1)
      } else {
        notify?.notification({
          type: 'error',
          message: description || 'Transaction failed',
        })
      }
    },
  })

  return {
    data,
    error: error || _waitError || _prepareError,
    isLoading,
    isSuccess,
    isError: isError || _isWaitError || _isPrepareError,
    write,
    transact: writeAsync,
  }
}
