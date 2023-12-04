import { abi as MultiSendABI, networkAddresses } from './config/multi_send.json';
import { networkAddresses as networkAddressesCallOnly } from './config/multi_send_call_only.json';
import type { MultiSend as MultiSendContract } from './typechain/MultiSend';
import type { TransactionMethods, ContractMethodReturnType, TypedTokenInfo } from '../../../common/types';
import { getTransactionMethods } from '../../../common/transaction';
import { Chain } from '../../../chain';
import { BaseContract } from '../../../contract';
import { SendTokenParam, MetaTransaction } from './types';
import { ItemType } from '../../../constants';
import { BigNumber } from 'ethers';
import { getERC20 } from '../../../erc20';
import { getERC721 } from '../../../erc721';
import { getERC1155 } from '../../../erc1155';
import { ethers } from 'ethers';

type TypedTokenCount = {
  type: ItemType;
  token: string;
  total: BigNumber;
};

type TypedERC1155Count = {
  token: string;
  to: string;
  identifiers: string[];
  amounts: string[];
};

const encodeMetaTransaction = (tx: MetaTransaction): string => {
  const data = ethers.utils.arrayify(tx.data);
  const encoded = ethers.utils.solidityPack(
    ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
    [tx.operation, tx.to, tx.value, data.length, data]
  );
  return encoded.slice(2);
};

export const encodeMultiSendData = (txs: MetaTransaction[]): string => {
  return '0x' + txs.map((tx) => encodeMetaTransaction(tx)).join('');
};

export const computeMultiSendValue = (txs: MetaTransaction[]): BigNumber => {
  let value = BigNumber.from(0);
  txs.map((tx) => {
    value = value.add(BigNumber.from(tx.value));
  });
  return value;
};

export class MultiSend extends BaseContract {
  public constructor(chain: Chain, contractAddress: string) {
    super(chain, contractAddress, MultiSendABI);

    this.contract = this.contract as MultiSendContract;
  }

  public multiSend(
    transactions: string,
    overrides?: Record<string, any>
  ): TransactionMethods<ContractMethodReturnType<MultiSendContract, 'multiSend'>> {
    return getTransactionMethods(this.contract, 'multiSend', [transactions, overrides]);
  }
}

export function getMultiSend(chain: Chain): MultiSend {
  const multiSendAddrs: any = networkAddresses;
  const address: string = multiSendAddrs[BigNumber.from(chain.chainId).toString()];
  if (!address) throw new Error('getMultiSend, not found address');
  if (!chain.contractmaps[address.toLowerCase()]) {
    new MultiSend(chain, address);
  }
  return chain.contractmaps[address.toLowerCase()] as MultiSend;
}

export function getMultiSendCallOnly(chain: Chain): MultiSend {
  const multiSendAddrs: any = networkAddressesCallOnly;
  const address: string = multiSendAddrs[BigNumber.from(chain.chainId).toString()];
  if (!address) throw new Error('getMultiSend, not found address');
  if (!chain.contractmaps[address.toLowerCase()]) {
    new MultiSend(chain, address);
  }
  return chain.contractmaps[address.toLowerCase()] as MultiSend;
}

