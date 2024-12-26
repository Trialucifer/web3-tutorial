const { task } = require("hardhat/config")
//task 名字
task("deploy-fundme", 
    "deploy and verify fundme contract")
    .setAction(async(taskArgs, hre) => {
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        console.log("FundMe contract deploying")
        const fundMe = await fundMeFactory.deploy(300)
        //等待部署完成，这里才是真的部署完成
        await fundMe.waitForDeployment();
        console.log(`contract has been deplooy successfuly, address is ${fundMe.target}`)
        if (hre.network.config.chainId == 11155111 &&  process.env.ETHERSCAN_API_KEY) {
            //等5个区块,验证成功性更高
            console.log("wait for 5 confirmations")
            await fundMe.deploymentTransaction().wait(5)
            console.log("verifying contract on etherscan...")
            verifyFundMe(fundMe.target, 300)
        }else {
            console.log("verification skipped..")
        }
})

async function verifyFundMe(fundMeAddr, args) {
    //验证脚本
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: [args],
      });
}

module.exports = {}
//命令是： npx hardhat deploy-fundme --network sepolia