import { BigNumber } from 'ethers';
import { WETH9ABI } from './common/abi/WETH9';
import type { WETH9 as WETH9Contract } from './common/typechain/WETH9';
import { Chain } from './chain';
import { BaseContract } from './contract';
import type { TransactionMethods, ContractMethodReturnType, TypedTokenInfo, TypedCallParameter } from './common/types';
import { getTransactionMethods } from './common/transaction';

export class WETH9 extends BaseContract {
  maxAllowanced: string = BigNumber.from(10).pow(64).toString();

  public constructor(chain: Chain, contractAddress: string) {
    super(chain, contractAddress, WETH9ABI);
    this.contract = this.contract as WETH9Contract;
  }

  public deposit(value: string): TransactionMethods<ContractMethodReturnType<WETH9Contract, 'deposit'>> {
    return getTransactionMethods(this.contract, 'deposit', [{ value }]);
  }

  public withdraw(amount: string): TransactionMethods<ContractMethodReturnType<WETH9Contract, 'withdraw'>> {
    return getTransactionMethods(this.contract, 'withdraw', [amount]);
  }

  public approve(
    spender: string,
    amount?: string
  ): TransactionMethods<ContractMethodReturnType<WETH9Contract, 'approve'>> {
    if (!amount) {
      amount = this.maxAllowanced;
    }
    return getTransactionMethods(this.contract, 'approve', [spender, amount]);
  }

  public transfer(to: string, amount: string): TransactionMethods<ContractMethodReturnType<WETH9Contract, 'transfer'>> {
    return getTransactionMethods(this.contract, 'transfer', [to, amount]);
  }

  public transferFrom(
    from: string,
    to: string,
    amount: string
  ): TransactionMethods<ContractMethodReturnType<WETH9Contract, 'transferFrom'>> {
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

  public callDeposit(value: string): TypedCallParameter {
    const transactiton = this.deposit(value);
    const data = transactiton.encodeFunction();
    return {
      address: this.address,
      calldata: data.data.toString(),
      value,
    };
  }

  public callWithdraw(value: string): TypedCallParameter {
    const transactiton = this.withdraw(value);
    const data = transactiton.encodeFunction();
    return {
      address: this.address,
      calldata: data.data.toString(),
      value: '0',
    };
  }
}
