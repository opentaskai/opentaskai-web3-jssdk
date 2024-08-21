import { BigNumber } from 'ethers';
import * as _CONF from './config.json';
const CONF: any = _CONF ? (_CONF as any).default : {};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const CHAIN_RPC: any = {
  1: 'https://rpc.ankr.com/eth',
  11155111: 'https://ethereum-sepolia-rpc.publicnode.com',
  56: 'https://bsc-dataseed.binance.org',
  97: 'https://bsc-testnet-rpc.publicnode.com',
  137: 'https://polygon-rpc.com',
  421611: 'https://rinkeby.arbitrum.io/rpc',
  42161: 'https://arb1.arbitrum.io/rpc',
  128: 'https://http-mainnet.hecochain.com',
  256: 'https://http-testnet.hecochain.com',
  80001: 'https://matic-mumbai.chainstacklabs.com',
};

if (CONF?.CHAIN_RPC) Object.assign(CHAIN_RPC, CONF.CHAIN_RPC);

export const CHAIN_BROWSER: any = {
  1: 'https://etherscan.io',
  11155111: 'https://sepolia.etherscan.io',
  56: 'https://bscscan.com',
  97: 'https://testnet.bscscan.com',
  128: 'https://hecoinfo.com',
  137: 'https://polygonscan.com',
  256: 'https://testnet.hecoinfo.com',
  80001: 'https://mumbai.polygonscan.com',
  421611: 'https://rinkeby-explorer.arbitrum.io',
  42161: 'https://arbiscan.io',
};

export const CHAIN_NAME: any = {
  1: 'Ethereum Chain Mainnet',
  11155111: 'Ethereum Chain Sepolia',
  56: 'Binance Smart Chain Mainnet',
  97: 'Binance Smart Chain Testnet',
  128: 'HECO Chain Mainnet',
  137: 'Matic Chain Mainnet',
  256: 'HECO Chain Testnet',
  80001: 'Matic Chain Testnet',
  421611: 'Arbitrum Chain Testnet',
  42161: 'Arbitrum Chain Mainnet',
};

export const CHAIN_SYMBOL: any = {
  WToken: {
    1: 'WETH',
    11155111: 'WETH',
    56: 'WBNB',
    97: 'WBNB',
    128: 'WHT',
    256: 'WHT',
    137: 'WMATIC',
    80001: 'WMATIC',
    421611: 'WETH',
    42161: 'WETH',
  },
  ZeroToken: {
    1: 'ETH',
    11155111: 'ETH',
    56: 'BNB',
    97: 'BNB',
    128: 'HT',
    256: 'HT',
    137: 'MATIC',
    80001: 'MATIC',
    421611: 'ETH',
    42161: 'ETH',
  },
};

export const CHAIN_TOKENS: any = {
  1: {
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  56: {
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  },
  11155111: {
    WETH: '0x49777f12663f2040913414b895f2a7a599c56fd0',
    USDT: '0xbA27D2ff0eD0e3914C129606DE2f8cD25c659b5d',
    USDC: '0xeDFa3e28953bA25173baF11160D4aD435ec002b5',
  },
  97: {
    WBNB: '0x7FcCaDD3e6A3F80e194CaDf13FeDF36B9BBbe98F',
    USDT: '0xF76e44665b9c20b912C57D0BfF425E74FBdeB658',
    USDC: '0x6A472FE58bcEAd5F2dC9Fc85dA4d49d2c055F35c',
    DAI: '0xCB6260C77629c25A065081442EF4E2Bec297aa09',
  },
  256: {
    WHT: '0x8F8da91c632be57C62D60A27f4ed07025Dfb9580',
    USDT: '0xadCf42A9318D10F0D70333812F4A3Ab0622e0ef3',
    USDC: '0xA0993880177D3c7BB57546b0b349F93143877d19',
    DAI: '0xD512A14824D40c82582522BFE936d35354658BC5',
  },
  137: {
    WMATIC: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    USDT: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    USDC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    DAI: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  },
  80001: {
    WMATIC: '0xc56F17386B2c8EF0D58c64A39BAd24001e2D35B9',
    USDT: '0x7F120Dd7EFFbD8E43472F9d5c0EBDecdE36E7AAF',
    USDC: '0xA0511959FC004BBCC62b193126393ddED1564AaA',
    DAI: '0x8B96AF41622236251Ba7eB514e8519f3509928E6',
  },
};

export const CHAIN_CONTRACTS: any = {
  1: {},
  11155111: {},
  56: {},
  97: {},
};

export enum TokenType {
  NATIVE = 'NATIVE',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

export enum ItemType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC1155 = 3,
  ERC721_WITH_CRITERIA = 4,
  ERC1155_WITH_CRITERIA = 5,
}

export const MAX_INT = BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

export const get_env = (name: string, def: string = ''): string => {
  return CONF[name] ?? def;
};

export { CONF, CHAIN_RPC };
