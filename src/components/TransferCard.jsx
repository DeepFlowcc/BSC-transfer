import React, { useState } from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { formatBalance, shortenAddress } from '../utils/helpers'

const TransferCard = ({ web3, account, balance, sendTransaction, connectWallet }) => {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [showBalance, setShowBalance] = useState(false)
  const [txStatus, setTxStatus] = useState(null) // 'pending', 'success', 'error'
  const [txHash, setTxHash] = useState('')
  const [txAmount, setTxAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!web3 || !account) {
      toast.error('Please connect your wallet first')
      return
    }
    
    if (!recipient || !amount) {
      toast.error('Please fill in all fields')
      return
    }
    
    if (!web3.utils.isAddress(recipient)) {
      toast.error('Invalid recipient address')
      return
    }
    
    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }
    
    const balanceInEther = web3.utils.fromWei(balance, 'ether')
    if (parseFloat(amount) > parseFloat(balanceInEther)) {
      toast.error('Insufficient balance')
      return
    }
    
    setIsLoading(true)
    setTxStatus('pending')
    
    try {
      const tx = await sendTransaction(recipient, amount)
      setTxHash(tx.transactionHash)
      setTxAmount(amount)
      setTxStatus('success')
      setRecipient('')
      setAmount('')
      toast.success('Transaction sent successfully!')
    } catch (error) {
      console.error(error)
      setTxStatus('error')
      toast.error(error.message || 'Transaction failed')
    } finally {
      // Keep the status for display, don't reset it here
      setIsLoading(false)
    }
  }

  const toggleBalance = () => {
    setShowBalance(!showBalance)
  }

  const resetTxStatus = () => {
    setTxStatus(null)
  }

  return (
    <Card>
      <CardHeader>
        <Title>Transfer BNB</Title>
        {account ? (
          <AccountInfo>
            <AccountBalance>{formatBalance(balance)} BNB</AccountBalance>
            <AccountAddress onClick={toggleBalance}>{shortenAddress(account)}</AccountAddress>
          </AccountInfo>
        ) : null}
      </CardHeader>

      {txStatus && (
        <StatusCard status={txStatus}>
          <StatusHeader>
            <StatusTitle>
              {txStatus === 'pending' && 'Transaction Pending'}
              {txStatus === 'success' && 'Transaction Successful'}
              {txStatus === 'error' && 'Transaction Failed'}
            </StatusTitle>
            <CloseButton onClick={resetTxStatus}>×</CloseButton>
          </StatusHeader>
          
          {txStatus === 'success' && (
            <StatusContent>
              <StatusItem>
                <StatusLabel>Amount:</StatusLabel>
                <StatusValue>{txAmount} BNB</StatusValue>
              </StatusItem>
              <StatusItem>
                <StatusLabel>Transaction:</StatusLabel>
                <StatusLink href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                  View on BscScan
                </StatusLink>
              </StatusItem>
            </StatusContent>
          )}
        </StatusCard>
      )}

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Recipient Address</Label>
          <Input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup>
          {account && (
            <BalanceDisplay>
              <BalanceLabel>Your Balance:</BalanceLabel>
              <BalanceValue>
                {formatBalance(balance)} BNB
              </BalanceValue>
            </BalanceDisplay>
          )}
          
          <Label>Amount (BNB)</Label>
          <InputWrapper>
            <Input
              type="number"
              step="0.0001"
              min="0"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
            {account && (
              <MaxButton 
                type="button" 
                onClick={() => setAmount(web3.utils.fromWei(balance, 'ether'))}
                disabled={isLoading}
              >
                MAX
              </MaxButton>
            )}
          </InputWrapper>
        </InputGroup>

        {account ? (
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Transfer'}
          </SubmitButton>
        ) : (
          <ConnectButton type="button" onClick={connectWallet}>
            Connect Wallet
          </ConnectButton>
        )}
      </Form>
    </Card>
  )
}

const Card = styled.div`
  background-color: var(--card-bg);
  border-radius: 20px;
  padding: 24px;
  width: 420px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
`

const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const AccountBalance = styled.div`
  font-weight: 500;
  color: var(--text-primary);
`

const AccountAddress = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const BalanceDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(33, 114, 229, 0.1);
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 8px;
`

const BalanceLabel = styled.span`
  color: var(--text-secondary);
`

const BalanceValue = styled.span`
  color: var(--button-bg);
`

const StatusCard = styled.div`
  background-color: ${props => {
    switch(props.status) {
      case 'pending': return 'rgba(243, 186, 47, 0.1)';
      case 'success': return 'rgba(39, 174, 96, 0.1)';
      case 'error': return 'rgba(229, 57, 53, 0.1)';
      default: return 'rgba(33, 114, 229, 0.1)';
    }
  }};
  border-left: 4px solid ${props => {
    switch(props.status) {
      case 'pending': return '#F3BA2F';
      case 'success': return '#27AE60';
      case 'error': return '#E53935';
      default: return '#2172E5';
    }
  }};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

const StatusTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  
  &:hover {
    color: var(--text-primary);
  }
`

const StatusContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StatusLabel = styled.span`
  color: var(--text-secondary);
  font-size: 14px;
`

const StatusValue = styled.span`
  color: var(--text-primary);
  font-weight: 500;
`

const StatusLink = styled.a`
  color: var(--button-bg);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`

const Label = styled.label`
  font-size: 14px;
  color: var(--text-secondary);
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const Input = styled.input`
  width: 100%;
  background-color: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  color: var(--text-primary);
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: var(--button-bg);
  }

  &::placeholder {
    color: var(--text-secondary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const MaxButton = styled.button`
  position: absolute;
  right: 12px;
  background-color: rgba(33, 114, 229, 0.1);
  color: var(--button-bg);
  border: none;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(33, 114, 229, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const SubmitButton = styled(Button)`
  background-color: var(--button-bg);
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background-color: var(--button-hover);
  }
`

const ConnectButton = styled(Button)`
  background-color: var(--button-bg);
  color: white;
  border: none;

  &:hover {
    background-color: var(--button-hover);
  }
`

export default TransferCard
