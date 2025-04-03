import React from 'react'
import styled from 'styled-components'
import { shortenAddress } from '../utils/helpers'

const Header = ({ account, connectWallet, disconnectWallet }) => {
  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon src="/bnb-logo.svg" alt="BNB Logo" />
        <LogoText>BNB Transfer</LogoText>
      </Logo>
      
      {account ? (
        <AccountButton onClick={disconnectWallet}>
          {shortenAddress(account)}
        </AccountButton>
      ) : (
        <ConnectButton onClick={connectWallet}>
          Connect Wallet
        </ConnectButton>
      )}
    </HeaderContainer>
  )
}

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 16px;
  margin-bottom: 40px;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const LogoIcon = styled.img`
  width: 24px;
  height: 24px;
`

const LogoText = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
`

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
`

const ConnectButton = styled(Button)`
  background-color: var(--button-bg);
  color: white;
  border: none;

  &:hover {
    background-color: var(--button-hover);
  }
`

const AccountButton = styled(Button)`
  background-color: var(--input-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);

  &:hover {
    background-color: var(--card-bg);
  }
`

export default Header
