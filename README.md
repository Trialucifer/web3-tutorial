# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
学习地址：https://github.com/smartcontractkit/Web3_tutorial_Chinese

执行命令

验证合约是否正常

npx hardhat compile

部署方式一
npx hardhat run --network sepolia .\deployFundMe.js

部署方式二

npx hardhat deploy-fundme --network sepolia   
npx hardhat interact-fundMe --addr 合约地址 --network sepolia

执行安装
npm install --save-dev @nomicfoundation/hardhat-ethers ethers hardhat-deploy hardhat-deploy-ethers

require("@nomicfoundation/hardhat-ethers");  
require("hardhat-deploy");  
require("hardhat-deploy-ethers");  

然后开发 01-deploy-fund-me.js 文件  

验证deploy文件夹的部署  
npx hardhat deploy  
npx hardhat deploy --network sepolia 