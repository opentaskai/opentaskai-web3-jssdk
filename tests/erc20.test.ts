import { ethers, Wallet, BigNumber } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import { chain } from './common';
import { bnWithoutDecimals, bnWithDecimals } from '../src/common/bignumber';
import { ERC20, getERC20 } from '../src/erc20';
import { CHAIN_TOKENS } from '../src/constants';
import TEST_CONFIG from './test.config';

describe('erc20', () => {
  beforeAll(async () => {
    console.log('before');
    console.log('chainId', chain.chainId);
  });

  afterAll(async () => {});

  describe('#ERC20', () => {
    const weth = chain.getWethAddr();
    const usdt = chain.getTokenAddr('USDT');
    const wallet = new Wallet(TEST_CONFIG.pklist[0]);
    const wallet2 = new Wallet(TEST_CONFIG.pklist[1]);
    console.log('wallet:', wallet.address);
    console.log('wallet2:', wallet2.address);
    console.log('weth:', weth);
    console.log('usdt:', usdt);
    chain.connect(wallet);

    const token = getERC20(chain, usdt);
    let res: any;

    it('balanceOf', async () => {
      res = await token.balanceOf(wallet.address);
      console.log('res:', res);

      res = token.balanceOfEncodeFunction(wallet.address);
      console.log('res:', res);
    });

    it('info', async () => {
      res = await token.info();
      console.log('res:', res);
    });

    it('approve', async () => {
      chain.connect(wallet);
      const amount = bnWithDecimals(100000, 18);
      res = token.approve(weth, amount);
      res = await res.encodeFunction();
      console.log('approve encodeFunction', res);
      console.log('amount', amount.toString());
      const transaction = token.approve(weth, amount);
      const gas = await transaction.estimateGas();
      const gasLimit = gas.add(10000);
      console.log('gas limit:', gas, gasLimit);
      const price = await chain.getGasPrice();
      const gasPrice = BigNumber.from(price).mul(300).div(100);
      console.log('gas price:', price, gasPrice);
      const buildTransaction = await transaction.buildTransaction();
      const calldata = transaction.encodeFunction();
      console.log('transaction', transaction, calldata, buildTransaction, BigNumber.from(gas).toString());
      res = await transaction.transact({gasLimit, gasPrice});
      console.log('hash:', res.hash);
      res = await res.wait();
      console.log('receipt',res);
    });

    // it('send sign tx', async () => {
    //   chain.connect(wallet);
    //   const amount = bnWithDecimals(100000, 18);
    //   res = token.approve(weth, amount);
    //   const callParameter = await res.encodeFunction();
    //   const trans = {
    //     from: wallet.address,
    //     to: usdt,
    //     data: callParameter.data,
    //     value: callParameter.value,
    //   };

    //   console.log('trans data', trans);
    //   res = await chain.signTransaction(trans);
    //   console.log('sign res', res);

    //   chain.connect(wallet2);
    //   res = await chain.sendSignedTx(res);
    //   res = await res.wait();
    //   console.log('send wait', res);
    // });
  });
});
