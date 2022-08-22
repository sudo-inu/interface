import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import Image from 'next/image'
import { erc20ABI, useAccount, useContractRead } from 'wagmi'

import { useAllEarnings, useTokenBalance, useChainId } from 'hooks'
import { getBalanceNumber } from 'utils/formatBalance'

import { Card, CardContent, Label, Spacer, Value } from 'components/primitives'
import SnackIcon from 'public/img/SnackIcon.webp'
import contracts from 'constants/contracts'

const PendingRewards: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)

  const allEarnings = useAllEarnings()
  let sumEarning = 0
  for (let earning of allEarnings ?? []) {
    sumEarning += new BigNumber(earning)
      .div(new BigNumber(10).pow(18))
      .toNumber()
  }

  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [sumEarning, end])

  return (
    <span
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block',
      }}
    >
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
        duration={1}
        onStart={() => {
          setScale(1.25)
          setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
    </span>
  )
}

const Balances: React.FC = () => {
  const chainId = useChainId()
  const snackAddress = contracts[chainId].SNACK_ERC20
  const { address } = useAccount()
  const snackBalance = useTokenBalance(snackAddress)

  const { data } = useContractRead({
    addressOrName: snackAddress,
    contractInterface: erc20ABI,
    functionName: 'totalSupply',
  })

  const totalSupply = new BigNumber(Number(data))

  return (
    <StyledWrapper>
      <Card>
        <CardContent>
          <StyledBalances>
            <StyledBalance>
              <Image src={SnackIcon} alt="Snack Icon" height={64} width={64} />
              <Spacer />
              <div style={{ flex: 1 }}>
                <Label text="Your SNACK Balance" />
                <Value
                  value={!!address ? getBalanceNumber(snackBalance) : 'Locked'}
                />
              </div>
            </StyledBalance>
          </StyledBalances>
        </CardContent>
        <Footnote>
          Pending harvest
          <FootnoteValue>
            <PendingRewards /> SNACK
          </FootnoteValue>
        </Footnote>
      </Card>
      <Spacer />

      <Card>
        <CardContent>
          <Label text="Total SNACK Supply" />
          <Value
            value={totalSupply ? getBalanceNumber(totalSupply) : 'Locked'}
          />
        </CardContent>
        <Footnote>
          New rewards per block
          <FootnoteValue>13,000 SNACK</FootnoteValue>
        </Footnote>
      </Card>
    </StyledWrapper>
  )
}

const Footnote = styled.div`
  font-size: 14px;
  padding: 8px 20px;
  color: ${(props) => props.theme.color.grey[400]};
  border-top: solid 1px ${(props) => props.theme.color.grey[300]};
`
const FootnoteValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  float: right;
`

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledBalances = styled.div`
  display: flex;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`

export default Balances
