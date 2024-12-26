const {ethers} = require("hardhat")

async function main() {
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

    /** 
     * init 2 accounts
     * fund contract with first account
     * check balance of aonctract
     * fund contract with second account
     * check balance of contract 
     * check mapping
    */
   
    //int 2 accounts ethers.getSigners()方法可以拿到配置文件中的两个账号
    const [firstAccount, secondAccount] = await ethers.getSigners()
    //fund contract weith first account 第一个账户调用合约的 fund函数
    const fundTx = await fundMe.fund({value: ethers.parseEther("0.5")})
    //上面的转账不能保证币一定是发送成功的，所以得等待
    await fundTx.wait()
    //check balance of contract 查看合约中有收到 0.5嘛
    const balancOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contract is ${balancOfContract}`)
    //fund contract with send account
    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.1")})
    await fundTxWithSecondAccount.wait()
    //check balance of contract
    const balancOfContractWithSecondAccount = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contract is ${balancOfContractWithSecondAccount}`)
    //check mapping fundersToAmount
    const firstAccountBalance = await fundMe.fundersToAmount(firstAccount.address)
    const secondAccountBalance = await fundMe.fundersToAmount(secondAccount.address)
    console.log(`balance of first account ${firstAccount.address} is ${firstAccountBalance}`)
    console.log(`balance of second account ${secondAccount.address} is ${secondAccountBalance}`)
}

async function verifyFundMe(fundAddr, args) {
  await hre.run("verify:verify", {
    address: fundAddr,
    constructorArguments: [args],
  });
}



main().then(() => process.exit(0))
      .catch(errro => {
        console.error(errro);
        process.exit(1);
      })

//要在测试环境执行这个部署，因为需要在测试环境发币
// npx hardhat run --network sepolia .\scripts\deployFundMe.js