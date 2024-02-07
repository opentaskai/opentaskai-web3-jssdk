import { ethers, Wallet, BigNumber, BigNumberish, BytesLike } from 'ethers';
import { Filter } from '@ethersproject/abstract-provider';
import { CHAIN_RPC } from './constants';
import { BaseContract } from './contract';
import { CHAIN_SYMBOL, CHAIN_TOKENS, ZERO_ADDRESS } from './constants';
import type { Signer, TypedTokenInfo, TypedDataDomain, TypedDataField, TransactionRequest } from './common/types';

export type ProviderOrSigner = ethers.providers.JsonRpcProvider | Signer;
export class Chain {
  provider!: ProviderOrSigner;
  signer?: Signer;
  chainId: number = 0;
  contracts: BaseContract[] = [];
  contractmaps: Record<string, BaseContract> = {};
  tokens: Record<string, TypedTokenInfo> = {};
  cache: boolean = true;

  setProvider(providerOrSigner: ProviderOrSigner) {
    this.provider = providerOrSigner;
    this.signer = (providerOrSigner as Signer)._isSigner ? (providerOrSigner as Signer) : undefined;
  }

  setOutProvider(provider_: any) {
    this.setProvider(provider_ as ethers.providers.JsonRpcProvider);
  }

  register(contract: BaseContract) {
    this.contracts.push(contract);
    this.contractmaps[contract.address] = contract;
  }

  clean() {
    this.contracts.splice(0, this.contracts.length);
  }

  connectContract(signer?: Signer) {
    this.contracts.forEach((c: BaseContract) => {
      c.connect(signer);
    });
  }

  zeroSymbol(): string {
    const token: any = CHAIN_SYMBOL.ZeroToken;
    return token[this.chainId];
  }

  wSymbol(): string {
    const token: any = CHAIN_SYMBOL.WToken;
    return token[this.chainId];
  }

  isZeroAddress(address: string): boolean {
    return address === ZERO_ADDRESS;
  }

  isZero(v: any) {
    return BigNumber.from(v).toNumber() === 0;
  }

  setToken(address: string, token: TypedTokenInfo) {
    if (!this.cache) return;
    this.tokens[address.toLowerCase()] = token;
  }

  getToken(address: string) {
    return this.tokens[address.toLowerCase()];
  }

  getTokenAddr(name: string) {
    const _tokens: any = CHAIN_TOKENS;
    try {
      return _tokens[this.chainId][name];
    } catch {
      throw new Error('getTokenAddr not found');
    }
  }

  getWethAddr() {
    return this.getTokenAddr(this.wSymbol());
  }

  getNativeAddr() {
    return ZERO_ADDRESS;
  }

  getProvider() {
    return this.provider instanceof ethers.providers.Provider ? this.provider : this.provider.provider;
  }

  async getBlockNumber() {
    const provider = this.provider instanceof ethers.providers.Provider ? this.provider : this.provider.provider;
    if (!provider) throw new Error('no provider');
    return await provider.getBlockNumber();
  }

  async getBlock(blockTag: string | number) {
    const provider = this.provider instanceof ethers.providers.Provider ? this.provider : this.provider.provider;
    if (!provider) throw new Error('no provider');
    return await provider.getBlock(blockTag);
  }

  async getGasPrice() {
    const provider = this.getProvider();
    if (!provider) throw new Error('no provider');
    const res = await provider.getGasPrice();
    return res.toString();
  }

  async estimateGas(transaction: TransactionRequest) {
    let gasLimit = await this.getSigner(0).estimateGas(transaction);
    return gasLimit.toString();
  }

  async getBalance(address?: string): Promise<string> {
    if (!address) address = await this.getAccount();
    const res: BigNumber = await this.provider.getBalance(address);
    return res.toString();
  }

  async getTransactionReceipt(transactionHash: any) {
    const provider = this.getProvider();
    if (!provider) throw new Error('no provider');
    let res = await provider.getTransactionReceipt(transactionHash);
    return res;
  }

  public getSigner(addressOrIndex?: string | number): Signer {
    if (this.signer) {
      return this.signer;
    }
    if (!(this.provider instanceof ethers.providers.JsonRpcProvider)) {
      throw new Error('Either signer or a JsonRpcProvider must be provided');
    }

    return this.provider.getSigner(addressOrIndex);
  }

  public async getAccount(): Promise<string> {
    return await this.getSigner(0).getAddress();
  }

  public async sendTransaction(transaction: TransactionRequest) {
    if (transaction?.value && this.isZero(transaction.value)) {
      delete transaction.value;
    }

    if (!transaction?.gasLimit) {
      let gasLimit = await this.getSigner(0).estimateGas(transaction);
      // console.log('gasLimit', gasLimit.toString());
      transaction.gasLimit = gasLimit.mul(120).div(100);
    }

    return await this.getSigner(0).sendTransaction(transaction);
  }

  public async signTransaction(transaction: TransactionRequest) {
    const signer = this.getSigner(0);
    const tx = await signer.populateTransaction(transaction);
    return await signer.signTransaction(tx);
  }

  public async sendSignedTx(signedTx: any) {
    return await this.provider.sendTransaction(signedTx);
  }

  public async signMessage(message: string): Promise<string> {
    const signer = this.getSigner(0);
    return await signer.signMessage(message);
  }

  public async signTypedMessage(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    values: Record<string, any>
  ): Promise<string> {
    const signer = this.getSigner(0);
    return await signer._signTypedData(domain, types, values);
  }

  async getLogs(filter: Filter) {
    const provider = this.provider instanceof ethers.providers.Provider ? this.provider : this.provider.provider;
    if (!provider) throw new Error('no provider');
    return await provider.getLogs(filter);
  }

  async getEthLogs(filter: {
    address?: string | string[];
    topics?: string[];
    fromBlock: string | number;
    toBlock: string | number;
  }) {
    const provider = this.provider instanceof ethers.providers.Provider ? this.provider : null;
    if (!provider) throw new Error('no provider');
    return await provider.send('eth_getLogs', [filter]);
  }
}

export class LocalChain extends Chain {
  constructor(chainId: number, rpc: string = '') {
    super();
    if (!rpc) rpc = CHAIN_RPC[chainId];
    console.log('chain rpc', rpc);
    const provider = new ethers.providers.JsonRpcProvider(CHAIN_RPC[chainId]);

    this.setProvider(provider);
    this.chainId = chainId;

    // workaroud, unknown account #0 (operation="getAddress", code=UNSUPPORTED_OPERATION, version=providers/5.7.2)
    const wallet = new Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'); // hardhat test wallet
    this.connect(wallet);
  }

  connect(wallet: Wallet) {
    this.signer = wallet.connect(this.provider as ethers.providers.Provider);
    this.connectContract(this.signer);
  }
}
export class BrowserChain extends Chain {}

let Chains: Record<number, LocalChain> = {};
export function getChain(chainId: number, rpc: string = ''): LocalChain {
  if (!Chains[chainId] || rpc) {
    Chains[chainId] = new LocalChain(chainId, rpc);
  }
  return Chains[chainId];
}
