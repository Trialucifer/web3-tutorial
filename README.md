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
执行命令

部署方式一
npx hardhat run --network sepolia .\deployFundMe.js

部署方式二

npx hardhat deploy-fundme --network sepolia   
npx hardhat interact-fundMe --addr 合约地址 --network sepolia