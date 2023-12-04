import { IERC165ABI } from './common/abi/IERC165';
import type { IERC165 as ERC165Contract } from './common/typechain/IERC165';
import { providers as multicallProviders } from '@0xsequence/multicall';
import { Contract, ethers, providers } from 'ethers';
import type { Signer } from './common/types';
import { Chain } from './chain';

class BaseContract {
  // Provides the raw interface to the contract for flexibility
  public contract: Contract;
  public address: string;

  public chain: Chain;
  public provider: ethers.providers.Provider;

  // Use the multicall provider for reads for batching and performance optimisations
  // NOTE: Do NOT await between sequential requests if you're intending to batch
  // instead, use Promise.all() and map to fetch data in parallel
  // https://www.npmjs.com/package/@0xsequence/multicall
  public multicallProvider: multicallProviders.MulticallProvider;

  public constructor(chain: Chain, address: string, abi: any) {
    if (!chain) {
      throw new Error('invalid chain');
    }
    if (!address) {
      throw new Error('invalid address');
    }
    if (!abi) {
      throw new Error('invalid abi');
    }

    this.chain = chain;
    this.address = address.toLowerCase();

    const provider = chain.getProvider();

    if (!provider) {
      throw new Error('Either a provider or custom signer with provider must be provided');
    }

    this.provider = provider;

    this.multicallProvider = new multicallProviders.MulticallProvider(this.provider);

    this.contract = new Contract(address, abi, this.multicallProvider);
  }
}

export class ERC165 extends BaseContract {
  public constructor(chain: Chain, contractAddress: string) {
    super(chain, contractAddress, IERC165ABI);

    this.contract = this.contract as ERC165Contract;
  }

  public async supportsInterface(interfaceId: string): Promise<string> {
    return await this.contract.supportsInterface(interfaceId);
  }
}

export function getERC165(chain: Chain, address: string): ERC165 {
  return new ERC165(chain, address);
}
