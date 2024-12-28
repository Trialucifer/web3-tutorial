const {ethers} = require("hardhat")
const {assert, expect} = require("chai")
//用来模拟时间流失
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const {devlopmentChains} = require("../helper-hardhat-config")

!devlopmentChains.includes(network.name) 
? describe.skip 
: describe("test fundme contract", async function() {
     //beforeEach 每个if运行之前都会运行这个
     let fundMe
     let secondFundMe
     let secondAccount
     let firstAccount
     let mockV3Aggregator
     
    beforeEach(async function() {
        //类似执行了 npx hardhat deploy
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount
        //deployments.get("FundMe") 获取合约的部署对象（部署信息）
        const fundMeDeployment = await deployments.get("FundMe")
        //获取合约的实例，然后允许调用公开的方法
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
        //连接新的地址用这个函数
        secondFundMe = await ethers.getContract("FundMe", secondAccount)
        //部署一个假的合约
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        
    })


    it("test if the owner is msg.sender", async function() {
        // const [firstAccount] = await ethers.getSigners()
        // const fundMeFactory = await ethers.getContractFactory("FundMe")
        // //部署FundMe合约
        // const fundMe = await fundMeFactory.deploy(180)
        await fundMe.waitForDeployment()
        await assert.equal((await fundMe.owner()), firstAccount)
    })

    it("window close, value grater thean minium, fund failed",
        async function () {
            //lockTime传入的是180，所以这里时间流逝 200秒
            //这个命令用于增加模拟的以太坊时间 增加时间200秒
            await helpers.time.increase(200)
            //模拟挖矿--挖掘新区块，使得增加时间的交易被确认
            await helpers.mine()
            //to.be.revertedWith 是一个 Chai 断言库中的异步断言，用于检查交易是否被撤销，并提供了撤销的原因
            await expect(fundMe.fund({value: ethers.parseEther("0.1")})).to.be.revertedWith("window is closed")
        }
    )

    it("window open, value less thean minium, fund failed",
        async function () {
            await expect(fundMe.fund({value: ethers.parseEther("0.01")})).to.be.revertedWith("Send more ETH")
        }
    )

    it("window close, value is grater minimum, fund success",
        async function () {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            const balance = await fundMe.fundersToAmount(firstAccount)
            await expect(balance).to.equal(ethers.parseEther("0.1"))
        }
    )

    it("not owner, window close, target reache, retFund failed",
        async function () {
            await fundMe.fund({value: ethers.parseEther("1")})
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(secondFundMe.getFund()).to.be.revertedWith("this function can only be called by owner")
        }
    )

    it("owner, window open, target reache, retFund failed",
        async function () {
            await fundMe.fund({value: ethers.parseEther("1")})
            await expect(fundMe.getFund()).to.be.revertedWith("window is not closed")
        }
    )

    it("window close, target not reached, getFund failed",
        async function() {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            //超过180 make sure the window is closed
            await helpers.time.increase(200)
            //模拟挖矿，使得时间超过200秒
            await helpers.mine()
            await expect(fundMe.getFund()).to.be.revertedWith("Target is not reached")
        }
    )

    it("window close, target reached, getFund success",
        async function() {
            await fundMe.fund({value: ethers.parseEther("1")})
            //超过180 make sure the window is closed
            await helpers.time.increase(200)
            //模拟挖矿，使得时间超过200秒
            await helpers.mine()
            //执行成功会出发一个 Event事件 withArgs：事件参数
            await expect(fundMe.getFund()).to
            .emit(fundMe, "FundWithdDrawByOwner")
            .withArgs(ethers.parseEther("1"))
        }
    )

    //reFund
    //window close,target not reache, funder has balance
    it("window open, target not reached, funder has balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            await expect(fundMe.refund()).to.be.revertedWith("window is not closed")
        }
    )

    it("window closed, target reached, funder has balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("1")})
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(fundMe.refund()).to.be.revertedWith("Target is reached")
        }
    )

    it("window closed, target not reached, funder no balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(secondFundMe.refund()).to.be.revertedWith("there is no fund for you")
        }
    )

    it("window closed, target not reached, funder has balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(fundMe.refund()).to.emit(fundMe, "RefundBalance")
            .withArgs(firstAccount, ethers.parseEther("0.1"))
            // const balance = await fundMe.fundersToAmount(firstAccount)
            // expect(balance).to.equals(ethers.parseEther("1"))
        }
    )
})