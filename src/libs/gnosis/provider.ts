import SafeAppsSDK, {
  TransactionConfig,
  GatewayTransactionDetails,
  SendTransactionsParams,
} from '@gnosis.pm/safe-apps-sdk';
import {
  BlockTag,
  FeeData,
  Provider,
  Filter,
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/abstract-provider';
import { BigNumber, BigNumberish } from 'ethers';
import type { TransactionRequest } from '../../common/types';
import { Network } from '@ethersproject/networks';
import sleep from 'sleep-ts';
import { time } from 'console';
import { receiveMessageOnPort } from 'worker_threads';

export declare type GnosisSafeInfo = {
  safeAddress: string;
  chainId: number;
  threshold: number;
  owners: string[];
  isReadOnly: boolean;
  network?: string;
};

export declare type GnosisSafeReceipt = GatewayTransactionDetails & {
  status: number;
};

export function toString(value: string | number | BigNumberish | undefined) {
  if (value === undefined) return value;
  if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) {
    return BigNumber.from(value).toString();
  }
  return value.toString();
}

export function toTransactionConfig(transaction: TransactionRequest) {
  let txs: TransactionConfig = {};
  if (transaction?.from) txs.from = transaction.from;
  if (transaction?.to) txs.to = transaction.to;
  if (transaction?.value) txs.value = BigNumber.from(transaction.value).toNumber();
  if (transaction?.gasLimit) txs.gas = BigNumber.from(transaction.gasLimit).toNumber();
  if (transaction?.gasPrice) txs.gasPrice = BigNumber.from(transaction.gasPrice).toNumber();
  if (transaction?.nonce) txs.nonce = BigNumber.from(transaction.nonce).toNumber();
  if (transaction?.data) txs.data = transaction.data.toString();

  console.log('toTransactionConfig', txs);
  return txs;
}

export class GnosisSafeProvider {
  private _receiptTime: Record<string, number> = {};
  network: Network | undefined;
  info: GnosisSafeInfo | undefined;
  readonly sdk: SafeAppsSDK;
  constructor() {
    this.sdk = new SafeAppsSDK();
  }

  public async getSafeInfo(): Promise<GnosisSafeInfo> {
    const info: any = await this.sdk.safe.getInfo();
    this.info = { ...info } as GnosisSafeInfo;
    return this.info;
  }

  // Network
  public async getNetwork(): Promise<Network> {
    await this.getSafeInfo();
    this.network = {
      name: this.info?.network ?? '',
      chainId: this.info?.chainId ?? 0,
      ensAddress: this.info?.safeAddress ?? '',
    };
    return this.network;
  }

  // Latest State
  public async getBlockNumber(): Promise<number> {
    const block = await this.sdk.eth.getBlockByNumber(['latest']);
    return block.number;
  }

  public async getGasPrice(): Promise<BigNumber> {
    const res = await this.sdk.eth.getGasPrice();
    return BigNumber.from(res);
  }

  async getFeeData(): Promise<FeeData> {
    throw new Error('getFeeData nonsupport');
  }

  // Account
  public async getBalance(addressOrName: string, blockTag?: BlockTag): Promise<BigNumber> {
    const res = await this.sdk.eth.getBalance([addressOrName, toString(blockTag)]);
    return BigNumber.from(res);
  }

  public async getTransactionCount(addressOrName: string, blockTag?: BlockTag): Promise<number> {
    const res = await this.sdk.eth.getTransactionCount([addressOrName, toString(blockTag)]);
    return BigNumber.from(res).toNumber();
  }

  public async getCode(addressOrName: string, blockTag?: BlockTag): Promise<string> {
    return await this.sdk.eth.getCode([addressOrName, toString(blockTag)]);
  }

  public async getStorageAt(addressOrName: string, position: BigNumberish, blockTag?: BlockTag): Promise<string> {
    return await this.sdk.eth.getStorageAt([addressOrName, BigNumber.from(position).toNumber(), toString(blockTag)]);
  }

  // Execution
  public async sendTransaction(signedTransaction: string): Promise<TransactionResponse> {
    throw new Error('sendTransaction nonsupport');
  }

  public async sendTransactionBySafeHash(parameter: SendTransactionsParams): Promise<TransactionResponse> {
    console.log('sendTransactionBySafeHash req', parameter);
    const res = await this.sdk.txs.send(parameter);
    console.log('sendTransactionBySafeHash res', res);
    return await this.getTransactionBySafeHash(res.safeTxHash);
  }

