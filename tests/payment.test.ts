import { ethers, Wallet, BigNumber } from 'ethers';
import { chain } from './common';
import { ZERO_ADDRESS } from '../src/constants';
import { Payment } from '../src/libs/opentaskai';
import { bnWithoutDecimals, bnWithDecimals } from '../src/common/bignumber';

describe('Payment', () => {
  let res: any;

  beforeAll(async () => {
    console.log('before');
    console.log('chainId', chain.chainId);
  });

  afterAll(async () => {});

  describe('#Payment', () => {
    let expired = Math.floor(Date.now() / 1000) + 300;
    const payment = new Payment(chain);
    console.log('payment address:', payment.address);

    it('balance', async () => {
      res = await payment.getBalance(ZERO_ADDRESS);
      console.log('res:', res);
    });

    it('signDepositAndFreezeData', async () => {
      payment.setSigner(chain.signer as Wallet);
      const to = payment.address;
      const token = chain.getTokenAddr('USDT');
      const available = bnWithDecimals(2, 6);
      const frozen = bnWithDecimals(1, 6);
      const sn = 'f1ca05d4de504bc9900462d7bc358e9d';
      res = await payment.signDepositAndFreezeData(to, token, available, frozen, sn, expired);
      console.log('res:', res);
    });
  });
});
