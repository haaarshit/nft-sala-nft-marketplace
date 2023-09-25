const pinataSdk = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")

const pintatApiKey = process.env.PINATA_API_KEY
const pintatSecretKey = process.env.PINATA_API_SECRET
const pinata = pinataSdk(pintatApiKey, pintatSecretKey)

const storeImages = async (imageFilePath) => {

    const fullImagePath = path.resolve(imageFilePath)
    const files = fs.readdirSync(fullImagePath)
    console.log(files)
    let responses = []
    for (fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(`${fullImagePath}/${files[fileIndex]}`)
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile)
            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

const storeTokenUriMetadata = async (metadata) => {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
}

const handleTokenuri = async () => {
    let tokenUris = []
    // store image in IPFS
    // store metadata in IPFS
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    for (imageUploadResponseIndex in imageUploadResponses) {
      // create metadata
      // upload metadata
      let tokenUriMetaData = { ...metadataTemplate }
      tokenUriMetaData.name = files[imageUploadResponseIndex].replace(".png", "")
      tokenUriMetaData.description = `An adorable ${tokenUriMetaData.name} nft`
      tokenUriMetaData.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
      console.log(`Uploading ${tokenUriMetaData.name}`)
      // store the json 
      const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetaData)
      tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token uris uploaded...")
    console.log(tokenUris)
    return tokenUris
  }

module.exports = { storeImages, storeTokenUriMetadata ,handleTokenuri}