const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
//用来模拟时间流失
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const {devlopmentChains} = require("../helper-hardhat-config")

//集成测试主要是测单元测试无法覆盖的一些场景
devlopmentChains.includes(network.name) 
? describe.skip 
: describe("test fundme contract", async function() {

    //beforeEach 每个if运行之前都会运行这个
    let fundMe
    let firstAccount
    beforeEach(async function() {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        //deployments.get("FundMe") 获取合约的部署对象（部署信息）
        const fundMeDeployment = await deployments.get("FundMe")
        //获取合约的实例，然后允许调用公开的方法
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    })

    //两个判断，会部署两次合约，各等181秒
    
    // test fund and getFund successfully
    it("fund and getFund successfully",
        async function() {
            //make sure target reached
            await fundMe.fund({value: ethers.parseEther("0.5")}) //3000 * 0.5 = 1500
            //单位是毫秒，这里是等待181秒 make sure window close
            await new Promise(resolve => setTimeout(resolve, 181 * 1000))
            //make sure we can get receipt 
            //getFundTx 拿到这笔交易
            const getFundTx = await fundMe.getFund()
            //获取回执
            const getFundReceipt = await getFundTx.wait()
            await expect(getFundReceipt)
                .to.emit(fundMe, "FundWithdDrawByOwner")
                .withArgs(ethers.parseEther("0.5"))
        }
    )
    // test fund and refund successfully
    it("fund and refund successfully",
        async function() {
             //make sure target reached
             await fundMe.fund({value: ethers.parseEther("0.1")}) //3000 * 0.1 = 300
             //单位是毫秒，这里是等待181秒 make sure window close
             await new Promise(resolve => setTimeout(resolve, 181 * 1000))
             //make sure we can get receipt 
             //getFundTx 拿到这笔交易
             const getReFundTx = await fundMe.refund()
             //获取回执
             const getReFundReceipt = await getReFundTx.wait()
             await expect(getReFundReceipt)
                 .to.emit(fundMe, "RefundBalance")
                 .withArgs(firstAccount, ethers.parseEther("0.1"))
        }
    )

})

//执行命令：npx hardhat test --network sepolia
