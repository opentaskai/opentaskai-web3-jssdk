import { BigNumber, BigNumberish, BytesLike } from 'ethers';
import { RewardClaimABI } from './abi/RewardClaim';
import type { RewardClaim as RewardClaimContract } from './typechain/RewardClaim';
import type { TransactionMethods, ContractMethodReturnType } from '../../common/types';
import { getTransactionMethods } from '../../common/transaction';
import { Chain } from '../../chain';
import { BaseContract } from '../../contract';

import { getNetworkMeta, NetworkMeta } from './network';

export class RewardClaim extends BaseContract {
  networkMeta: NetworkMeta;

  public constructor(chain: Chain, contractAddress?: string) {
    const networkMeta = getNetworkMeta(chain.chainId);
    super(chain, contractAddress ?? networkMeta.RewardClaim, RewardClaimABI);

    this.contract = this.contract as RewardClaimContract;
    this.networkMeta = networkMeta;
  }

  public claimReward(
    _periodNumber: BigNumberish,
    _groupId: BigNumberish,
    _amount: BigNumberish,
    _proof: BytesLike[]
  ): TransactionMethods<ContractMethodReturnType<RewardClaimContract, 'claimReward'>> {
    let value = BigNumber.from(0);
    const payableOverrides = { value };
    return getTransactionMethods(this.contract, 'claimReward', [_periodNumber, _groupId, _amount, _proof, payableOverrides]);
  }

  public async hasClaimed(_periodNumber: BigNumberish, _user?: string) {
    if (!_user) {
      _user = await this.chain.getAccount();
    }
    return await this.contract.hasClaimed(_periodNumber, _user);
  }

  public async getBalance(_token: string) {
    const res = await this.contract.getBalance(_token);
    return res.toString();
  }

  public async getPeriodInfo(_periodNumber: BigNumberish) {
    const res = await this.contract.getPeriodInfo(_periodNumber);
    if(res){
      res.userCount = res.userCount.toString();
      res.totalAmount = res.totalAmount.toString();
    }
    return res;
  }

  public async checkPeriodMerkleRoot(_periodNumber: BigNumberish, _groupId: BigNumberish) {
    return await this.contract.checkPeriodMerkleRoot(_periodNumber, _groupId);
  }

}
