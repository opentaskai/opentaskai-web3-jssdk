import { BigNumber } from 'ethers';
import { ERC20ABI } from './common/abi/ERC20';
import type { ERC20 as ERC20Contract } from './common/typechain/ERC20';
import type { TransactionMethods, ContractMethodReturnType, TypedTokenInfo } from './common/types';
import { getTransactionMethods } from './common/transaction';
import { Chain } from './chain';
import { BaseContract } from './contract';

export class ERC20 extends BaseContract {
  maxAllowanced: string = BigNumber.from(10).pow(64).toString();
  public constructor(chain: Chain, contractAddress: string) {
    super(chain, contractAddress, ERC20ABI);

    this.contract = this.contract as ERC20Contract;
  }

  public approve(
    spender: string,
    amount?: string
  ): TransactionMethods<ContractMethodReturnType<ERC20Contract, 'approve'>> {
    if (!amount) {
      amount = this.maxAllowanced;
    }
    return getTransactionMethods(this.contract, 'approve', [spender, amount]);
  }

  public transfer(to: string, amount: string): TransactionMethods<ContractMethodReturnType<ERC20Contract, 'transfer'>> {
    return getTransactionMethods(this.contract, 'transfer', [to, amount]);
  }

  public transferFrom(
    from: string,
    to: string,
    amount: string
  ): TransactionMethods<ContractMethodReturnType<ERC20Contract, 'transferFrom'>> {
    return getTransactionMethods(this.contract, 'transferFrom', [from, to, amount]);
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

  public async decimals(): Promise<number> {
    const token: TypedTokenInfo = await this.info();
    return token.decimals;
  }

  public async balanceOf(address: string): Promise<string> {
    if (this.chain.isZeroAddress(this.address)) {
      const res: BigNumber = await this.provider.getBalance(address);
      return res.toString();
    }
    const res: BigNumber = await this.contract.balanceOf(address);
    return res.toString();
  }

  public async allowance(owner: string, spender: string): Promise<string> {
    if (this.chain.isZeroAddress(this.address)) {
      return BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').toString();
    }
    const res: BigNumber = await this.contract.allowance(owner, spender);
    return res.toString();
  }

  private async _info(): Promise<TypedTokenInfo> {
    const token: TypedTokenInfo = {
      standard: 'erc20',
      address: this.address,
      name: this.chain.zeroSymbol(),
      symbol: this.chain.zeroSymbol(),
      decimals: 18,
    };
    if (!this.chain.isZeroAddress(this.address)) {
      const [name, symbol, decimals] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.decimals(),
      ]);
      token.name = name;
      token.symbol = symbol;
      token.decimals = decimals;
    }
    this.chain.setToken(this.address, token);
    return token;
  }

  async getTransferEvent(fromBlock: string | number, toBlock: string | number = 'latest') {
    const filter = this.contract.filters.Transfer();
    return await this.contract.queryFilter(filter, fromBlock, toBlock);
  }

  public approveEncodeFunction(spender: string, amount: string) {
    const transactiton = this.approve(spender, amount);
    return transactiton.encodeFunction();
  }

  public transferEncodeFunction(to: string, amount: string) {
    const transactiton = this.transfer(to, amount);
    return transactiton.encodeFunction();
  }

  public transferFromEncodeFunction(from: string, to: string, amount: string) {
    const transactiton = this.transferFrom(from, to, amount);
    return transactiton.encodeFunction();
  }

  public balanceOfEncodeFunction(address: string) {
    return this.contract.interface.encodeFunctionData('balanceOf', [address]);
  }

  public allowanceEncodeFunction(owner: string, spender: string) {
    return this.contract.interface.encodeFunctionData('allowance', [owner, spender]);
  }

  async getEvent(fromBlock: string | number, toBlock: string | number = 'latest') {
    const filter: any = {
      address: this.address,
    };
    return await this.contract.queryFilter(filter, fromBlock, toBlock);
  }
}

export function getERC20(chain: Chain, address: string): ERC20 {
  if (!chain.contractmaps[address.toLowerCase()]) {
    new ERC20(chain, address);
  }
  return chain.contractmaps[address.toLowerCase()] as ERC20;
}