  public async call(transaction: TransactionRequest, blockTag?: BlockTag): Promise<string> {
    return await this.sdk.eth.call([toTransactionConfig(transaction), toString(blockTag)]);
  }

  public async estimateGas(transaction: TransactionRequest): Promise<BigNumber> {
    console.log('estimateGas req', transaction);
    const res = await this.sdk.eth.getEstimateGas(toTransactionConfig(transaction));
    return BigNumber.from(res);
  }

  // Queries
  public async getBlock(blockHashOrBlockTag: string | number): Promise<any> {
    if (typeof blockHashOrBlockTag === 'number' || /^\d+$/.test(blockHashOrBlockTag)) {
      return await this.sdk.eth.getBlockByNumber([BigNumber.from(blockHashOrBlockTag).toNumber()]);
    }
    return await this.sdk.eth.getBlockByHash([blockHashOrBlockTag]);
  }

  public async getBlockWithTransactions(blockHashOrBlockTag: string | number): Promise<any> {
    return await this.getBlock(blockHashOrBlockTag);
  }

  public async getTransaction(transactionHash: string): Promise<any> {
    return await this.sdk.eth.getTransactionByHash([transactionHash]);
  }

  public async getTransactionReceipt(transactionHash: string): Promise<any> {
    return await this.sdk.eth.getTransactionReceipt([transactionHash]);
  }

  // Bloom-filter Queries
  public async getLogs(filter: Filter): Promise<any> {
    const param: any = filter;
    return await this.sdk.eth.getPastLogs([param]);
  }

  public async getTransactionReceiptBySafeHash(hash: string): Promise<any> {
    let res = await this.sdk.txs.getBySafeTxHash(hash);
    let status = 0;
    if (res.txStatus.indexOf('AWAITING_') !== -1) {
      status = 2;
    }
    if (res.txStatus === 'SUCCESS') {
      status = 1;
    }

    let result = {
      to: res.safeAddress,
      from: res.safeAddress,
      contractAddress: res.safeAddress,
      transactionIndex: 0,
      gasUsed: BigNumber.from(0),
      logsBloom: '',
      blockHash: '',
      transactionHash: res.txHash ?? '',
      logs: [],
      blockNumber: 0,
      confirmations: 0,
      cumulativeGasUsed: BigNumber.from(0),
      effectiveGasPrice: BigNumber.from(0),
      byzantium: true,
      type: 0,
      status: status,
    };
    if (res.txHash) {
      result = await this.getTransactionReceipt(res.txHash);
      result.status = BigNumber.from(result.status).toNumber();
    }

    console.log('getTransactionReceiptBySafeHash', hash, res, result);
    return result;
  }

  /**
   *
   * @param hash safe hash
   * @param timeout millisecond
   * @returns
   */
  public async getTransactionBySafeHash(hash: string, timeout?: number): Promise<TransactionResponse> {
    const res = await this.sdk.txs.getBySafeTxHash(hash);
    const result = <TransactionResponse>{};
    result.raw = JSON.stringify(res);
    result.data = res?.txData?.hexData ?? '0x';
    result.hash = res?.txHash ?? '';
    result.from = res.safeAddress;
    result.to = res?.txData?.to.value ?? '';

    result.wait = async (confirms?: number, timeout?: number) => {
      if (timeout == null) {
        timeout = 600000;
      }

      // todo witch to _waitForTransactionBySafeNonce
      return await this._waitForTransactionBySafeHash(hash, timeout);
    };
    return result;
  }

  async _waitForTransactionBySafeHash(hash: string, timeout: number): Promise<TransactionReceipt> {
    if (timeout <= 0) throw new Error('timeout muse be great 0');
    let receipt = await this.getTransactionReceiptBySafeHash(hash);
    if (!this._receiptTime?.hash) {
      this._receiptTime.hash = Date.now();
    }
    // Receipt is already good
    if (receipt.status !== 2) {
      delete this._receiptTime.hash;
      return receipt;
    }

    if (Date.now() - this._receiptTime.hash < timeout) {
      await sleep.sleep(1000);
      return await this._waitForTransactionBySafeHash(hash, timeout);
    }

    throw new Error('waitForTransactionBySafeHash timeout');
  }

  async _waitForTransactionBySafeNonce(safeAddress: string, safeNonce: number): Promise<TransactionReceipt> {
    // /v1/safes/{address}/multisig-transactions/
    // check isExecuted and isSuccessful are true
    const res: TransactionReceipt = {} as TransactionReceipt;
    return res;
  }
}
