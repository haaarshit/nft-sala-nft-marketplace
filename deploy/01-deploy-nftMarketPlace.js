const { network, ethers, artifacts } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const verify = require("../utils/verify")
const fs = require("fs")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    log("-----------------------------------")
    const nftsala = await deploy("NFTSala", {
        from: deployer,
        log: true,  
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        verify(await nftsala.address, [])
    }

    log('------------------------------------')
    const nftMarketplace = await ethers.getContract("NFTSala")
    // write in frontend
    const data = {
        address: nftsala.address,
        abi: nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    }
    fs.writeFileSync('./frontend/src/marketplace.json', JSON.stringify(data))
}

module.exports.tags = ["all", "nftsala"]