const DECIMAL = 8
const INITIAL_ANSWER = 300000000000
const devlopmentChains = ["hardhat", "local"]
const LOCK_TIME = 180
const CONFIRMATIONS = 5
const networkConfig = {
    //https://chainlist.org/
    11155111: {
        //https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1
        ethUsdDataFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    }
}
module.exports = {
    DECIMAL,
    INITIAL_ANSWER,
    LOCK_TIME,
    devlopmentChains,
    networkConfig,
    CONFIRMATIONS
}
