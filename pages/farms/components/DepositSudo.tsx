import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Tooltip from 'react-tooltip'

import { useModal, useTokenBalance } from 'hooks'
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
import DepositSudoModal from './DepositSudoModal'
import WithdrawSudoModal from './WithdrawSudoModal'
import PoolIcon from './PoolIcon'
import { grey } from 'theme/colors'

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: 20px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

const QuestionIcon = styled.div`
  cursor: pointer;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 2;
  display: grid;
  justify-content: center;
  align-items: center;
  height: 32px;
  width: 32px;
  border-radius: 99999px;
  padding: 3px;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid #e2d6cf;
  background-color: #f0e9e7;
  box-shadow: inset 4px 4px 8px ${grey[300]}, inset -6px -6px 12px ${grey[100]};

  > span {
    font-size: 16px;
    filter: invert(100%);
  }
`

const StyledTooltip = styled(Tooltip)`
  border-radius: 8px !important;
`

const LimitedWidthTooltip = styled(StyledTooltip)`
  max-width: 420px;
`

interface DepositSudoProps {
  lpTokenAddress: string
  pid: number
  tokenName: string
  emoji: string
  exponential?: boolean
}

const DepositSudo: React.FC<DepositSudoProps> = ({
  lpTokenAddress,
  pid,
  tokenName,
  exponential = false,
}) => {
  const { address } = useAccount()

  const stakedBalance = useTokenBalance(lpTokenAddress)

  const [onPresentDeposit] = useModal(
    <DepositSudoModal pid={pid} tokenName={tokenName} />,
    'DepositModal'
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawSudoModal pid={pid} tokenName={tokenName} />,
    'WithdrawModal'
  )

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <QuestionIcon data-tip data-for="question-exponential">
              <span>❔</span>
            </QuestionIcon>
            <LimitedWidthTooltip
              border
              multiline
              clickable
              id="question-exponential"
              type="dark"
            >
              You need Sudo Inu SudoSwap LP tokens to deposit into this pool.
              You can acquire them at sudoswap.xyz/#/create, by selecting the
              correct pool type (Buy-side, Sell-side, or Trade) and the ETH /
              Sudo Inu NFT pair.
              <br />
              <br />
              If you deposit SudoSwap LP tokens in this pool, you will receive{' '}
              {tokenName}, which you can deposit in the next pool to farm
              SNACKS.
            </LimitedWidthTooltip>
            <PoolIcon
              emoji={'👾🐶'}
              token={tokenName}
              exponential={exponential}
            />
            <Value value={getBalanceNumber(stakedBalance)} />
            <Label text={`${tokenName} Tokens Staked`} align="center" />
          </StyledCardHeader>
          <StyledCardActions>
            {address ? (
              <>
                <Button
                  disabled={stakedBalance.eq(new BigNumber(0))}
                  text="Withdraw"
                  onClick={onPresentWithdraw}
                />
                <StyledActionSpacer />
                <IconButton onClick={onPresentDeposit}>
                  <AddIcon />
                </IconButton>
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

export default DepositSudo
