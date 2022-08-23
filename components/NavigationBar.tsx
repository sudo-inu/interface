import styled from 'styled-components'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Flex from './primitives/Flex'
import Link from 'next/link'
import Image from 'next/image'

import SudoInu from 'public/img/sudoinu.png'
import { useEffect, useState } from 'react'

const Navbar = styled.nav`
  display: flex;
  padding: 10px 20px;
  justify-content: space-between;
  align-items: center;
`

const FlexNav = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  gap: 40px;
`

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
`

const A = styled.a<{ active?: boolean }>`
  padding-top: 4px;
  color: ${({ active }) => (active ? 'black' : '#aa9585')};
  font-weight: 700;
`

const NavigationBar = () => {
  const [activePath, setActivePath] = useState('')

  useEffect(() => {
    const pathname = window.location.pathname
    setActivePath(pathname.split('/')[1] || '')
  }, [])

  return (
    <Container>
      <Navbar>
        <FlexNav>
          <Link passHref href="/">
            <a>
              <Flex style={{ gap: 5, alignItems: 'center' }}>
                <Image src={SudoInu} alt="Sudo Inu" height={48} width={48} />
                <div
                  style={{ fontSize: 22, fontFamily: "'DynaPuff', cursive" }}
                >
                  Sudo Inu
                </div>
              </Flex>
            </a>
          </Link>
          <Link passHref href="/">
            <A active={activePath === ''}>Home</A>
          </Link>
          <Link passHref href="/farms">
            <A active={activePath === 'farms'}>Farm</A>
          </Link>
          <Link
            passHref
            href="https://i.kym-cdn.com/entries/icons/mobile/000/028/021/work.jpg"
          >
            <A target="_blank">About</A>
          </Link>
        </FlexNav>
        <Flex style={{ gap: 20, alignItems: 'center' }}>
          <Link
            passHref
            href="https://sudoswap.xyz/#/browse/buy/0xA78c124B4F7368adDE6a74D32eD9C369fe016F20"
          >
            <A>Buy Sudo Inu</A>
          </Link>
          <Link
            passHref
            href="https://app.uniswap.org/#/swap?chain=mainnet&outputCurrency=0x93b743Fb12a2677adB13093f8eA8464A436DA008"
          >
            <A>Buy SNACKS</A>
          </Link>
          <ConnectButton />
        </Flex>
      </Navbar>
    </Container>
  )
}

export default NavigationBar
