import { ethers, Wallet, BigNumber } from 'ethers';
import { chain } from './common';
import { ZERO_ADDRESS } from '../src/constants';
import { NFT, getNFT, getNetworkMeta } from '../src/libs/opentaskai';

describe('NFT', () => {
  let res: any;

  beforeAll(async () => {
    console.log('before');
    console.log('chainId', chain.chainId);
  });

  afterAll(async () => {});

  describe('#nft', () => {
    const network = getNetworkMeta(chain.chainId);
    const nft = getNFT(chain, network.AIOriginals);
    console.log('nft address:', nft.address);

    it('balance', async () => {
      res = await nft.name();
      console.log('res:', res);
    });

    it('signMintData', async () => {
      nft.setSigner(chain.signer as Wallet);
      const sn = 'f1ca05d4de504bc9900462d7bc358e9d';
      res = await nft.signMintData(sn);
      console.log('res:', res);
    });
  });
});
