import { ethers, BigNumber, BigNumberish, BytesLike, Wallet } from 'ethers';
import { PaymentABI } from './abi/Payment';
import type { Payment as PaymentContract } from './typechain/Payment';
import type { TransactionMethods, ContractMethodReturnType } from '../../common/types';
import { getTransactionMethods } from '../../common/transaction';
import { signData } from '../../common/signature-helper';
import { TypedDataDomain } from '@ethersproject/abstract-signer';
import { Chain } from '../../chain';
import { BaseContract } from '../../contract';
import { ZERO_ADDRESS } from '../../constants';
import type { Account, AssetAccount, DetailedAccount, TransferData, TradeData } from './types';

import { getNetworkMeta, NetworkMeta } from './network';

export class Payment extends BaseContract {
  networkMeta: NetworkMeta;
  domain: TypedDataDomain | undefined;
  signer: Wallet | undefined;
  public constructor(chain: Chain, contractAddress?: string) {
    const networkMeta = getNetworkMeta(chain.chainId);
    super(chain, contractAddress ?? networkMeta.PaymentContract, PaymentABI);

    this.contract = this.contract as PaymentContract;
    this.networkMeta = networkMeta;
  }

  public depositAndFreeze(
    _to: string,
    _token: string,
    _available: BigNumberish,
    _frozen: BigNumberish,
    _sn: BytesLike,
    _expired: BigNumberish,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<PaymentContract, 'depositAndFreeze'>> {
    let value = BigNumber.from(0);
    if (_token === ZERO_ADDRESS) {
      value = value.add(_available).add(_frozen);
    }

    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'depositAndFreeze', [
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

  public withdrawWithDetail(
    _to: string,
    _token: string,
    _available: BigNumberish,
    _frozen: BigNumberish,
    _sn: BytesLike,
    _expired: BigNumberish,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<PaymentContract, 'withdrawWithDetail'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'withdrawWithDetail', [
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
    _token: string,
    _amount: BigNumberish,
    _sn: BytesLike,
    _expired: BigNumberish,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<PaymentContract, 'freeze'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'freeze', [
      _token,
      _amount,
      _sn,
      _expired,
      _signature,
      payableOverrides,
    ]);
  }

  public unfreeze(
    _token: string,
    _amount: BigNumberish,
    _sn: BytesLike,
    _expired: BigNumberish,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<PaymentContract, 'unfreeze'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'unfreeze', [
      _token,
      _amount,
      _sn,
      _expired,
      _signature,
      payableOverrides,
    ]);
  }

  public transfer(
    _isWithdraw: boolean,
    _deal: TransferData,
    _sn: BytesLike,
    _expired: BigNumberish,
    _signature: BytesLike
  ): TransactionMethods<ContractMethodReturnType<PaymentContract, 'transfer'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'transfer', [
      _isWithdraw,
      _deal,
      _sn,
      _expired,
      _signature,
      payableOverrides,
    ]);
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
    return await this.contract.records(_sn);
  }

  public async getRecords(_sns: string[]) {
    return await this.contract.getRecords(_sns);
  }

  public async getUserAccount(_user: string, _token: string) {
    return await this.contract.userAccounts(_user, _token);
  }

  public async getUserAssets(_user: string, _tokens: string[]) {
    return await this.contract.getUserAssets(_user, _tokens);
  }

  public async getMultiUserAssets(_users: string[], _tokens: string[]) {
    return await this.contract.getUserAssets(_users, _tokens);
  }

  public setSigner(_signer: Wallet) {
    this.signer = _signer;
  }

  public async signDepositAndFreezeData(
    to: string,
    token: string,
    available: string | number | BigNumber,
    frozen: string | number | BigNumber,
    sn: string,
    expired: string | number | BigNumber
  ): Promise<any> {
    if (!this.signer) throw new Error('no signer');
    sn = ethers.utils.hexZeroPad('0x' + sn, 32);
    const types = ['address', 'address', 'uint256', 'uint256', 'bytes32', 'uint256', 'uint256', 'address'];
    const values = [to, token, available, frozen, sn, expired, this.chain.chainId, this.contract.address];
    const sign = await signData(this.signer, types, values, this.domain);
    return { to, token, available, frozen, sn, expired, sign };
  }

  public async signWithdrawWithDetail(
    to: string,
    token: string,
    available: string | number | BigNumber,
    frozen: string | number | BigNumber,
    sn: string,
    expired: string | number | BigNumber
  ): Promise<any> {
    if (!this.signer) throw new Error('no signer');
    sn = ethers.utils.hexZeroPad('0x' + sn, 32);
    const types = ['address', 'address', 'uint256', 'uint256', 'bytes32', 'uint256', 'uint256', 'address'];
    const values = [to, token, available, frozen, sn, expired, this.chain.chainId, this.contract.address];
    const sign = await signData(this.signer, types, values, this.domain);
    return { to, token, available, frozen, sn, expired, sign };
  }

  public async signFreezeData(
    token: string,
    amount: string | number | BigNumber,
    sn: string,
    expired: string | number | BigNumber
  ): Promise<any> {
    if (!this.signer) throw new Error('no signer');
    sn = ethers.utils.hexZeroPad('0x' + sn, 32);
    const types = ['address', 'uint256', 'bytes32', 'uint256', 'uint256', 'address'];
    const values = [token, amount, sn, expired, this.chain.chainId, this.contract.address];
    const sign = await signData(this.signer, types, values, this.domain);
    return { token, amount, sn, expired, sign };
  }

  public async signTransferData(
    token: string,
    from: string,
    to: string,
    available: string | number | BigNumber,
    frozen: string | number | BigNumber,
    amount: string | number | BigNumber,
    fee: string | number | BigNumber,
    sn: string,
    expired: string | number | BigNumber,
    domain?: TypedDataDomain
  ): Promise<any> {
    if (!this.signer) throw new Error('no signer');

    sn = ethers.utils.hexZeroPad('0x' + sn, 32);
    const types = [
      'address',
      'address',
      'address',
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
      token,
      from,
      to,
      available,
      frozen,
      amount,
      fee,
      sn,
      expired,
      this.chain.chainId,
      this.contract.address,
    ];
    const sign = await signData(this.signer, types, values, this.domain);
    return { token, from, to, available, frozen, amount, fee, sn, expired, sign };
  }

  public async signCancelData(
    userA: TradeData,
    userB: TradeData,
    sn: string,
    expired: string | number | BigNumber
  ): Promise<any> {
    if (!this.signer) throw new Error('no signer');

    sn = ethers.utils.hexZeroPad('0x' + sn, 32);
    const types = [
      'bytes32',
      'address',
      'address',
      'uint256',
      'uint256',
      'address',
      'address',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'address',
    ];
    const values = [
      sn,
      userA.user,
      userA.token,
      userA.amount,
      userA.fee,
      userB.user,
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
