import { ethers } from 'ethers';
// import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import config from '../config.json'

const Abis = require('./contracts/abis.json');
const Addresses = require('./contracts/addresses.json');

const supportChainId = config.chainId;
// const multicallAddress = "0x402C435EA85DFdA24181141De1DE66bad67Cdf12";
// setMulticallAddress(supportChainId, multicallAddress);

const RPCS = {
    // 1: "http://13.59.118.124/eth",
    [config.chainId]: 'https://rpc.ftm.tools/'
    // 4002: 'https://ftm-test.babylonswap.finance'
    // 4: 'http://85.206.160.196'
    // 1337: "http://localhost:7545",
    // 31337: "http://localhost:8545/",
};
const providers = {
    // 1: new ethers.providers.JsonRpcProvider(RPCS[1]),
    // 4002: new ethers.providers.JsonRpcProvider(RPCS[4002])
    // 4: new ethers.providers.JsonRpcBatchProvider(RPCS[4])
    [config.chainId]: new ethers.providers.JsonRpcBatchProvider(RPCS[config.chainId])
    // 1337: new ethers.providers.JsonRpcProvider(RPCS[1337]),
    // 31337: new ethers.providers.JsonRpcProvider(RPCS[31337]),
};

const provider = providers[supportChainId];

const testToken = new ethers.Contract(Addresses.TestToken, Abis.ERC20, provider);

const marketplaceContract = new ethers.Contract(Addresses.Marketplace, Abis.Marketplace, provider);

const storeFontContract = new ethers.Contract(Addresses.StoreFront, Abis.StoreFront, provider);

const getNFTContract = (address: any) => {
    return new ethers.Contract(address, Abis.NFT, provider);
};
const getTokenContract = (address: any) => {
    return new ethers.Contract(address, Abis.ERC20, provider);
};

export {
    supportChainId,
    provider,
    marketplaceContract,
    storeFontContract,
    testToken,
    getNFTContract,
    getTokenContract
};