// only for gnosis safe(multisign-wallet) contract
export async function multiSendTokens(chain: Chain, params: SendTokenParam[]) {
  if (params.length < 1) throw new Error('multiSendTokens, params length must be greater than 0');
  const account = await chain.getAccount();
  if (!account) throw new Error('multiSendTokens, not found chain account');
  const ms = getMultiSendCallOnly(chain);
  console.log('ms address', ms.address);
  const countItems: Record<string, TypedTokenCount> = {};
  const count115Items: Record<string, TypedERC1155Count> = {};
  const transferData: MetaTransaction[] = [];
  // data cleaning
  for (let i = 0; i < params.length; i++) {
    const d = params[i];
    d.token = d.token.toLowerCase();
    d.to = d.to.toLowerCase();

    if (!countItems[d.token]) {
      countItems[d.token] = { token: d.token, type: d.type, total: BigNumber.from(0) };
    }

    if (d.type === ItemType.ERC1155 && !count115Items[d.token + d.to]) {
      count115Items[d.token + d.to] = { token: d.token, to: d.to, identifiers: [], amounts: [] };
    }

    if (chain.isZeroAddress(d.token)) d.type = ItemType.NATIVE;
    // console.log('param', d);
    switch (d.type) {
      case ItemType.NATIVE:
        d.identifier = '0';
        d.amount = BigNumber.from(d.amount);
        if (d.amount.toString() === '0') throw new Error('multiSendTokens native amount can not be 0');
        countItems[d.token].total = countItems[d.token].total.add(d.amount);
        transferData.push({
          to: d.to,
          value: d.amount.toString(),
          data: '0x',
          operation: 0,
        });
        break;
      case ItemType.ERC20:
        d.identifier = '0';
        d.amount = BigNumber.from(d.amount);
        if (d.amount.toString() === '0') throw new Error('multiSendTokens erc20 amount can not be 0');
        countItems[d.token].total = countItems[d.token].total.add(d.amount);
        transferData.push({
          to: d.token,
          value: '0',
          data: getERC20(chain, d.token).transferFromEncodeFunction(account, d.to, d.amount.toString()).data.toString(),
          operation: 0,
        });
        break;
      case ItemType.ERC1155:
        d.identifier = BigNumber.from(d.identifier).toString();
        d.amount = BigNumber.from(d.amount);
        countItems[d.token].total = countItems[d.token].total.add(1);
        count115Items[d.token + d.to].identifiers.push(BigNumber.from(d.identifier).toString());
        count115Items[d.token + d.to].amounts.push(d.amount.toString());
        break;
      case ItemType.ERC721:
        d.identifier = BigNumber.from(d.identifier).toString();
        countItems[d.token].total = countItems[d.token].total.add(1);
        d.amount = BigNumber.from('0');
        transferData.push({
          to: d.token,
          value: '0',
          data: getERC721(chain, d.token)
            .transferFromEncodeFunction(account, d.to, d.identifier.toString())
            .data.toString(),
          operation: 0,
        });
        break;
      default:
        throw new Error('multiSendTokens, invalid token');
    }
  }

  // push erc1155 data
  for (let k in count115Items) {
    const d = count115Items[k];
    transferData.push({
      to: d.token,
      value: '0',
      data: getERC1155(chain, d.token)
        .safeBatchTransferFromEncodeFunction(account, d.to, d.identifiers, d.amounts, '')
        .data.toString(),
      operation: 0,
    });
  }

  // set make from user transfer to multisend contract address
  const approveData: MetaTransaction[] = [];
  const unapproveData: MetaTransaction[] = [];
  for (let k in countItems) {
    const d = countItems[k];
    switch (d.type) {
      case ItemType.ERC20:
        approveData.push({
          to: d.token,
          value: '0',
          data: getERC20(chain, d.token).approveEncodeFunction(ms.address, d.total.toString()).data.toString(),
          operation: 0,
        });
        break;
      case ItemType.ERC1155:
        approveData.push({
          to: d.token,
          value: '0',
          data: getERC1155(chain, d.token).setApprovalForAllEncodeFunction(ms.address, true).data.toString(),
          operation: 0,
        });
        unapproveData.push({
          to: d.token,
          value: '0',
          data: getERC1155(chain, d.token).setApprovalForAllEncodeFunction(ms.address, false).data.toString(),
          operation: 0,
        });
        break;
      case ItemType.ERC721:
        approveData.push({
          to: d.token,
          value: '0',
          data: getERC721(chain, d.token).setApprovalForAllEncodeFunction(ms.address, true).data.toString(),
          operation: 0,
        });
        unapproveData.push({
          to: d.token,
          value: '0',
          data: getERC721(chain, d.token).setApprovalForAllEncodeFunction(ms.address, false).data.toString(),
          operation: 0,
        });
        break;
    }
  }

  // combine data
  const sendData = [...approveData, ...transferData, ...unapproveData];
  const data: string = encodeMultiSendData(sendData);
  const value: string = computeMultiSendValue(sendData).toString();

  console.log(value, data, sendData);

  return ms.multiSend(data, { value });
}
