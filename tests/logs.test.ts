import { ethers, Wallet, BigNumber } from 'ethers';
import { chain } from './common';
import TEST_CONFIG from './test.config';

describe('event logs', () => {
  beforeAll(async () => {
    console.log('before');
    console.log('chainId', chain.chainId);
  });

  afterAll(async () => {});

  describe('#getLogs', () => {
    let res: any;
    const wallet = new Wallet(TEST_CONFIG.pklist[0]);
    const wallet2 = new Wallet(TEST_CONFIG.pklist[1]);
    console.log('wallet:', wallet.address);
    console.log('wallet2:', wallet2.address);

    it('getBlock', async () => {
      res = await chain.getBlock(7637189);
      console.log('getBlock', res);
    });

    // it('test', async () => {
    //   res = await chain.getLogs({
    //     fromBlock: 7637189,
    //     toBlock: 7637189 + 10,
    //   });
    //   console.log('getLogs', res);
    // });
  });
});
