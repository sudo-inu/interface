import { FC } from 'react'
import Tooltip from 'react-tooltip'
import styled, { keyframes } from 'styled-components'
import { BigNumber } from 'ethers'

import { useAllStakedValue } from 'hooks'
import pools from 'constants/pools'

import { Button } from 'components/primitives'
import PoolIcon from './PoolIcon'

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccentA = styled.div`
  background: linear-gradient(
    45deg,
    rgba(63, 218, 216, 1) 0%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`
const StyledCardAccentB = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const StyledCardWrapper = styled.div`
  display: flex;
  position: relative;
`

const Card = styled.div`
  display: grid;
  padding: 16px;
  width: 250px;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 12px;
  border: 1px solid #e2d6cfff;
  background-color: #f0e9e7;
  position: relative;
`

const PoolTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 15px;
  color: black;
`

const Rewards = styled.div<{ exponential: boolean }>`
  position: absolute;
  top: 6px;
  right: 6px;
  background-color: ${(props) => (props.exponential ? '#2c7be5' : '#b9b9ff')};
  padding: 4px 8px;
  border-radius: 8px;
  color: ${(props) => (props.exponential ? 'white' : 'black')};
  font-weight: 500;
  cursor: help;
`

const Deposit = styled.div`
  text-align: center;
  margin-bottom: 20px;
  line-height: 25px;
  color: #7f7f7f;
`

const StyledTooltip = styled(Tooltip)`
  border-radius: 8px !important;
`

const LimitedWidthTooltip = styled(StyledTooltip)`
  max-width: 420px;
`

const TooltipList = styled.ul`
  font-size: 16px;
  width: '100%';
  padding: 0;
  margin: 10px 40px;
`

const TooltipListItem = styled.li`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledInsight = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  background: #fffdfa;
  color: #aa9584;
  width: 100%;
  margin-top: 12px;
  line-height: 32px;
  font-size: 13px;
  border: 1px solid #e6dcd5;
  text-align: center;
  padding: 0 12px;
`

type Props = {
  emoji: string
  name: string
  slug: string
  token: string
  rewards: string
  exponential?: boolean
}

const SECONDS_PER_YEAR = BigNumber.from(31536000)
const SNACK_PER_SECOND = BigNumber.from(1000)

const PoolCard: FC<Props> = ({
  emoji,
  name,
  slug,
  rewards,
  token,
  exponential = false,
}) => {
  const stakedValue = useAllStakedValue()
  const showHighlight = [
    'XMON/SNACK Uni-v2 LP',
    'Sudo INU Buy Wall LP',
    'Sudo INU High-Fee Trade Pool LP',
  ].includes(token)

  const snackIndex = pools.findIndex(({ token: _token }) => _token === 'SNACK')
  const tokenIndex = pools.findIndex(({ token: _token }) => _token === token)

  const snackPrice =
    snackIndex >= 0 && stakedValue[snackIndex]
      ? stakedValue[snackIndex].tokenPriceInWeth
      : BigNumber.from(0)

  const apy =
    tokenIndex >= 0 && stakedValue[tokenIndex]
      ? snackPrice
          .mul(SNACK_PER_SECOND)
          .mul(SECONDS_PER_YEAR)
          .mul(stakedValue[tokenIndex].poolWeight)
          .div(stakedValue[tokenIndex].totalWethValue)
      : null

  const apyString =
    apy && apy.gte(BigNumber.from('1' + '0'.repeat(20)))
      ? '∞%'
      : `${Number(
          apy?.mul(BigNumber.from(100) ?? BigNumber.from(0))
        ).toLocaleString('en-US')}%`

  return (
    <StyledCardWrapper>
      {showHighlight &&
        (exponential ? <StyledCardAccentB /> : <StyledCardAccentA />)}
      <Card>
        <Rewards
          exponential={exponential}
          data-tip
          data-for={exponential ? 'rewards-exponential' : 'rewards'}
        >
          {rewards}
        </Rewards>
        <LimitedWidthTooltip
          multiline
          border
          id="rewards-exponential"
          type="info"
          backgroundColor="#2c7be5"
        >
          <div style={{ fontSize: 16, width: '100%' }}>
            The variable proportion of <b>SNACKS</b> rewards assigned to this
            pool. Your multiplier starts at the displayed value and drops the
            longer your deposit is in the pool.
          </div>
          <br />
          <TooltipList>
            <TooltipListItem>
              <span>Initial deposit:</span>{' '}
              <span>
                <b>100% Multiplier</b>
              </span>
            </TooltipListItem>
            <TooltipListItem>
              <span>After 1 day:</span>
              <span>
                <b>50% Multiplier</b>
              </span>
            </TooltipListItem>
            <TooltipListItem>
              <span>After 1 week:</span>
              <span>
                <b>10% Multiplier</b>
              </span>
            </TooltipListItem>
          </TooltipList>
        </LimitedWidthTooltip>
        <StyledTooltip
          border
          id="rewards"
          type="info"
          backgroundColor="#2c7be5"
        >
          <div style={{ fontSize: 16 }}>
            The constant proportion of <b>SNACKS</b> rewards assigned to this
            pool.
          </div>
        </StyledTooltip>
        <PoolIcon
          showHighlight
          emoji={emoji}
          token={token}
          exponential={exponential}
        />
        <PoolTitle>{name}</PoolTitle>
        <Deposit>
          {token}
          <br />
          <div>Earn SNACKS</div>
        </Deposit>

        <Button href={`/farms/${slug}`} text="Select" />

        <StyledInsight>
          <span>APY</span>
          <span>{apy ? apyString : 'Loading ...'}</span>
        </StyledInsight>
      </Card>
    </StyledCardWrapper>
  )
}

export default PoolCard
