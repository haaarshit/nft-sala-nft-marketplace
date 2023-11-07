import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ethers } from "ethers"
import marketPlace from '../marketplace.json'
import axios from 'axios'
function NFTPage() {
  const { id } = useParams()
  const [nft, setNft] = useState({ name: "", description: "", image: "", price: "", seller: "", owner: "" })
  const [tokenUri, setTokenUri] = useState("")
  const [Contract, setContract] = useState({})
  const [isSeller, setIsSeller] = useState(false)
  const getNft = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      let contract = new ethers.Contract(marketPlace.address, marketPlace.abi, signer)
      setContract(contract)
      const tokenUri = await contract.tokenURI(id)
      setTokenUri(tokenUri)
      const token = await contract.getTokenFromId(id)
      let metadata = await axios.get(tokenUri)
      const data = metadata.data
      const nft = {
        name: data.name,
        description: data.description,
        image: data.image,
        price: data.price,
        seller: token._seller,
        owner: token._ownerOf
      }
      setNft(nft)
      if (signer.address == nft.seller) setIsSeller(true)
    }
    catch (er) {
      console.log(er)
    }
  }
  const executeSale = async (e) => {
    try {

      e.preventDefault()
      const price = ethers.parseUnits(nft.price, "ether")
      await Contract.executeSale(id, { value: price })  
      alert("NFT sold")
    }
    catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getNft()
  }, [])

  return (
    <div>
      {nft &&
        <div className='flex md:flex-row flex-col p-2 md:p-10 w-[100vw] items-center justify-center'>
          <div className='flex flex-col'>
            <img src={nft.image} alt="nftImage" className='h-[50vh] border-[1px] border-green-400 rounded-[10px]' />
            {/* <p className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-green-500 text-[25px]'>{nft.name}</p> */}
          </div>
          <div className='md:ml-10 ml:1 space-y-2 text-center w-[80vw] md:w-[50vw] bg-[rgb(30,30,30)] p-2 rounded-[10px]'>
            <p className='font-bold  text-[25px] text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-green-500 '>{nft.name}</p>
            <p className='font-semibold text-[15px] text-gray-400'>{nft.description}</p>
            <p className='text-[20px] font-bold text-gray-400'>Token id
              <a href={tokenUri} target='blank' className='text-[20px] text-indigo-400 '> {id}</a>
            </p>
            <p className='text-[20px] font-bold text-gray-400'>Seller
              <a href={`https://sepolia.etherscan.io/address/${nft.seller}`} target='blank' className='text-[20px] text-indigo-400'> {nft.seller.slice(0, 10)}</a>
            </p>
            <p className='tex t-[20px] font-bold text-gray-400'>Contrcat Address
              <a href={`https://sepolia.etherscan.io/address/${nft.owner}`} target='blank' className='text-[20px] text-indigo-400'> {nft.owner.slice(0, 10)}</a>
            </p>
            <p className='text-[20px] font-bold'>{nft.price}  ETH</p>
            {
              !isSeller &&
              <button onClick={e => { executeSale(e) }} className=' font-semibold bg-indigo-500 p-2  rounded-[5px] hover:bg-green-400 hover:text-black linear duration-100 font-semibold '>Buy Now</button>
            }
          </div>
        </div>
      }

    </div>
  )
}

export default NFTPage
