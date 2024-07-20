import { ethers, BigNumber, BigNumberish, BytesLike, Wallet } from 'ethers';
import { ERC20TokenABI } from './abi/ERC20Token';
import type { ERC20Token as ERC20TokenContract } from './typechain/ERC20Token';
import type { TransactionMethods, ContractMethodReturnType } from '../../common/types';
import { getTransactionMethods } from '../../common/transaction';
import { TypedDataDomain } from '@ethersproject/abstract-signer';
import { Chain } from '../../chain';
import { ERC20 } from '../../erc20';

import { getNetworkMeta, NetworkMeta } from './network';

export class ERC20ClaimToken extends ERC20 {
  networkMeta: NetworkMeta;
  domain: TypedDataDomain | undefined;
  signer: Wallet | undefined;
  public constructor(chain: Chain, contractAddress: string) {
    const networkMeta = getNetworkMeta(chain.chainId);
    super(chain, contractAddress, ERC20TokenABI);

    this.contract = this.contract as ERC20TokenContract;
    this.networkMeta = networkMeta;
  }

  public mint(
    _to: string,
    _amount: BigNumberish,
  ): TransactionMethods<ContractMethodReturnType<ERC20TokenContract, 'mint'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'mint', [_to, _amount, payableOverrides]);
  }

  public burn(
    _amount: BigNumberish,
  ): TransactionMethods<ContractMethodReturnType<ERC20TokenContract, 'burn'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'burn', [_amount, payableOverrides]);
  }

  public claim(): TransactionMethods<ContractMethodReturnType<ERC20TokenContract, 'claim'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'claim', [payableOverrides]);
  }

  public async claimCount() {
    const res = await this.contract.claimCount();
    return res.toString();
  }

  public setSigner(_signer: Wallet) {
    this.signer = _signer;
  }

}

export function getERC20ClaimToken(chain: Chain, address: string): ERC20ClaimToken {
  if (!chain.contractmaps[address.toLowerCase()]) {
    new ERC20ClaimToken(chain, address);
  }
  return chain.contractmaps[address.toLowerCase()] as ERC20ClaimToken;
}
