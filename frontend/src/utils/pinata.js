//require('dotenv').config();
// const FormData = require('form-data')
import axios from 'axios'
const key = process.env.REACT_APP_PINATA_API;
const secret = process.env.REACT_APP_PINATA_SECRET;
const JWT = process.env.REACT_APP_PINATA_JWT

export const uploadJSONToIPFS = async (JSONBody) => {
    try {
        const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", JSONBody, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${JWT}`,
                'pinata_api_key': `${key}`,
                'pinata_secret_api_key': `${secret}`,
            }
        });
        const jsonUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
        return {
            success: true,
            jsonUrl
        }
    }
    catch (error) {
        console.log(error)
    }
};

export const uploadFileToIPFS = async (file) => {
    //making axios POST request to Pinata ⬇️
    let data = new FormData();
    data.append('file', file);

    try {

        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS",
            data, {
            headers: {
                'pinata_api_key': `${key}`,
                'pinata_secret_api_key': `${secret}`,
                "Content-Type": `multipart/form-data`
            }
        }
        )
        const imgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
        return imgHash
    }
    catch (error) {
        console.log(error)
    }
};