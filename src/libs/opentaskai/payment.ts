import { ethers, BigNumber, BigNumberish, BytesLike, Wallet } from 'ethers';
import { PaymentABI } from './abi/Payment';
import type { Payment as PaymentContract } from './typechain/Payment';
import type { TransactionMethods, ContractMethodReturnType } from '../../common/types';
import { getTransactionMethods } from '../../common/transaction';
import { signData } from '../../common/signature-helper';
import { hexToBytes32, bytes32ToHex } from '../../common/format';
import { TypedDataDomain } from '@ethersproject/abstract-signer';
import { Chain } from '../../chain';
import { BaseContract } from '../../contract';
import { ZERO_ADDRESS } from '../../constants';
import type { TransferData, TradeData } from './types';

import { getNetworkMeta, NetworkMeta } from './network';

export class Payment extends BaseContract {
  networkMeta: NetworkMeta;
  domain: TypedDataDomain | undefined;
  signer: Wallet | undefined;
  public constructor(chain: Chain, contractAddress?: string) {
    const networkMeta = getNetworkMeta(chain.chainId);
    super(chain, contractAddress ?? networkMeta.Payment, PaymentABI);

    this.contract = this.contract as PaymentContract;
    this.networkMeta = networkMeta;
  }

  public async bindAccount(
    _account: string,
    _sn: string,
    _expired: BigNumberish,
    _signature: BytesLike
  ): Promise<TransactionMethods<ContractMethodReturnType<PaymentContract, 'bindAccount'>>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'bindAccount', [_account, _sn, _expired, _signature, payableOverrides]);
  }

  public async unbindAccount(): Promise<
    TransactionMethods<ContractMethodReturnType<PaymentContract, 'unbindAccount'>>
  > {
    return getTransactionMethods(this.contract, 'unbindAccount', []);
  }

  public deposit(
    _to: string, // destination account
    _token: string,
    _amount: BigNumberish,
    _frozen: BigNumberish,
    _sn: BytesLike,
    _expired: BigNumberish,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<PaymentContract, 'deposit'>> {
    let value = BigNumber.from(0);
    if (_token === ZERO_ADDRESS) {
      value = BigNumber.from(_amount);
    }

    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'deposit', [
      _to,
      _token,
      _amount,
      _frozen,
      _sn,
      _expired,
      _signature,
      payableOverrides,
    ]);
  }

  public withdraw(
    _to: string, // destination wallet
    _token: string,
    _available: BigNumberish,
    _frozen: BigNumberish,
    _sn: BytesLike,
    _expired: BigNumberish,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<PaymentContract, 'withdraw'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'withdraw', [
      _to,
      _token,
      _available,
      _frozen,
      _sn,
      _expired,
      _signature,
      payableOverrides,
    ]);
  }

  public freeze(
    _account: string,
    _token: string,
    _amount: BigNumberish,
    _sn: BytesLike,
    _expired: BigNumberish,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<PaymentContract, 'freeze'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'freeze', [
      _account,
      _token,
      _amount,
      _sn,
      _expired,
      _signature,
      payableOverrides,
    ]);
  }

  public unfreeze(
    _account: string,
    _token: string,
    _amount: BigNumberish,
    _sn: BytesLike,
    _expired: BigNumberish,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<PaymentContract, 'unfreeze'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'unfreeze', [
      _account,
      _token,
      _amount,
      _sn,
      _expired,
      _signature,
      payableOverrides,
    ]);
  }

  public transfer(
    _out: string, // destination wallet, no withdrawals are allowed if the address is zero.
    _deal: TransferData,
    _sn: BytesLike,
    _expired: BigNumberish,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<PaymentContract, 'transfer'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'transfer', [_out, _deal, _sn, _expired, _signature, payableOverrides]);
  }

  public cancel(
    _userA: TradeData,
    _userB: TradeData,
    _sn: BytesLike,
    _expired: BigNumberish,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<PaymentContract, 'cancel'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'cancel', [
      _userA,
      _userB,
      _sn,
      _expired,
      _signature,
      payableOverrides,
    ]);
  }

  public async getBalance(_token: string) {
    return await this.contract.getBalance(_token);
  }

  public async getRecord(_sn: string) {
    _sn = hexToBytes32(_sn);
    return await this.contract.records(_sn);
  }

  public async getRecords(_sns: string[]) {
    const sns = _sns.map((d) => hexToBytes32(d));
    return await this.contract.getRecords(sns);
  }

  public async getUserAccount(_account: string, _token: string) {
    _account = hexToBytes32(_account);
    return await this.contract.userAccounts(_account, _token);
  }

  public async getUserAssets(_account: string, _tokens: string[]) {
    _account = hexToBytes32(_account);
    return await this.contract.getUserAssets(_account, _tokens);
  }

  public async getMultiUserAssets(_accounts: string[], _tokens: string[]) {
    const accounts = _accounts.map((d) => hexToBytes32(d));
    return await this.contract.getUserAssets(accounts, _tokens);
  }

  public async getWalletsOfAccount(_account: string) {
    _account = hexToBytes32(_account);
    return await this.contract.getWalletsOfAccount(_account);
  }

  public async foundAccount(_account: string, _wallet?: string) {
    _account = hexToBytes32(_account);
    if (!_wallet) _wallet = await this.chain.getAccount();
    return await this.contract.foundAccount(_account, _wallet);
  }

  public async walletToAccount(_wallet?: string) {
    if (!_wallet) _wallet = await this.chain.getAccount();
    return await this.contract.walletToAccount(_wallet);
  }

  public async getFeeTo() {
    return await this.contract.feeTo();
  }

  public setSigner(_signer: Wallet) {
    this.signer = _signer;
  }

  public async signBindAccountData(account: string, sn: string, expired: string | number | BigNumber): Promise<any> {
    if (!this.signer) throw new Error('no signer');
    account = hexToBytes32(account);
    sn = hexToBytes32(sn);
    const types = ['bytes32', 'bytes32', 'uint256', 'uint256', 'address'];
    const values = [account, sn, expired, this.chain.chainId, this.contract.address];
    const sign = await signData(this.signer, types, values, this.domain);
    return { account, sn, expired, sign };
  }

  public async signDepositData(
    to: string, // destination account
    token: string,
    amount: string | number | BigNumber,
    frozen: string | number | BigNumber,
    sn: string,
    expired: string | number | BigNumber
  ): Promise<any> {
    if (!this.signer) throw new Error('no signer');
    to = hexToBytes32(to);
    sn = hexToBytes32(sn);
    const types = ['bytes32', 'address', 'uint256', 'uint256', 'bytes32', 'uint256', 'uint256', 'address'];
    const values = [to, token, amount, frozen, sn, expired, this.chain.chainId, this.contract.address];
    const sign = await signData(this.signer, types, values, this.domain);
    return { to, token, amount, frozen, sn, expired, sign };
  }

  public async signWithdraw(
    to: string, // destination wallet
    token: string,
    available: string | number | BigNumber,
    frozen: string | number | BigNumber,
    sn: string,
    expired: string | number | BigNumber
  ): Promise<any> {
    if (!this.signer) throw new Error('no signer');
    sn = hexToBytes32(sn);
    const types = ['address', 'address', 'uint256', 'uint256', 'bytes32', 'uint256', 'uint256', 'address'];
    const values = [to, token, available, frozen, sn, expired, this.chain.chainId, this.contract.address];
    const sign = await signData(this.signer, types, values, this.domain);
    return { to, token, available, frozen, sn, expired, sign };
  }

  public async signFreezeData(
    account: string,
    token: string,
    amount: string | number | BigNumber,
    sn: string,
    expired: string | number | BigNumber
  ): Promise<any> {
    if (!this.signer) throw new Error('no signer');
    sn = hexToBytes32(sn);
    account = hexToBytes32(account);
    const types = ['bytes32', 'address', 'uint256', 'bytes32', 'uint256', 'uint256', 'address'];
    const values = [account, token, amount, sn, expired, this.chain.chainId, this.contract.address];
    const sign = await signData(this.signer, types, values, this.domain);
    return { account, token, amount, sn, expired, sign };
  }

  public async signUnFreezeData (
    account: string,
    token: string,
    amount: (string | number | BigNumber),
    fee: (string | number | BigNumber),
    sn: string,
    expired: (string | number | BigNumber),
    domain?: TypedDataDomain
  ): Promise<any> {
    if (!this.signer) throw new Error('no signer');
    sn = hexToBytes32(sn);
    account = hexToBytes32(account);
    const types = ['bytes32', 'address', 'uint256', 'uint256', 'bytes32', 'uint256', 'uint256', 'address'];
    const values = [account, token, amount, fee, sn, expired, this.chain.chainId, this.contract.address];
    const sign = await signData(this.signer, types, values, this.domain);
    return {account, token, amount, fee, sn, expired, sign};
    }

  public async signTransferData(
    out: string, // destination wallet, no withdrawals are allowed if the address is zero.
    token: string,
    from: string, // source account
    to: string, // destination account
    available: string | number | BigNumber,
    frozen: string | number | BigNumber,
    amount: string | number | BigNumber,
    fee: string | number | BigNumber,
    paid: (string | number | BigNumber),
    sn: string,
    expired: string | number | BigNumber,
    domain?: TypedDataDomain
  ): Promise<any> {
    if (!this.signer) throw new Error('no signer');
    sn = hexToBytes32(sn);
    from = hexToBytes32(from);
    to = hexToBytes32(to);

    const types = [
      'address',
      'address',
      'bytes32',
      'bytes32',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'bytes32',
      'uint256',
      'uint256',
      'address',
    ];
    const values = [
      out,
      token,
      from,
      to,
      available,
      frozen,
      amount,
      fee,
      paid,
      sn,
      expired,
      this.chain.chainId,
      this.contract.address,
    ];
    const sign = await signData(this.signer, types, values, this.domain);
    return { out, token, from, to, available, frozen, amount, fee, paid, sn, expired, sign };
  }

  public async signCancelData(
    userA: TradeData,
    userB: TradeData,
    sn: string,
    expired: string | number | BigNumber
  ): Promise<any> {
    if (!this.signer) throw new Error('no signer');
    sn = hexToBytes32(sn);
    userA.account = hexToBytes32(userA.account);
    userB.account = hexToBytes32(userB.account);

    const types = [
      'bytes32',
      'bytes32',
      'address',
      'uint256',
      'uint256',
      'bytes32',
      'address',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'address',
    ];
    const values = [
      sn,
      userA.account,
      userA.token,
      userA.amount,
      userA.fee,
      userB.account,
      userB.token,
      userB.amount,
      userB.fee,
      expired,
      this.chain.chainId,
      this.contract.address,
    ];
    const sign = await signData(this.signer, types, values, this.domain);
    return { userA, userB, sn, expired, sign };
  }
}
