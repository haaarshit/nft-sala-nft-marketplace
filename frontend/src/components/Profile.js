import React, { useEffect, useState } from 'react'
import { ethers, toNumber } from "ethers"
import marketPlace from '../marketplace.json'
import axios from 'axios'
import { Link } from 'react-router-dom'
import NFTCard from './NFTCard'
  

function Profile() {
  const [address, updateAddress] = useState('0x')
  const [Nfts, setNfts] = useState([])
  const getAddress = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const addr = signer.address
    updateAddress(addr)
  }
  const getAllNfts = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      let contract = new ethers.Contract(marketPlace.address, marketPlace.abi, signer)
 
      const transaction = await contract.getMyNFTs()
      console.log(transaction)
      const items = await Promise.all(transaction.map(async i => {
        console.log(i)
        const tokenUri = await contract.tokenURI(i.tokenId)
        let metadata = await axios.get(tokenUri)
        metadata = metadata.data
        console.log(i.tokenId)
        let price = ethers.formatUnits(i._price.toString(), 'ether')
        let item = {
          price,
          tokenId: toNumber(i.tokenId),
          seller: i._seller,
          owner: i._ownerOf,
          image: metadata.image,
          name: metadata.name,
          description: metadata.description
        }
        return item
      }))
      setNfts(items)
      console.log(items)
    }
    catch (er) {
      console.log(er)
    }
  }
  useEffect(() => {
    getAllNfts()
    getAddress()
  }, [])

  return (
    <div className=' '>
      <h1 className='text-[2vmax] text-green-400'>Hello <span className='text-[2vmax] text-indigo-500'>{address.slice(2, 8)}...{address.slice(-5)}</span></h1>
      <h1 className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-green-500 text-[3vmax]'>Your NFTs</h1>
      <div className='flex flex-wrap  justify-center p-2 '>
        {
          Nfts.map(i => {
            return (
              <NFTCard  data={i}/>
              )
          })
        }
      </div>
    </div>
  )
}

export default Profile
