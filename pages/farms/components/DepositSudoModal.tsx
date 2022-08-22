import React, { useCallback, useState } from 'react'

import { useChainId, useDepositSudoLp } from 'hooks'

import {
  Button,
  Modal,
  ModalProps,
  ModalActions,
  ModalTitle,
} from 'components/primitives'
import MultiPairInput from 'components/MultiPairInput'
import pools from 'constants/pools'

interface DepositSudoModalProps extends ModalProps {
  pid: number
  tokenName?: string
}

const DepositSudoModal: React.FC<DepositSudoModalProps> = ({
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

  const { onDeposit } = useDepositSudoLp(
    tokenName,
    lpTokenAddress || '',
    pairAddresses[0],
    onDismiss
  )

  return (
    <Modal>
      <ModalTitle text={`Deposit ${tokenName} Tokens`} />
      <p>
        <b>Save your pair address(es), you will need it to withdraw.</b>
        <br />
        Make sure you are depositing the correct Sudoswap LP token:
        <ul>
          <li>
            <span>Pool Type:</span>{' '}
            <span>
              <b>{pool?.sudoswapPool?.type}</b>
            </span>
          </li>
          <li>
            <span>Curve Type:</span>{' '}
            <span>
              <b>{pool?.sudoswapPool?.curve}</b>
            </span>
          </li>
          <li>
            <span>NFT Address:</span>{' '}
            <span>
              <b>{pool?.sudoswapPool?.nft[chainId]}</b>
            </span>
          </li>
          <li>
            <span>Minimum:</span>{' '}
            <span>
              <b>{pool?.sudoswapPool?.minimumDeposit}</b>
            </span>
          </li>
        </ul>
      </p>
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
            await onDeposit?.()
            setPendingTx(false)
          }}
        />
      </ModalActions>
    </Modal>
  )
}

export default DepositSudoModal
