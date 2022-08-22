import 'styles/globals.css'
import type { AppProps } from 'next/app'
import '@rainbow-me/rainbowkit/styles.css'
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
  wallet,
} from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { NotifyProvider, ModalProvider } from 'context'
import { ThemeProvider } from 'styled-components'
import BigNumber from 'bignumber.js'
import theme from 'theme'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.rinkeby],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
)

const appInfo = {
  appName: 'Sudo Inu',
}

const { wallets } = getDefaultWallets({
  appName: 'Sudo Inu',
  chains,
})

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      wallet.argent({ chains }),
      wallet.trust({ chains }),
      wallet.ledger({ chains }),
    ],
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider appInfo={appInfo} chains={chains}>
        <ThemeProvider theme={theme}>
          <NotifyProvider>
            <ModalProvider>
              <Component {...pageProps} />
            </ModalProvider>
          </NotifyProvider>
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
