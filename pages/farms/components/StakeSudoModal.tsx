import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'

import {
  Button,
  Modal,
  ModalProps,
  ModalActions,
  ModalTitle,
} from 'components/primitives'
import MultiPairInput from 'components/MultiPairInput'
import pools from 'constants/pools'
import {
  useChainId,
  useApproveTransfer,
  useTransferAllowed,
  useStake,
} from 'hooks'

interface DepositModalProps extends ModalProps {
  pid: number
  tokenName?: string
  approvalTarget?: string
}

const DepositModal: React.FC<DepositModalProps> = ({
  pid,
  tokenName = '',
  approvalTarget = '',
  onDismiss,
}) => {
  const [pairAddresses, setPairAddresses] = useState([''])
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const chainId = useChainId()

  const pool = pools.find((pool) => pool.pid === pid)
  const lpTokenAddress = pool?.lpAddress[chainId] ?? ''
  const controllerAddress = pool?.controllerAddress?.[chainId]

  const transferAllowed = useTransferAllowed(
    lpTokenAddress,
    approvalTarget,
    pairAddresses
  )
  const { onApprove } = useApproveTransfer(
    tokenName,
    lpTokenAddress,
    approvalTarget,
    pairAddresses
  )

  const handleChange = useCallback(
    (_pairAddresses: string[]) => {
      setPairAddresses(_pairAddresses)
    },
    [setPairAddresses]
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove?.()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error('Approval failed: ', e)
    }
  }, [onApprove, setRequestedApproval])

  const { onStake } = useStake(
    pid,
    '0',
    pairAddresses,
    controllerAddress,
    onDismiss
  )

  return (
    <Modal>
      <ModalTitle text={`Deposit ${tokenName} Tokens`} />
      <b>Save your pair address(es), you will need it to withdraw.</b>
      <MultiPairInput
        symbol={tokenName}
        values={pairAddresses}
        onChange={handleChange}
      />
      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        {!transferAllowed ? (
          <Button
            disabled={requestedApproval}
            onClick={handleApprove}
            text={`Approve ${tokenName}`}
          />
        ) : (
          <Button
            disabled={
              pendingTx || !pairAddresses.filter((addr) => addr != '').length
            }
            text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
            onClick={async () => {
              setPendingTx(true)
              await onStake?.()
              setPendingTx(false)
            }}
          />
        )}
      </ModalActions>
    </Modal>
  )
}

export default DepositModal
