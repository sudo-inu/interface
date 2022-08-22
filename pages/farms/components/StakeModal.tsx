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
import useStake from 'hooks/useStake'

interface DepositModalProps extends ModalProps {
  pid: number
  max: BigNumber
  tokenName?: string
}

const DepositModal: React.FC<DepositModalProps> = ({
  pid,
  max,
  onDismiss,
  tokenName = '',
}) => {
  const [amount, setAmount] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
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

  const { onStake } = useStake(pid, amount, [], undefined, onDismiss)

  return (
    <Modal>
      <ModalTitle text={`Deposit ${tokenName} Tokens`} />
      <TokenInput
        value={amount}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
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
            await onStake?.()
            setPendingTx(false)
          }}
        />
      </ModalActions>
    </Modal>
  )
}

export default DepositModal
