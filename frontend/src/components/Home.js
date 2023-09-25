import React, { useEffect, useState } from 'react'
import NFTCard from './NFTCard'
import { ethers, isError, toNumber } from "ethers"
import marketPlace from '../marketplace.json'
import axios from 'axios'
function Home() {
  const [Nfts, setNfts] = useState([])
  const getAllNfts = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      let contract = new ethers.Contract(marketPlace.address, marketPlace.abi, signer)

      const transaction = await contract.getAllNFTs()
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
  }, [])

  return (
    <div className='space-y-[10px] m-auto'>
      {Nfts && 
        Nfts.map(i => {
          return (  
            <NFTCard data={i} />
          )
        })
      }
    </div>
  )
}

export default Home
