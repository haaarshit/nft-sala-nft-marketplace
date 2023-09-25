import { ethers } from "ethers"
import marketPlace from '../marketplace.json'
// returns signer and address
export const  getProvider = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    let signer = await provider.getSigner()
    let contrcat = new ethers.Contract(marketPlace.address, marketPlace.abi, signer)
    console.log(signer)
    console.log(contrcat)
    return {
        signer,
        contrcat
    }
}
