import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ethers } from "ethers"
function Navbar() {
  const [connected, toggleConnected] = useState(false)
  const [address, updateAddress] = useState('0x')

  const getAddress = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const addr = signer.address
    updateAddress(addr)
  }

  const connectWebsite = async (e) => {
    e.preventDefault()
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    // check if you are on sepolia testnet or not
    if (chainId !== '0xaa36a7') {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xaa36a7' }] })
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        getAddress()
        toggleConnected(true)
      })

  }
  window.ethereum.on('disconnect', () => {
    console.log('lost connection to the rpc')
  });
  return (
    <div className='flex  p-2 justify-between items-center mb-2'>
      <h1 className='text-[3vmax] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-green-500'>NftShala</h1>
      <div>
        <Link to="/" className='mx-2 font-semibold border-b-2 hover:border-green-400  p-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-green-500'>Home</Link>
        <Link to="/sellnft" className='mx-2 font-semibold border-b-2 hover:border-green-400  p-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-green-500'>SellNft</Link>
        <Link to="/profile" className='mx-2 font-semibold border-b-2 hover:border-green-400 border-white  p-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-green-500'>Profile</Link>
        <button onClick={(e) => connectWebsite(e)} className='mx-2 font-semibold bg-indigo-500 p-2  rounded-[5px] hover:bg-green-400 hover:text-black linear duration-100 '>
          {
            !connected ? <span className=''>Connect Wallet</span> : <span className=''>Connected</span>
          }
        </button> 
      </div>
    </div>
  )
}

export default Navbar
