//addParam 接收传参，把 deploy-fundme 任务的合约地址传进来

const { task } = require("hardhat/config") 
    task("interact-fundMe", 
        "try to payable")
        .addParam("addr", "fundme contract address")
        .setAction(async(taskArgs, hre) => {
            const fundMeFactory = await ethers.getContractFactory("FundMe")
            //通过 attach 得到合约的所有信息
            const fundMe = fundMeFactory.attach(taskArgs.addr);
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
})

module.exports = {}
//命令是：npx hardhat interact-fundMe --addr 部署的合约地址