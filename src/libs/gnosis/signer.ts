import type { TypedDataDomain, TypedDataField } from '../../common/types';
import { BlockTag, FeeData, Provider, TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { Bytes, BytesLike } from '@ethersproject/bytes';
import { Deferrable, defineReadOnly, resolveProperties, shallowCopy } from '@ethersproject/properties';

import { GnosisSafeProvider } from './provider';

const allowedTransactionKeys: Array<string> = [
  'accessList',
  'ccipReadEnabled',
  'chainId',
  'customData',
  'data',
  'from',
  'gasLimit',
  'gasPrice',
  'maxFeePerGas',
  'maxPriorityFeePerGas',
  'nonce',
  'to',
  'type',
  'value',
];

export class GnosisSafeSigner {
  provider?: GnosisSafeProvider;
  _isSigner: boolean = false;
  ///////////////////
  // Sub-classes MUST call super

  // Returns a new instance of the Signer, connected to provider.
  // This MAY throw if changing providers is not supported.
  connect(provider: GnosisSafeProvider): GnosisSafeSigner {
    this.provider = provider;
    this._isSigner = true;
    return this;
  }

  ///////////////////
  // Sub-classes MUST implement these

  // Returns the checksum address
  async getAddress(): Promise<string> {
    if (!this.provider) throw new Error(`missing provider, getAddress UNSUPPORTED_OPERATION`);
    const info = await this.provider.getSafeInfo();
    return info.safeAddress;
  }

  // Returns the signed prefixed-message. This MUST treat:
  // - Bytes as a binary message
  // - string as a UTF8-message
  // i.e. "0x1234" is a SIX (6) byte string, NOT 2 bytes of data
  async signMessage(message: Bytes | string): Promise<string> {
    if (!this.provider) throw new Error(`missing provider, signMessage UNSUPPORTED_OPERATION`);
    const res = await this.provider.sdk.txs.signMessage(message.toString());
    return res.safeTxHash;
  }

  async signTypedMessage(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, any>
  ): Promise<string> {
    if (!this.provider) throw new Error(`missing provider, signTypedMessage UNSUPPORTED_OPERATION`);
    const data: any = {
      domain,
      types,
      message,
    };
    const res = await this.provider.sdk.txs.signTypedMessage(data);
    return res.safeTxHash;
  }

  // Signs a transaction and returns the fully serialized, signed transaction.
  // The EXACT transaction MUST be signed, and NO additional properties to be added.
  // - This MAY throw if signing transactions is not supports, but if
  //   it does, sentTransaction MUST be overridden.
  public async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
    return '';
  }

  ///////////////////
  // Sub-classes MAY override these

  async getBalance(blockTag?: BlockTag): Promise<BigNumber> {
    if (!this.provider) throw new Error(`missing provider, getBalance UNSUPPORTED_OPERATION`);
    return await this.provider.getBalance(await this.getAddress(), blockTag);
  }

  async getTransactionCount(blockTag?: BlockTag): Promise<number> {
    if (!this.provider) throw new Error(`missing provider, getTransactionCount UNSUPPORTED_OPERATION`);
    return await this.provider.getTransactionCount(await this.getAddress(), blockTag);
  }

  // Populates "from" if unspecified, and estimates the gas for the transaction
  async estimateGas(transaction: Deferrable<TransactionRequest>): Promise<BigNumber> {
    if (!this.provider) throw new Error(`missing provider, estimateGas UNSUPPORTED_OPERATION`);
    const tx = await resolveProperties(this.checkTransaction(transaction));
    return await this.provider.estimateGas(tx);
  }

  // Populates "from" if unspecified, and calls with the transaction
  async call(transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag): Promise<string> {
    if (!this.provider) throw new Error(`missing provider, call UNSUPPORTED_OPERATION`);
    const tx = await resolveProperties(this.checkTransaction(transaction));
    return await this.provider.call(tx, blockTag);
  }

  // Populates all fields in a transaction, signs it and sends it to the network
  async sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse> {
    if (!this.provider) throw new Error(`missing provider, sendTransaction UNSUPPORTED_OPERATION`);
    const tx = await resolveProperties(this.checkTransaction(transaction));
    const txs = [
      {
        to: tx.to ?? (await this.getAddress()),
        value: tx.value ? BigNumber.from(transaction.value).toString() : '0',
        data: tx.data ? tx.data.toString() : '0x',
      },
    ];

    let params: any = {};
    if (transaction.gasLimit) params.safeTxGas = BigNumber.from(transaction.gasLimit).toNumber();
    return await this.provider.sendTransactionBySafeHash({ txs, params });
  }

  async getChainId(): Promise<number> {
    if (!this.provider) throw new Error(`missing provider, getChainId UNSUPPORTED_OPERATION`);
    const network = await this.provider.getNetwork();
    return network.chainId;
  }

  async getGasPrice(): Promise<BigNumber> {
    if (!this.provider) throw new Error(`missing provider, getGasPrice UNSUPPORTED_OPERATION`);
    return await this.provider.getGasPrice();
  }

  async getFeeData(): Promise<FeeData> {
    if (!this.provider) throw new Error(`missing provider, getFeeData UNSUPPORTED_OPERATION`);
    return await this.provider.getFeeData();
  }

  async resolveName(name: string): Promise<string> {
    throw new Error('no support');
  }

  // Checks a transaction does not contain invalid keys and if
  // no "from" is provided, populates it.
  // - does NOT require a provider
  // - adds "from" is not present
  // - returns a COPY (safe to mutate the result)
  // By default called from: (overriding these prevents it)
  //   - call
  //   - estimateGas
  //   - populateTransaction (and therefor sendTransaction)
  checkTransaction(transaction: Deferrable<TransactionRequest>): Deferrable<TransactionRequest> {
    for (const key in transaction) {
      if (allowedTransactionKeys.indexOf(key) === -1) {
        throw new Error('invalid transaction key: ' + key + ' in transaction: ' + JSON.stringify(transaction));
      }
    }
    return transaction;
  }

  // Populates ALL keys for a transaction and checks that "from" matches
  // this Signer. Should be used by sendTransaction but NOT by signTransaction.
  // By default called from: (overriding these prevents it)
  //   - sendTransaction
  //
  // Notes:
  //  - We allow gasPrice for EIP-1559 as long as it matches maxFeePerGas
  async populateTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionRequest> {
    const tx: Deferrable<TransactionRequest> = await resolveProperties(this.checkTransaction(transaction));

    // Do not allow mixing pre-eip-1559 and eip-1559 properties
    const hasEip1559 = tx.maxFeePerGas != null || tx.maxPriorityFeePerGas != null;
    if (tx.gasPrice != null && (tx.type === 2 || hasEip1559)) {
      throw new Error('eip-1559 transaction do not support gasPrice transaction: ' + JSON.stringify(transaction));
    } else if ((tx.type === 0 || tx.type === 1) && hasEip1559) {
      throw new Error(
        'pre-eip-1559 transaction do not support maxFeePerGas/maxPriorityFeePerGas transaction: ' +
          JSON.stringify(transaction)
      );
    }

    if ((tx.type === 2 || tx.type == null) && tx.maxFeePerGas != null && tx.maxPriorityFeePerGas != null) {
      // Fully-formed EIP-1559 transaction (skip getFeeData)
      tx.type = 2;
    } else if (tx.type === 0 || tx.type === 1) {
      // Explicit Legacy or EIP-2930 transaction

      // Populate missing gasPrice
      if (tx.gasPrice == null) {
        tx.gasPrice = this.getGasPrice();
      }
    }

    if (tx.nonce == null) {
      tx.nonce = this.getTransactionCount('pending');
    }

    if (tx.gasLimit == null) {
      tx.gasLimit = this.estimateGas(tx);
    }

    if (tx.chainId == null) {
      tx.chainId = this.getChainId();
    }

    return await resolveProperties(tx);
  }

  ///////////////////
  // Sub-classes SHOULD leave these alone

  _checkProvider(operation?: string) {
    if (!this.provider) {
      throw new Error(`missing provider, ${operation} UNSUPPORTED_OPERATION`);
    }
  }

  static isSigner(value: any): value is GnosisSafeSigner {
    return !!(value && value._isSigner);
  }
}
