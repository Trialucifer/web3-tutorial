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
//安装 hardhat deploy
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
//配置ABI导出 npm install --save-dev hardhat-abi-exporter
require('hardhat-abi-exporter');

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
  mocha: {
     //修改配置等待200秒，默认配置超过40秒就报错
     //即合约部署的时间，一般来说合约部署到测试网不止需要40秒的
     timeout: 300000
  },
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
  namedAccounts: {
    firstAccount: {
      default: 0
    },
    secondAccount: {
      default: 1
    }
  },
  gasReporter: {
    enabled: true
  },
  abiExporter: { 
    path: './abi', // ABI导出目录的路径（相对于Hardhat根目录）
    runOnCompile: true, // 是否在编译时自动导出ABI
    clear: true, // 是否在编译时清除旧的ABI文件
    flat: true, // 是否将输出目录扁平化（可能会造成命名冲突）
    only: [], // 选择包含的合约数组
    except: [], // 排除的合约数组
    spacing: 2, // 格式化输出的缩进空格数
    pretty: false // 是否使用接口风格的格式化输出
  },
};
