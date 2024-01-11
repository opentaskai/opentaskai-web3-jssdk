import { BytesLike, BigNumberish } from 'ethers';
import { TransactionMethods, ContractMethodReturnType, ApprovalAction } from '../../common/types';

export type Account = {
  available: string;
  frozen: string;
};

export type AssetAccount = {
  token: string;
  available: string;
  frozen: string;
};

export type DetailedAccount = {
  account: string;
  token: string;
  available: string;
  frozen: string;
};

export type TransferData = {
  token: string;
  from: string; // source account
  to: string; // destination account
  available: BigNumberish; // from source account
  frozen: BigNumberish; // from source account
  amount: BigNumberish; //to destination account
  fee: BigNumberish; // to feeTo account
};

export type TradeData = {
  account: string;
  token: string;
  amount: BigNumberish;
  fee: BigNumberish;
};

export type { TransactionMethods, ContractMethodReturnType, ApprovalAction };
