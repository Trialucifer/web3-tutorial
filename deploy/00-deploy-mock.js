const { network } = require("hardhat")
const {DECIMAL, INITIAL_ANSWER, devlopmentChains} = require("../helper-hardhat-config")
module.exports= async({getNamedAccounts, deployments}) => {

    if(devlopmentChains.includes(network.name)) {
        const {firstAccount} = await getNamedAccounts()
        const {deploy} = deployments
        await deploy("MockV3Aggregator", {
                from: firstAccount,
                //eth:usb 8
                args: [DECIMAL, INITIAL_ANSWER],
                log: true
            }
        )
    }else {
        console.log("envrionment is not local, mock contract is skipp....")
    }
}
module.exports.tags = ["all", "mock"]
//命令 npx hardhat deploy --tags mock