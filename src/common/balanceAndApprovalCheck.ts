import { providers as multicallProviders } from "@0xsequence/multicall";
import { BigNumber } from "ethers";
import { ItemType, MAX_INT } from "../constants";
import { approvedItemAmount } from "./approval";
import { balanceOf } from "./balance";
import type { Item } from "./types";
import { getItemToCriteriaMap } from "./criteria";
import { isErc1155Item, isErc20Item, isErc721Item } from "./item";

export type BalancesAndApprovals = {
  token: string;
  identifierOrCriteria: string;
  balance: BigNumber;
  approvedAmount: BigNumber;
  itemType: ItemType;
}[];

export type InsufficientBalances = {
  token: string;
  identifierOrCriteria: string;
  requiredAmount: BigNumber;
  amountHave: BigNumber;
  itemType: ItemType;
}[];

export type InsufficientApprovals = {
  token: string;
  identifierOrCriteria: string;
  approvedAmount?: BigNumber;
  requiredApprovedAmount?: BigNumber;
  operator: string;
  itemType: ItemType;
}[];

const findBalanceAndApproval = (
  balancesAndApprovals: BalancesAndApprovals,
  token: string,
  identifierOrCriteria: string
) => {
  const balanceAndApproval = balancesAndApprovals.find(
    ({
      token: checkedToken,
      identifierOrCriteria: checkedIdentifierOrCriteria,
    }) =>
      token.toLowerCase() === checkedToken.toLowerCase() &&
      checkedIdentifierOrCriteria.toLowerCase() ===
        identifierOrCriteria.toLowerCase()
  );

  if (!balanceAndApproval) {
    throw new Error(
      "Balances and approvals didn't contain all tokens and identifiers"
    );
  }

  return balanceAndApproval;
};

export const getBalancesAndApprovals = async ({
  owner,
  items,
  operator,
  multicallProvider,
}: {
  owner: string;
  items: Item[];
  operator: string;
  multicallProvider: multicallProviders.MulticallProvider;
}): Promise<BalancesAndApprovals> => {
  return Promise.all(
    items.map(async (item) => {
      let approvedAmountPromise = Promise.resolve(BigNumber.from(0));

      if (isErc721Item(item.itemType) || isErc1155Item(item.itemType)) {
        approvedAmountPromise = approvedItemAmount(
          owner,
          item,
          operator,
          multicallProvider
        );
      } else if (isErc20Item(item.itemType)) {
        approvedAmountPromise = approvedItemAmount(
          owner,
          item,
          operator,
          multicallProvider
        );
      }
      // If native token, we don't need to check for approvals
      else {
        approvedAmountPromise = Promise.resolve(MAX_INT);
      }

      return {
        token: item.token,
        identifierOrCriteria: item.identifierOrCriteria,
        balance: await balanceOf(owner, item, multicallProvider),
        approvedAmount: await approvedAmountPromise,
        itemType: item.itemType,
      };
    })
  );
};
