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
  token: string; // Token address
  from: string; // Sender's account number
  to: string; // Recipient's account number
  available: BigNumberish; // Amount deducted from sender's available balance
  frozen: BigNumberish; // Amount deducted from sender's frozen balance
  amount: BigNumberish; // Amount transferred to recipient's account
  fee: BigNumberish; // Base fee for the transaction transferred to the fee account
  paid: BigNumberish; // Total amount paid by the sender, potentially including excess payment, which is frozen in the sender's account
  excessFee: BigNumberish // Additional fee charged if 'paid' exceeds 'frozen', transferred to the fee account
};

export type TradeData = {
  account: string;
  token: string;
  amount: BigNumberish;
  fee: BigNumberish;
};

export type { TransactionMethods, ContractMethodReturnType, ApprovalAction };
