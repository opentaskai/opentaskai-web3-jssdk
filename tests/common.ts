import { LocalChain } from '../src/chain';
import { CONF } from '../src/constants';
import dotenv from 'dotenv';
dotenv.config();
const chainId = process.env?.CHAIN_ID ? Number(process.env.CHAIN_ID) : 5;
export const chain = new LocalChain(chainId);

console.log('chainId', chainId);
console.log('CONF', CONF);
