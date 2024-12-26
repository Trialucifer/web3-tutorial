require("@nomicfoundation/hardhat-toolbox");

// npm install --save-dev dotenv
require("dotenv").config()
//npm install --save-dev @chainlink/env-enc
//require("@chainlink/env-enc").config();

//进行合约验证 npm install --save-dev @nomicfoundation/hardhat-verify
require("@nomicfoundation/hardhat-verify");
//端口代理
const { ProxyAgent, setGlobalDispatcher } = require("undici");

//自定义的task； npx hardhat help
// require("./tasks/deploy-fundme")
// require("./tasks/interact-fundme")
//自动去找 index.js文件，不需要再像上面这样单独引入了
require("./tasks")

const SEPOLIA_TEST_URL = process.env.SEPOLIA_TEST_URL
const PRIVATE_TEST_KEY1 = process.env.PRIVATE_TEST_KEY1
const PRIVATE_TEST_KEY2 = process.env.PRIVATE_TEST_KEY2
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");//查看自己的代理 修改端口
setGlobalDispatcher(proxyAgent);


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      //如果要部署真实的测试网，通过第三方服务商拿到免费的url Elchemy,Infura,QuickNode
      url: SEPOLIA_TEST_URL,
      //acounts 钱包私钥
      accounts: [PRIVATE_TEST_KEY1, PRIVATE_TEST_KEY2],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: {
      //etherscan 进行合约验证是时候用的
      sepolia: ETHERSCAN_API_KEY
    }
  },
};
