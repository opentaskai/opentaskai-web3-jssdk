import { ethers, BigNumber, Wallet } from 'ethers';
import { chain } from './common';
import { CHAIN_TOKENS } from '../src/constants';
import TEST_CONFIG from './test.config';
import { TokenUtil } from '../src/common/tokenUtil';
import assert from 'assert';
import { getERC20 } from '../src/erc20';
import { getERC721 } from '../src/erc721';
import { getERC1155 } from '../src/erc1155';
import sleep from 'sleep-ts';

describe('TokenUtil', () => {
  const wallet = new Wallet(TEST_CONFIG.pklist[0]);
  const wallet2 = new Wallet(TEST_CONFIG.pklist[1]);
  console.log('wallet:', wallet.address, wallet2.address);
  const tokenUtil = new TokenUtil(chain);
  let res: any;
  beforeAll(async () => {
    console.log('before');
    chain.connect(wallet);
  });

  afterAll(async () => {});

  it('balanceForERC20s', async () => {
    res = await tokenUtil.balanceForERC20s(TEST_CONFIG.erc20list, wallet.address);
    console.log('res', res);
  });
});
