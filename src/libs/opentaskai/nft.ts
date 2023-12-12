import { ethers, BigNumber, BytesLike, Wallet } from 'ethers';
import { NFTABI } from './abi/NFT';
import type { NFT as NFTContract } from './typechain/NFT';
import type { TransactionMethods, ContractMethodReturnType } from '../../common/types';
import { getTransactionMethods } from '../../common/transaction';
import { signData } from '../../common/signature-helper';
import { TypedDataDomain } from '@ethersproject/abstract-signer';
import { Chain } from '../../chain';
import { ERC721 } from '../../erc721';

import { getNetworkMeta, NetworkMeta } from './network';

export class NFT extends ERC721 {
  networkMeta: NetworkMeta;
  domain: TypedDataDomain | undefined;
  signer: Wallet | undefined;
  public constructor(chain: Chain, contractAddress?: string) {
    const networkMeta = getNetworkMeta(chain.chainId);
    super(chain, contractAddress ?? networkMeta.AIOriginals, NFTABI);

    this.contract = this.contract as NFTContract;
    this.networkMeta = networkMeta;
  }

  public mint(
    _sn: BytesLike,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<NFTContract, 'mint'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'mint', [_sn, _signature, payableOverrides]);
  }

  public async getTokens(_user: string) {
    return await this.contract.getTokens(_user);
  }

  public setSigner(_signer: Wallet) {
    this.signer = _signer;
  }

  public async signMintData(sn: string): Promise<any> {
    if (!this.signer) throw new Error('no signer');
    sn = ethers.utils.hexZeroPad('0x' + sn, 32);
    const types = ['bytes32', 'address'];
    const values = [sn, this.contract.address];
    const sign = await signData(this.signer, types, values, this.domain);
    return { sn, sign };
  }
}

export function getNFT(chain: Chain, address: string): NFT {
  if (!chain.contractmaps[address.toLowerCase()]) {
    new NFT(chain, address);
  }
  return chain.contractmaps[address.toLowerCase()] as NFT;
}
