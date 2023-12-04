import { ethers, Wallet, BigNumber } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import { chain } from './common';
import { bnWithoutDecimals, bnWithDecimals } from '../src/common/bignumber';
import { ZERO_ADDRESS } from '../src/constants';
import { gnosis } from '../src/index';
import TEST_CONFIG from './test.config';
import { ItemType } from '../src/constants';

describe('gnosis', () => {
  beforeAll(async () => {
    console.log('before');
    console.log('chainId', chain.chainId);
  });

  afterAll(async () => {});

  describe('#multisend', () => {
    let res: any;
    const wallet = new Wallet(TEST_CONFIG.pklist[0]);
    const wallet2 = new Wallet(TEST_CONFIG.pklist[1]);
    console.log('wallet:', wallet.address);
    console.log('wallet2:', wallet2.address);

    it('test', async () => {
      chain.connect(wallet);
      const params: gnosis.multisend.SendTokenParam[] = [];
      params.push({
        type: ItemType.NATIVE,
        token: ZERO_ADDRESS,
        to: wallet2.address,
        amount: ethers.utils.parseEther('0.001'),
        identifier: '0',
      });
      params.push({
        type: ItemType.ERC20,
        token: chain.getTokenAddr('USDT'),
        to: wallet2.address,
        amount: '1000000',
        identifier: '0',
      });
      res = await gnosis.multisend.multiSendTokens(chain, params);
      console.log(res);
    });
  });
});
