import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import { toast } from 'react-toastify'
import Header from './components/Header'
import TransferCard from './components/TransferCard'
import Footer from './components/Footer'

const App = () => {
  const [web3, setWeb3] = useState(null)
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('0')
  const [chainId, setChainId] = useState(null)

  const BSC_CHAIN_ID = '0x38' // 56 in decimal
  const BSC_TESTNET_CHAIN_ID = '0x61' // 97 in decimal

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed. Please install it to use this app.')
      return
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const web3Instance = new Web3(window.ethereum)
      
      setWeb3(web3Instance)
      setAccount(accounts[0])
      
      // Get chain ID
      const chainId = await web3Instance.eth.getChainId()
      setChainId('0x' + chainId.toString(16))
      
      // Check if we're on BSC
      if (chainId !== parseInt(BSC_CHAIN_ID, 16) && chainId !== parseInt(BSC_TESTNET_CHAIN_ID, 16)) {
        switchToBSC()
      }
      
      // Get balance
      const balance = await web3Instance.eth.getBalance(accounts[0])
      setBalance(balance)
    } catch (error) {
      console.error(error)
      toast.error('Failed to connect wallet')
    }
  }

  const disconnectWallet = () => {
    setWeb3(null)
    setAccount('')
    setBalance('0')
    setChainId(null)
  }

  const switchToBSC = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID }],
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: BSC_CHAIN_ID,
                chainName: 'BNB Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/'],
              },
            ],
          })
        } catch (addError) {
          toast.error('Failed to add BSC network to MetaMask')
        }
      } else {
        toast.error('Failed to switch to BSC network')
      }
    }
  }

  const updateBalance = async () => {
    if (web3 && account) {
      try {
        const balance = await web3.eth.getBalance(account)
        setBalance(balance)
      } catch (error) {
        console.error('Error updating balance:', error)
      }
    }
  }

  const sendTransaction = async (to, amount) => {
    if (!web3 || !account) return
    
    const amountInWei = web3.utils.toWei(amount, 'ether')
    
    const tx = {
      from: account,
      to: to,
      value: amountInWei,
      gas: 21000,
    }
    
    return web3.eth.sendTransaction(tx)
      .on('transactionHash', (hash) => {
        toast.info(`Transaction sent: ${hash.slice(0, 6)}...${hash.slice(-4)}`)
      })
      .on('receipt', (receipt) => {
        updateBalance()
      })
  }

  useEffect(() => {
    // Check if MetaMask is already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            connectWallet()
          }
        })
        .catch(console.error)
      
      // Setup event listeners
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          updateBalance()
        } else {
          disconnectWallet()
        }
      })
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners()
      }
    }
  }, [])

  // Update balance periodically
  useEffect(() => {
    if (web3 && account) {
      updateBalance()
      const interval = setInterval(updateBalance, 10000) // Update every 10 seconds
      return () => clearInterval(interval)
    }
  }, [web3, account])

  return (
    <AppContainer>
      <Header 
        account={account} 
        connectWallet={connectWallet} 
        disconnectWallet={disconnectWallet} 
      />
      
      <MainContent>
        <TransferCard 
          web3={web3}
          account={account}
          balance={balance}
          sendTransaction={sendTransaction}
          connectWallet={connectWallet}
        />
      </MainContent>
      
      <Footer />
    </AppContainer>
  )
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 0 16px;
`

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
`

export default App
