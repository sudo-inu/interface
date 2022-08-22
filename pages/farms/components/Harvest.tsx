import React, { useState } from 'react'
import styled from 'styled-components'

import useEarnings from 'hooks/useEarnings'
import useReward from 'hooks/useReward'
import { getBalanceNumber } from 'utils/formatBalance'

import {
  Button,
  Card,
  CardContent,
  CardIcon,
  Label,
  Value,
} from 'components/primitives'

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

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

interface HarvestProps {
  pid: number
}

const Harvest: React.FC<HarvestProps> = ({ pid }) => {
  const earnings = useEarnings(pid)
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useReward(pid)

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>🍪</CardIcon>
            <Value value={getBalanceNumber(earnings)} />
            <Label text="SNACKS Earned" />
          </StyledCardHeader>
          <StyledCardActions>
            <Button
              disabled={!earnings.toNumber() || pendingTx}
              text={pendingTx ? 'Collecting SNACKS' : 'Harvest'}
              onClick={async () => {
                setPendingTx(true)
                await onReward?.()
                setPendingTx(false)
              }}
            />
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

export default Harvest
