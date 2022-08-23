import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'

import { getFullDisplayBalance } from 'utils/formatBalance'

import {
  Button,
  Modal,
  ModalProps,
  ModalActions,
  ModalTitle,
  TokenInput,
} from 'components/primitives'
import useUnstake from 'hooks/useUnstake'

interface UnstakeModalProps extends ModalProps {
  pid: number
  max: BigNumber
  tokenName?: string
}

const UnstakeModal: React.FC<UnstakeModalProps> = ({
  pid,
  onDismiss,
  max,
  tokenName = '',
}) => {
  const [amount, setAmount] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max || new BigNumber(0))
  }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setAmount(e.currentTarget.value)
    },
    [setAmount]
  )

  const handleSelectMax = useCallback(() => {
    setAmount(fullBalance)
  }, [fullBalance, setAmount])

  const { onUnstake } = useUnstake(pid, amount, [], undefined, onDismiss)

  return (
    <Modal>
      <ModalTitle text={`Withdraw ${tokenName}`} />
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={amount}
        max={fullBalance}
        symbol={tokenName}
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

export default UnstakeModal
