import { LocalChain } from '../src/chain';
import { CONF } from '../src/constants';
import dotenv from 'dotenv';
dotenv.config();
const chainId = process.env?.CHAIN_ID ? Number(process.env.CHAIN_ID) : 11155111;
const chainRPC = process.env?.CHAIN_RPC ?? '';
export const chain = new LocalChain(chainId, chainRPC);

console.log('chainId', chainId);
console.log('chainRPC', chainRPC);
console.log('CONF', CONF);
