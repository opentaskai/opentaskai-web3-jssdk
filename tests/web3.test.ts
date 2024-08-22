import { ethers, Wallet, BigNumber } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import { chain } from './common';
import { bnWithoutDecimals, bnWithDecimals } from '../src/common/bignumber';
import { CHAIN_TOKENS } from '../src/constants';
import TEST_CONFIG from './test.config';

describe('erc20', () => {
  beforeAll(async () => {
    console.log('before');
    console.log('chainId', chain.chainId);
  });

  afterAll(async () => {});

  describe('#chain', () => {
    const weth = chain.getWethAddr();
    const usdt = chain.getTokenAddr('USDT');
    const wallet = new Wallet(TEST_CONFIG.pklist[0]);
    const wallet2 = new Wallet(TEST_CONFIG.pklist[1]);
    console.log('wallet:', wallet.address);
    console.log('wallet2:', wallet2.address);
    console.log('weth:', weth);
    console.log('usdt:', usdt);
    chain.connect(wallet);

    let res: any;

    it('getTransactionCount', async () => {
      res = await chain.getTransactionCount(wallet.address);
      console.log('latest:', res);

      res = await chain.getTransactionCount(wallet.address, 'pending');
      console.log('pending:', res);
    });
  });
});
