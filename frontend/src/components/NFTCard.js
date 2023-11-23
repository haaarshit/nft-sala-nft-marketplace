import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ethers } from "ethers"
function NFTCard({ data }) {
    const [isShown, setIsShown] = useState(false);
    const [address, updateAddress] = useState('0x')
    const [isSeller, setIsSeller] = useState(false)
    const getAddress = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const addr = signer.address
        if (data.seller == addr) {
            updateAddress("You")
            setIsSeller(true)
        }
        else updateAddress(data.seller.slice(0, 10) + "....")
    }
    useEffect(() => {
        // console.log(data)
        getAddress()
    }, [])
    return (
        <div onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)} className='shadow-lg hover:shadow-[rgb(30,30,30)] linear duration-100  p-1 mx-1 h-[350px] w-[250px] my-1 inline-block md:mx-3  rounded-[10px] bg-[rgb(30,30,30)] justify-center relative'>
            <Link to={`/nftpage/${data.tokenId}`}>
                <img src={data.image} className='h-[200px] w-[240px] rounded-[10px]' />
            </Link>
            <div className='justify-start p-1 h-[80px]'>
                <h1 className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-green-500'>{data.name}</h1>
                <p>{data.description}</p>
            </div>
            <div className='flex justify-center items-center'>
                <p className='mx-2 font-bold text-indigo-400'>{data.price}ETH</p>
                {/* {isSeller ?

                    <button disabled={true} className='p-1 w-[100px] h-[40px] font-semibold border-2 my-2 border-green-400 rounded-[10px]  hover:border-none bg-green-400 text-[rgb(25,25,25)] linear duration-100 '>Your NFT</button>
                    :
                    <button className='p-1 w-[100px] h-[40px] font-semibold border-2 my-2 border-green-400 rounded-[10px] hover:font-bold hover:border-none hover:bg-green-400 hover:text-[rgb(25,25,25)] linear duration-100 '>Buy Now</button>
                } */}
            </div>
            {
                isShown
                &&
                <h1 className='absolute top-0 p-2 bg-[rgba(255,255,255,0.2)] rounded-[100px]'>Seller is {address}</h1>
            }

        </div>
    )
}

export default NFTCard
