import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'

import { getFullDisplayBalance } from 'utils/formatBalance'

import {
  Button,
  Modal,
  ModalProps,
  ModalActions,
  ModalTitle,
} from 'components/primitives'
import MultiPairInput from 'components/MultiPairInput'
import useUnstake from 'hooks/useUnstake'
import { useChainId } from 'hooks'
import pools from 'constants/pools'

interface UnstakeSudoModalProps extends ModalProps {
  pid: number
  tokenName?: string
}

const UnstakeSudoModal: React.FC<UnstakeSudoModalProps> = ({
  pid,
  tokenName = '',
  onDismiss,
}) => {
  const [pairAddresses, setPairAddresses] = useState([''])
  const [pendingTx, setPendingTx] = useState(false)
  const chainId = useChainId()

  const pool = pools.find((pool) => pool.pid === pid)
  const controllerAddress = pool?.controllerAddress?.[chainId]

  const handleChange = useCallback(
    (_pairAddresses: string[]) => {
      setPairAddresses(_pairAddresses)
    },
    [setPairAddresses]
  )

  const { onUnstake } = useUnstake(
    pid,
    '0',
    pairAddresses,
    controllerAddress,
    onDismiss
  )

  return (
    <Modal>
      <ModalTitle text={`Withdraw ${tokenName}`} />
      <MultiPairInput
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
            await onUnstake?.()
            setPendingTx(false)
          }}
        />
      </ModalActions>
    </Modal>
  )
}

export default UnstakeSudoModal
