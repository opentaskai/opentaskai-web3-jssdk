import { providers as multicallProviders } from '@0xsequence/multicall';
import { BigNumber, Contract, Signer } from 'ethers';
import { ERC20ABI } from './abi/ERC20';
import { ERC721ABI } from './abi/ERC721';
import { ItemType, MAX_INT } from '../constants';
import type { ERC721, ERC20 } from '../libs/seaport1.1/typechain/index';
import type { ApprovalAction, Item } from './types';
import type { InsufficientApprovals, BalancesAndApprovals } from './balanceAndApprovalCheck';
import { isErc1155Item, isErc721Item } from './item';
import { getTransactionMethods } from './transaction';

export const approvedItemAmount = async (
  owner: string,
  item: Item,
  operator: string,
  multicallProvider: multicallProviders.MulticallProvider
) => {
  if (isErc721Item(item.itemType) || isErc1155Item(item.itemType)) {
    // isApprovedForAll check is the same for both ERC721 and ERC1155, defaulting to ERC721
    const contract = new Contract(item.token, ERC721ABI, multicallProvider) as ERC721;
    return contract.isApprovedForAll(owner, operator).then((isApprovedForAll) =>
      // Setting to the max int to consolidate types and simplify
      isApprovedForAll ? MAX_INT : BigNumber.from(0)
    );
  } else if (item.itemType === ItemType.ERC20) {
    const contract = new Contract(item.token, ERC20ABI, multicallProvider) as ERC20;

    return contract.allowance(owner, operator);
  }

  // We don't need to check approvals for native tokens
  return MAX_INT;
};

/**
 * Get approval actions given a list of insufficent approvals.
 */
export function getApprovalActions(
  insufficientApprovals: InsufficientApprovals,
  signer: Signer
): Promise<ApprovalAction[]> {
  return Promise.all(
    insufficientApprovals
      .filter(
        (approval, index) =>
          index === insufficientApprovals.length - 1 || insufficientApprovals[index + 1].token !== approval.token
      )
      .map(async ({ token, operator, itemType, identifierOrCriteria }) => {
        if (isErc721Item(itemType) || isErc1155Item(itemType)) {
          // setApprovalForAll check is the same for both ERC721 and ERC1155, defaulting to ERC721
          const contract = new Contract(token, ERC721ABI, signer) as ERC721;

          return {
            type: 'approval',
            token,
            identifierOrCriteria,
            itemType,
            operator,
            transactionMethods: getTransactionMethods(contract.connect(signer), 'setApprovalForAll', [operator, true]),
          };
        } else {
          const contract = new Contract(token, ERC20ABI, signer) as ERC20;

          return {
            type: 'approval',
            token,
            identifierOrCriteria,
            itemType,
            transactionMethods: getTransactionMethods(contract.connect(signer), 'approve', [operator, MAX_INT]),
            operator,
          };
        }
      })
  );
}

export async function approvals(insufficientApprovals: InsufficientApprovals, signer: Signer) {
  const actions = await getApprovalActions(insufficientApprovals, signer);
  // console.log('actions', actions);
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (action.type === 'approval') {
      const tx = await action.transactionMethods.transact();
      // console.log('token', action.token, 'tx', tx.hash);
      const recipet = await tx.wait();
      // console.log('token', action.token, 'recipet',recipet);
    }
  }
}

export async function approvalByBalancesAndApprovals(items: BalancesAndApprovals, operator: string, signer: Signer) {
  const needApprovals = items.filter((d) => {
    if (d.balance.gt(d.approvedAmount)) {
      return d;
    } else {
      return null;
    }
  });

  // console.log('needApprovals', needApprovals);

  const insufficientApprovals: InsufficientApprovals = needApprovals.map((d) => {
    return {
      token: d.token,
      identifierOrCriteria: d.identifierOrCriteria,
      operator,
      itemType: d.itemType,
    };
  });
  // console.log('insufficientApprovals:', insufficientApprovals);
  await approvals(insufficientApprovals, signer);
}
