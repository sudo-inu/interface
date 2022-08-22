import React, { useEffect } from 'react'
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { pools } from 'constants/pools'
import styled from 'styled-components'

import getFarm from 'utils/getFarm'
import { useChainId } from 'hooks'

import PageHeader from 'components/PageHeader'
import { Container, Page, Spacer } from 'components/primitives'
import Harvest from './components/Harvest'
import DepositSudo from './components/DepositSudo'
import Stake from './components/Stake'
import NavigationBar from 'components/NavigationBar'
import Head from 'next/head'
import PoolIcon from './components/PoolIcon'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const SudoWrapper = styled.div`
  margin-bottom: 40px;
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const FarmPage: NextPage<Props> = ({ pid }) => {
  const chainId = useChainId()
  const { lpAddress, token, transferToken, name, emoji, exponential } = getFarm(
    pid
  ) || {
    pid: 0,
    name: '',
    emoji: '',
    lpAddress: '',
    token: '',
    transferToken: '',
    exponential: false,
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Head>
        <title>Sudo Inu - {name}</title>
        <meta
          name="description"
          content={`Deposit ${name} Tokens and earn SNACKS`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavigationBar />

      <Container>
        <Page>
          <div style={{ marginTop: '80px' }}>
            <PageHeader
              icon={
                <PoolIcon
                  showHighlight
                  emoji={emoji}
                  token={token}
                  exponential={exponential}
                />
              }
              subtitle={`Deposit ${name} Tokens and earn SNACKS`}
              title={name}
            />
          </div>

          <StyledFarm>
            {exponential && (
              <SudoWrapper>
                <DepositSudo
                  lpTokenAddress={lpAddress[chainId]}
                  pid={pid}
                  tokenName={transferToken || token}
                  emoji={emoji}
                  exponential={exponential}
                />
              </SudoWrapper>
            )}

            <StyledCardsWrapper>
              <StyledCardWrapper>
                <Harvest pid={pid} />
              </StyledCardWrapper>
              <Spacer />
              <StyledCardWrapper>
                <Stake
                  lpTokenAddress={lpAddress[chainId]}
                  pid={pid}
                  tokenName={token}
                  emoji={emoji}
                  exponential={exponential}
                />
              </StyledCardWrapper>
            </StyledCardsWrapper>
            <Spacer size="lg" />
          </StyledFarm>
        </Page>
      </Container>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const paths = pools.map(({ slug }) => ({
    params: {
      slug,
    },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.slug) {
    return {
      notFound: true,
    }
  }

  const pool = pools.find(({ slug }) => slug === params.slug?.toString())

  if (!pool) {
    return {
      notFound: true,
    }
  }

  return {
    props: { ...pool },
  }
}

export default FarmPage
