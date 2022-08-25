import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Tooltip from 'react-tooltip'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import {
  useAllowance,
  useModal,
  useStakedBalance,
  useTokenBalance,
  usePoolApprovalTarget,
  useApprove,
} from 'hooks'
import { getBalanceNumber } from 'utils/formatBalance'

import {
  Button,
  Card,
  CardContent,
  IconButton,
  Label,
  Value,
} from 'components/primitives'
import { AddIcon } from 'components/icons'
import StakeModal from './StakeModal'
import StakeSudoModal from './StakeSudoModal'
import UnstakeModal from './UnstakeModal'
import UnstakeSudoModal from './UnstakeSudoModal'
import PoolIcon from './PoolIcon'
import { request } from 'http'

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

interface StakeProps {
  lpTokenAddress: string
  pid: number
  tokenName: string
  emoji: string
  exponential?: boolean
}

const Stake: React.FC<StakeProps> = ({
  lpTokenAddress,
  pid,
  tokenName,
  emoji,
  exponential = false,
}) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { address } = useAccount()

  const approvalTarget = usePoolApprovalTarget(pid)

  const allowance = useAllowance(lpTokenAddress, approvalTarget)
  const { onApprove } = useApprove(tokenName, lpTokenAddress, approvalTarget)

  const tokenBalance = useTokenBalance(lpTokenAddress)
  const stakedBalance = useStakedBalance(pid)

  const [onPresentDeposit] = useModal(
    <StakeModal pid={pid} max={tokenBalance} tokenName={tokenName} />,
    'StakeModal'
  )

  const [onPresentDepositSudo] = useModal(
    <StakeSudoModal
      pid={pid}
      tokenName={tokenName}
      approvalTarget={approvalTarget}
    />,
    'StakeSudoModal'
  )

  const [onPresentWithdraw] = useModal(
    <UnstakeModal pid={pid} max={stakedBalance} tokenName={tokenName} />,
    'UnstakeModal'
  )

  const [onPresentWithdrawSudo] = useModal(
    <UnstakeSudoModal pid={pid} tokenName={tokenName} />,
    'UnstakeSudoModal'
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

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <PoolIcon
              emoji={emoji}
              token={tokenName}
              exponential={exponential}
            />
            <Value value={getBalanceNumber(stakedBalance)} />
            <Label text={`${tokenName} Tokens Staked`} align="center" />
          </StyledCardHeader>
          <StyledCardActions>
            {address ? (
              <>
                {!exponential && !allowance.toNumber() ? (
                  <Button
                    disabled={requestedApproval}
                    onClick={handleApprove}
                    text={`Approve ${tokenName}`}
                  />
                ) : (
                  <>
                    <Button
                      disabled={stakedBalance.eq(new BigNumber(0))}
                      text="Unstake"
                      onClick={
                        exponential ? onPresentWithdrawSudo : onPresentWithdraw
                      }
                    />
                    <StyledActionSpacer />

                    <div
                      data-tip
                      data-for={pid === 4 ? 'deposit-pid-4' : 'n/A'}
                    >
                      <IconButton
                        disabled={
                          tokenBalance.eq(new BigNumber(0)) || pid === 4
                        }
                        onClick={
                          exponential ? onPresentDepositSudo : onPresentDeposit
                        }
                      >
                        <AddIcon disabled={tokenBalance.eq(new BigNumber(0))} />
                      </IconButton>
                    </div>

                    <Tooltip border id="deposit-pid-4" type="warning">
                      <div style={{ fontSize: 16 }}>Temporarily disabled</div>
                    </Tooltip>
                  </>
                )}
              </>
            ) : (
              <ConnectButton />
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

export default Stake
