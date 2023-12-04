import { multicall } from '../src/multicall';
import { ethers, BigNumber, Wallet } from 'ethers';
import { chain } from './common';
import TEST_CONFIG from './test.config';

import { getERC20 } from '../src/erc20';
import { getERC721 } from '../src/erc721';

export function formatAddress(val: string) {
  if (val.length === 66) {
    return '0x' + val.substring(26);
  }
  return val;
}

describe('Multicall', () => {
  const wallet = new Wallet(TEST_CONFIG.pklist[0]);
  console.log('wallet:', wallet.address);
  let res: any;
  beforeAll(async () => {
    console.log('before');
    jest.setTimeout(600000);
    chain.connect(wallet);
  });

  afterAll(async () => {});

  it('mulitcall', async () => {
    const erc721 = getERC721(chain, TEST_CONFIG.nftlist[0]);
    res = erc721.ownerOfEncodeFunction(11);
    console.log('ownerOfEncodeFunction', res);
    const callData = [
      {
        target: TEST_CONFIG.nftlist[0],
        gasLimit: 0,
        callData: res,
      },
    ];

    res = await multicall(chain, callData);
    console.log('mulitcall', res[0].length, res[0], formatAddress(res[0]));
  });
});
