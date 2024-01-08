import { ethers } from 'ethers';
import { ERC1155ABI } from './common/abi/ERC1155';
import type { ERC1155 as ERC1155Contract } from './common/typechain/ERC1155';
import type { TransactionMethods, ContractMethodReturnType, TypedTokenInfo } from './common/types';
import { getTransactionMethods } from './common/transaction';
import { Chain } from './chain';
import { BaseContract } from './contract';

export class ERC1155 extends BaseContract {
  public constructor(chain: Chain, contractAddress: string, abi: any = ERC1155ABI) {
    super(chain, contractAddress, abi);

    this.contract = this.contract as ERC1155Contract;
  }

  public safeTransferFrom(
    from: string,
    to: string,
    id: number | string,
    amount: number | string,
    data: string
  ): TransactionMethods<ContractMethodReturnType<ERC1155Contract, 'safeTransferFrom'>> {
    if (!data) data = '0x';
    return getTransactionMethods(this.contract, 'safeTransferFrom', [from, to, id, amount, data]);
  }

  public safeBatchTransferFrom(
    from: string,
    to: string,
    ids: number[] | string[],
    amounts: number[] | string[],
    data: string
  ): TransactionMethods<ContractMethodReturnType<ERC1155Contract, 'safeBatchTransferFrom'>> {
    if (!data) data = '0x';
    return getTransactionMethods(this.contract, 'safeBatchTransferFrom', [from, to, ids, amounts, data]);
  }

  public setApprovalForAll(
    operator: string,
    approved: boolean
  ): TransactionMethods<ContractMethodReturnType<ERC1155Contract, 'setApprovalForAll'>> {
    return getTransactionMethods(this.contract, 'setApprovalForAll', [operator, approved]);
  }

  public async name(): Promise<string> {
    return '';
  }

  public async symbol(): Promise<string> {
    return '';
  }

  public async info(): Promise<TypedTokenInfo> {
    let token: TypedTokenInfo = this.chain.getToken(this.address);
    if (!token) {
      token = await this._info();
    }
    return token;
  }

  public async balanceOf(account: string, id: number | string): Promise<string> {
    const res: ethers.BigNumber = await this.contract.balanceOf(account, id);
    return res.toString();
  }

  public async balanceOfBatch(accounts: string[], ids: number[] | string[]): Promise<string[]> {
    const res: ethers.BigNumber[] = await this.contract.balanceOfBatch(accounts, ids);
    return res.map((d) => {
      return d.toString();
    });
  }

  public async tokenURI(tokenId: number | string): Promise<string> {
    return this.uri(tokenId);
  }

  public async uri(tokenId: number | string): Promise<string> {
    try {
      return await this.contract.uri(tokenId);
    } catch (e) {
      console.warn('uri except', e);
      return '';
    }
  }

  public async ownerOf(tokenId: number | string): Promise<string> {
    return '';
  }

  private async _info(): Promise<TypedTokenInfo> {
    if (this.chain.isZeroAddress(this.address)) {
      throw new Error('invlaid erc1155 address');
    }
    let token: TypedTokenInfo = {
      standard: 'erc1155',
      address: this.address,
      name: '',
      symbol: '',
      decimals: 0,
    };
    this.chain.setToken(this.address, token);
    return token;
  }

  public setApprovalForAllEncodeFunction(operator: string, approved: boolean) {
    const transactiton = this.setApprovalForAll(operator, approved);
    return transactiton.encodeFunction();
  }

  public safeTransferFromEncodeFunction(
    from: string,
    to: string,
    id: number | string,
    amount: number | string,
    data: string
  ) {
    if (!data) data = '0x';
    const transactiton = this.safeTransferFrom(from, to, id, amount, data);
    return transactiton.encodeFunction();
  }

  public safeBatchTransferFromEncodeFunction(
    from: string,
    to: string,
    ids: number[] | string[],
    amounts: number[] | string[],
    data: string
  ) {
    if (!data) data = '0x';
    const transactiton = this.safeBatchTransferFrom(from, to, ids, amounts, data);
    return transactiton.encodeFunction();
  }

  public ownerOfEncodeFunction(tokenId: number | string) {
    return '';
  }

  public balanceOfEncodeFunction(account: string, id: number | string) {
    return this.contract.interface.encodeFunctionData('balanceOf', [account, id]);
  }

  public balanceOfBatchEncodeFunction(accounts: string[], ids: number[] | string[]) {
    return this.contract.interface.encodeFunctionData('balanceOfBatch', [accounts, ids]);
  }

  public isApprovedForAllEncodeFunction(owner: string, operator: string) {
    return this.contract.interface.encodeFunctionData('isApprovedForAll', [owner, operator]);
  }

  async getTransferSingleEvent(fromBlock: string | number, toBlock: string | number = 'latest') {
    const filter = this.contract.filters.TransferSingle();
    return await this.contract.queryFilter(filter, fromBlock, toBlock);
  }

  async getTransferBatchEvent(fromBlock: string | number, toBlock: string | number = 'latest') {
    const filter = this.contract.filters.TransferBatch();
    return await this.contract.queryFilter(filter, fromBlock, toBlock);
  }

  public async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.isApprovedForAll(owner, operator);
  }
}

export function getERC1155(chain: Chain, address: string): ERC1155 {
  if (!chain.contractmaps[address.toLowerCase()]) {
    new ERC1155(chain, address);
  }
  return chain.contractmaps[address.toLowerCase()] as ERC1155;
}
