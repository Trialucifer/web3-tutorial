
const { network } = require("hardhat");
const { devlopmentChains, networkConfig, LOCK_TIME, CONFIRMATIONS } = require("../helper-hardhat-config");
// module.exports.default=deployFunction
//代表一个匿名函数 hre: hardhat 运行时环境
// module.exports=async(hre) => {
//     const getNamedAccounts = hre.getNamedAccounts
//     const deployments = hre.deployments
//     console.log("this is a deploy function")
// }

module.exports=async({getNamedAccounts, deployments}) => {
    // const firstAccount = (await getNamedAccounts()).firstAccount;
    const {firstAccount} = await getNamedAccounts();
    //deployments中有很多属性，只引入了deploy deployments.deploy
    const {deploy} = deployments
    let dataFeedAddr
    let confirmations
    if(devlopmentChains.includes(network.name)) {
        const mockV3Aggregator = await deployments.get("MockV3Aggregator")
        dataFeedAddr = mockV3Aggregator.address
        confirmations = 0
    }else {
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
        confirmations = CONFIRMATIONS
    }

    /** 
     * 部署时，hardhat会把合约信息写入到 deployments/sepolia 文件中，如果需要重新部署，需要删除这个文件  
     * 否则合约地址是不变的，或者执行 npx hardhat deploy --network sepolia --reset
    */
//    console.log("部署合约的账号:", firstAccount)
    const fundMe = await deploy("FundMe", {
        from: firstAccount, //由谁来部署
        args: [LOCK_TIME, dataFeedAddr],
        log: true,
        waitConfirmations: confirmations  //await fundMe.deploymentTransaction().wait(5)
    })

    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LOCK_TIME, dataFeedAddr],
          });
    }else {
        console.log("Network is not sepolia, skipp....")
    }
}

module.exports.tags = ["all", "fundme"]
//测试命令： npx hardhat deploy [ --tags all]