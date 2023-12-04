import { ItemType } from '../../../constants';
import { BigNumberish, BigNumber } from 'ethers';

export interface SendTokenParam {
  type: ItemType;
  token: string;
  to: string;
  identifier: BigNumberish; // if type is erc20 then 0
  amount: BigNumberish; // if type is erc721 then amount 0
}

export interface MetaTransaction {
  to: string;
  value: string | number | BigNumber;
  data: string;
  operation: number; // 0 call, 1 delegatecall
}

export { ItemType };
