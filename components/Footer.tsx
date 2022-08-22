import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink target="_blank" href="https://etherscan.io/address/#code">
        SnackShack Contract
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://sudoswap.xyz/#/browse/buy/0xA78c124B4F7368adDE6a74D32eD9C369fe016F20"
      >
        Sudoswap
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://uniswap.info/pair/0xce84867c3c02b05dc570d0135103d3fb9cc19433"
      >
        Uniswap XMINU-ETH
      </StyledLink>
      <StyledLink target="_blank" href="https://github.com/sudo-inu">
        Github
      </StyledLink>
      <StyledLink target="_blank" href="https://t.me/sudo_inu">
        Telegram
      </StyledLink>
      <StyledLink target="_blank" href="https://twitter.com/sudo-inu">
        Twitter
      </StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`

const Footer: React.FC = () => (
  <StyledFooter>
    <StyledFooterInner>
      <Nav />
    </StyledFooterInner>
  </StyledFooter>
)

const StyledFooter = styled.footer`
  align-items: center;
  display: flex;
  justify-content: center;
`
const StyledFooterInner = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  height: ${(props) => props.theme.topBarSize}px;
  max-width: ${(props) => props.theme.siteWidth}px;
  width: 100%;
`

export default Footer
