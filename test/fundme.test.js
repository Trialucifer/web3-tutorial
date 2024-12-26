const {ethers} = require("hardhat")


describe("test fundme contract", async function() {
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
        assert.equal((await fundMe.owner()), firstAccount)
    })
})