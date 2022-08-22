import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import pools from 'constants/pools'

import SudoInu from 'public/img/inu-sitting.png'
import NavigationBar from 'components/NavigationBar'
import Grid from 'components/primitives/Grid'
import { Container, Page } from 'components/primitives'
import PageHeader from 'components/PageHeader'
import PoolCard from './components/PoolCard'

const Farms: NextPage = () => {
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
      <Container>
        <Page>
          <PageHeader
            icon={
              <Image src={SudoInu} alt="Sudo Inu" height="220" width="160" />
            }
            subtitle="Earn SNACK tokens by staking the top Sudo Tokens"
            title="Select Your Favorite Pools"
          />

          <Grid
            style={{
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 24,
              width: '100%',
              maxWidth: '768px',
              marginBottom: '60px',
            }}
          >
            {pools.map(
              ({ emoji, name, slug, token, rewards, exponential }, idx) => (
                <PoolCard
                  key={`${name}-${idx}`}
                  emoji={emoji}
                  name={name}
                  slug={slug}
                  token={token}
                  rewards={rewards}
                  exponential={exponential}
                />
              )
            )}
          </Grid>
        </Page>
      </Container>
    </>
  )
}

export default Farms
