import React from 'react'
import styled from 'styled-components'

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>
        BNB Transfer Tool © {new Date().getFullYear()}
      </FooterText>
      <NetworkInfo>
        Network: BNB Smart Chain
      </NetworkInfo>
    </FooterContainer>
  )
}

const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 16px;
  margin-top: 40px;
`

const FooterText = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
`

const NetworkInfo = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #F3BA2F;
    border-radius: 50%;
    margin-right: 8px;
  }
`

export default Footer
