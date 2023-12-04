import assert from 'assert';
import { ethers, Wallet, BigNumber } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import { chain } from './common';
import { bnWithoutDecimals, bnWithDecimals } from '../src/common/bignumber';
import { ERC20ABI } from '../src/common/abi/ERC20';
import { ERC20 } from '../src/erc20';
import { CHAIN_TOKENS } from '../src/constants';
import TEST_CONFIG from './test.config';

describe('ethers', () => {
  beforeAll(async () => {
    console.log('before');
    console.log('chainId', chain.chainId);
  });

  afterAll(async () => {});

  describe('#chain', () => {
    let res: any;
    const wallet = new Wallet(TEST_CONFIG.pklist[0]);
    const wallet2 = new Wallet(TEST_CONFIG.pklist[1]);
    console.log('wallet:', wallet.address);
    console.log('wallet2:', wallet2.address);

    it('provider', async () => {
      const wallet = new Wallet(TEST_CONFIG.pklist[0]);
      let signer = chain.getSigner(0);
      console.log('signer:', await signer.getAddress());
      chain.connect(wallet);
      signer = chain.getSigner(0);
      console.log('signer2:', await signer.getAddress());
      signer = chain.getSigner(wallet.address);
      console.log('signer3:', await signer.getAddress());

      res = await chain.getBlockNumber();
      console.log('getBlockNumber', res);

      res = await chain.getGasPrice();
      console.log('getGasPrice', res.toString(), bnWithoutDecimals(res, 9));
    });
  });

  describe('#Util', () => {
    let res: any;

    it('test', async () => {
      res = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('abc')).substring(2);
      console.log('res:', res);

      res = BigNumber.from(-1).toString();
      console.log(
        'res:',
        res,
        BigNumber.from(1).sub(BigNumber.from(2)).toString(),
        BigNumber.from(2).add(BigNumber.from(-1)).toString()
      );

      res = bnWithoutDecimals('1000000000000000000', 18);
      console.log('res:', res);

      res = BigNumber.from(10).pow(64).toString();
      console.log('10**64 res:', res);
      res = BigNumber.from(2).pow(255).toString();
      console.log('2**255 res:', res);

      res = BigNumber.from(0).toHexString();
      console.log('0 hex res:', res);
      res = BigNumber.from(10).toHexString();
      console.log('10 hex res:', res);

      res = ethers.utils.hexValue(27);
      console.log('res', res);

      res = formatBytes32String('');
      console.log('0 bytes32', res);
    });

    it('sign', async () => {
      res = ethers.utils.splitSignature(
        '0xa03c1db1cbb268b9c96822e8107cfe94c35bb25fbec9cbfd04b80a8f2142146747f4034520eb9a98c95c39e0e4067248408e2bdbe29104e7df97442a1546eb101b'
      );
      console.log('sign ', res);
    });

    it('abi', async () => {
      const weth = chain.getWethAddr();
      const amount = bnWithDecimals(100000, 18);

      const contract = new ethers.utils.Interface(ERC20ABI);
      const res1 = contract.encodeFunctionData('approve', [weth, amount]);
      console.log('encodeFunctionData', res1);

      const token = new ERC20(chain, weth);
      const transaction = token.approve(weth, amount);
      const res2 = transaction.encodeFunction();
      console.log('encodeFunction', res2);

      assert.strictEqual(res1, res2.data);
    });
  });
});
