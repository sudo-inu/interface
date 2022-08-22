import React, { useCallback, useState } from 'react'

import {
  Button,
  Modal,
  ModalProps,
  ModalActions,
  ModalTitle,
} from 'components/primitives'
import MultiPairInput from 'components/MultiPairInput'
import { useWithdrawSudoLp, useChainId } from 'hooks'
import pools from 'constants/pools'

interface WithdrawSudoModalProps extends ModalProps {
  pid: number
  tokenName?: string
}

const WithdrawSudoModal: React.FC<WithdrawSudoModalProps> = ({
  pid,
  tokenName = '',
  onDismiss,
}) => {
  const [pairAddresses, setPairAddresses] = useState([''])
  const [pendingTx, setPendingTx] = useState(false)
  const chainId = useChainId()
  const pool = pools.find((pool) => pool.pid === pid)

  const lpTokenAddress = pool?.lpAddress[chainId]

  const handleChange = useCallback(
    (_pairAddresses: string[]) => {
      setPairAddresses(_pairAddresses)
    },
    [setPairAddresses]
  )

  const { onWithdraw } = useWithdrawSudoLp(
    tokenName,
    lpTokenAddress || '',
    pairAddresses[0],
    onDismiss
  )

  return (
    <Modal>
      <ModalTitle text={`Withdraw ${tokenName}`} />
      <MultiPairInput
        maxLines={1}
        symbol={tokenName}
        values={pairAddresses}
        onChange={handleChange}
      />
      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        <Button
          disabled={pendingTx}
          text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
          onClick={async () => {
            setPendingTx(true)
            await onWithdraw?.()
            setPendingTx(false)
          }}
        />
      </ModalActions>
    </Modal>
  )
}

export default WithdrawSudoModal
