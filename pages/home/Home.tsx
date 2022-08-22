import React from 'react'
import styled from 'styled-components'
import { Page, Button, Spacer, Container } from 'components/primitives'
import Head from 'next/head'
import Image from 'next/image'
import PageHeader from 'components/PageHeader'
import NavigationBar from 'components/NavigationBar'

import SudoInu from 'public/img/inu-running.png'
import Balances from './components/Balances'

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Sudo Inu - The Snack Shack</title>
        <meta
          name="description"
          content="Farm SNACKS with your XMON and SUDO INU at the Snack Shack."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavigationBar />
      <Page>
        <div style={{ marginTop: '120px' }}>
          <PageHeader
            icon={
              <Image src={SudoInu} alt="Sudo Inu" height={160} width={250} />
            }
            title="The Snack Shack is Ready"
            subtitle="Stake Sudo Tokens to earn decilious Sudo SNACKS!"
          />
        </div>

        <Container>
          <Balances />
        </Container>

        <div
          style={{
            margin: '30px auto 0',
          }}
        >
          <Button text="🐶 Feed your dog" href="/farms" />
        </div>
        <Spacer size="lg" />
        <StyledInfo>
          🏆<b>Pro Tip</b>: SudoSwap LP token pools yield up to 25x more token
          rewards.
        </StyledInfo>
      </Page>
    </>
  )
}

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

export default Home
