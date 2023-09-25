import React from 'react'
import { useState } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from '../utils/pinata';
import { ethers } from "ethers"
import marketPlace from '../marketplace.json'
function SellNft() {
    const [formParams, setFormParams] = useState({ name: "", description: "", price: 0 })
    const [message, setMessage] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    // helper functions
    const sendFileToIPFS = async (fileImg) => {
        try {
            const pinataFileUrl = await uploadFileToIPFS(fileImg)
            setFileUrl(pinataFileUrl)
            console.log(pinataFileUrl)
        }
        catch (error) {
            console.log("Got error while uploading file on Pinata -------->", error)
        }
    }
    const uploadMetadataToIPFS = async () => {
        const { name, description, price } = formParams
        if (!name || !description || !price || !fileUrl)
            return
        let nftJson = {
            name,
            description, 
            price,
            image: fileUrl
        }
        const jsonData = JSON.stringify({
            pinataContent: nftJson,
            pinataMetadata: {
                name: `${name}.json`
            }
        })
        // nftJson = JSON.stringify(nftJson)
        console.log(jsonData)
        try {
            const response = await uploadJSONToIPFS(jsonData)
            if (response.success === true) {
                console.log("JSON uploaded to pinata")
                console.log(response.jsonUrl)
                return response.jsonUrl
            }
        } catch (error) {
            alert("Got problem while uploading data to pinata")
            console.log("Got error while uploading meta data at pinata", error)
        }

    }

    const listNFT = async (e) => {
        e.preventDefault()
        try {
            const metaDataUrl = await uploadMetadataToIPFS()
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            console.log(signer.address)
            let contract = new ethers.Contract(marketPlace.address, marketPlace.abi, signer)
            const price = ethers.parseUnits(formParams.price, 'ether')
            const listingPrice = await contract.getListPrice()
            console.log(metaDataUrl)
            console.log(price)
            let transaction = await contract.createToken(metaDataUrl, price, { value: listingPrice })
            await transaction.wait()
            alert("NFT successfully listed")
            window.location.replace('/')
        } catch (error) {
            alert("Got error while listing NFT")
            console.log("Got error while listing nft --------> ", error)
            setMessage("Got Problem while listing nft")
        }
    }

    return (
        <div>
            <div className="flex flex-col bg-[rgb(23,23,23)] place-items-center   p-2" id="nftForm">
                <form className="    shadow-md   rounded px-8 pt-4 pb-8 mb-4  bg-[rgb(30,30,30)]">
                    <h3 className="text-center font-bold text-green-400 mb-8">Upload your NFT to the marketplace</h3>
                    <div className="mb-4">
                        <label className="block text-green-400 text-sm font-bold mb-2" htmlFor="name">NFT Name</label>
                        <input className="shadow  bg-[rgb(30,30,30)] appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="NFTName" value={formParams.name} onChange={e => setFormParams({ ...formParams, name: e.target.value })}></input>
                    </div>
                    <div className="mb-6">
                        <label className="block text-green-400 text-sm font-bold mb-2" htmlFor="description">NFT Description</label>
                        <textarea className="  bg-[rgb(30,30,30)] shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none " cols="20" rows="5" id="description" type="text" placeholder="NFT   Collection" value={formParams.description} onChange={e => setFormParams({ ...formParams, description: e.target.value })}></textarea>
                    </div>
                    <div className="mb-6">
                        <label className="block text-green-400 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                        <input className="  bg-[rgb(30,30,30)] shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => setFormParams({ ...formParams, price: e.target.value })}></input>
                    </div>
                    <div>
                        <label className="block text-green-400 text-sm font-bold mb-2" htmlFor="image">Upload Image (&lt;500 KB)</label>
                        <input type={"file"} onChange={e => { sendFileToIPFS(e.target.files[0]) }}></input>

                    </div>
                    <br></br>
                    <div className="text-red-500 text-center">{message}</div>
                    <button disabled={!fileUrl} onClick={e => listNFT(e)} className="font-bold mt-2 w-full bg-green-500 text-white rounded p-2 shadow-lg" id="list-button">
                        List NFT
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SellNft
