import { ethers } from 'ethers';
import { ERC721ABI } from './common/abi/ERC721';
import type { ERC721 as ERC721Contract } from './common/typechain/ERC721';
import type { TransactionMethods, ContractMethodReturnType, TypedTokenInfo } from './common/types';
import { getTransactionMethods } from './common/transaction';
import { Chain } from './chain';
import { BaseContract } from './contract';

export class ERC721 extends BaseContract {
  public constructor(chain: Chain, contractAddress: string, abi: any = ERC721ABI) {
    super(chain, contractAddress, abi);

    this.contract = this.contract as ERC721Contract;
  }

  public transferFrom(
    from: string,
    to: string,
    tokenId: number | string
  ): TransactionMethods<ContractMethodReturnType<ERC721Contract, 'transferFrom'>> {
    return getTransactionMethods(this.contract, 'transferFrom', [from, to, tokenId]);
  }

  public approve(
    operator: string,
    tokenId: number | string
  ): TransactionMethods<ContractMethodReturnType<ERC721Contract, 'approve'>> {
    return getTransactionMethods(this.contract, 'approve', [operator, tokenId]);
  }

  public setApprovalForAll(
    operator: string,
    approved: boolean
  ): TransactionMethods<ContractMethodReturnType<ERC721Contract, 'setApprovalForAll'>> {
    return getTransactionMethods(this.contract, 'setApprovalForAll', [operator, approved]);
  }

  public async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.isApprovedForAll(owner, operator);
  }

  public async info(): Promise<TypedTokenInfo> {
    let token: TypedTokenInfo = this.chain.getToken(this.address);
    if (!token) {
      token = await this._info();
    }
    return token;
  }

  public async name(): Promise<string> {
    const token: TypedTokenInfo = await this.info();
    return token.name;
  }

  public async symbol(): Promise<string> {
    const token: TypedTokenInfo = await this.info();
    return token.symbol;
  }

  public async balanceOf(address: string): Promise<string> {
    const res: ethers.BigNumber = await this.contract.balanceOf(address);
    return res.toString();
  }

  public async tokenURI(tokenId: number | string): Promise<string> {
    try {
      return await this.contract.tokenURI(tokenId);
    } catch (e) {
      console.warn('tokenURI except', e);
      return '';
    }
  }

  public async ownerOf(tokenId: number | string): Promise<string> {
    return await this.contract.ownerOf(tokenId);
  }

  private async _info(): Promise<TypedTokenInfo> {
    if (this.chain.isZeroAddress(this.address)) {
      throw new Error('invlaid erc721 address');
    }
    const [name, symbol] = await Promise.all([this.contract.name(), this.contract.symbol()]);

    const token: TypedTokenInfo = {
      standard: 'erc721',
      address: this.address,
      name: name,
      symbol: symbol,
      decimals: 0,
    };
    this.chain.setToken(this.address, token);
    return token;
  }

  async getTransferEvent(fromBlock: string | number, toBlock: string | number = 'latest') {
    const filter = this.contract.filters.Transfer();
    return await this.contract.queryFilter(filter, fromBlock, toBlock);
  }

  public approveEncodeFunction(operator: string, tokenId: number | string) {
    const transactiton = this.approve(operator, tokenId);
    return transactiton.encodeFunction();
  }

  public setApprovalForAllEncodeFunction(operator: string, approved: boolean) {
    const transactiton = this.setApprovalForAll(operator, approved);
    return transactiton.encodeFunction();
  }

  public transferFromEncodeFunction(from: string, to: string, tokenId: number | string) {
    const transactiton = this.transferFrom(from, to, tokenId);
    return transactiton.encodeFunction();
  }

  public ownerOfEncodeFunction(tokenId: number | string) {
    return this.contract.interface.encodeFunctionData('ownerOf', [tokenId]);
  }

  public isApprovedForAllEncodeFunction(owner: string, operator: string) {
    return this.contract.interface.encodeFunctionData('isApprovedForAll', [owner, operator]);
  }
}

export function getERC721(chain: Chain, address: string): ERC721 {
  if (!chain.contractmaps[address.toLowerCase()]) {
    new ERC721(chain, address);
  }
  return chain.contractmaps[address.toLowerCase()] as ERC721;
}
