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
    const nft = getNFT(chain, network.AIGenesis);
    console.log('nft address:', nft.address);

    it('balance', async () => {
      res = await nft.name();
      console.log('res:', res);
    });

    it('exists', async () => {
      res = await nft.exists(0);
      console.log('exists:', res);
    });

    it('records', async () => {
      res = await nft.records('0x00000000000000000000000000000000f1ca05d4de504bc9900462d7bc358e9d');
      console.log('records:', res);
    });

    it('signMintData', async () => {
      let expired = Math.floor(Date.now() / 1000) + 300;
      nft.setSigner(chain.signer as Wallet);
      const sn = 'f1ca05d4de504bc9900462d7bc358e9d';
      res = await nft.signMintData(sn, expired);
      console.log('res:', res);
    });
  });
});
