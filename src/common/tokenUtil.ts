import { Chain } from '../chain';
import { ERC165 } from '../erc165';
import { ERC20 } from '../erc20';
import { ERC721 } from '../erc721';
import { ERC1155 } from '../erc1155';

import { BigNumber, BigNumberish } from 'ethers';
import { formatAddress } from './format';
import { multicall } from '../multicall';
import type { CallTyped } from '../multicall';
import type { TypedTokenInfo } from '../common/types';

type CountToken = {
  token: string;
  total: BigNumber;
};

type TypedApproveInfo = {
  tokenAddr: string;
  user: string;
  operator: string;
  operatorName: string;
};

type TypedBalanceData = {
  callData: CallTyped[];
  token?: any[];
};

export class TokenUtil {
  chain: Chain;
  public constructor(chain: Chain) {
    this.chain = chain;
  }

  public async getTokenStandard(addr: string) {
    const token = new ERC165(this.chain, addr);
    if ((await token.supportsInterface('0x80ac58cd')) || (await token.supportsInterface('0x5b5e139f'))) {
      return 'erc721';
    }

    if ((await token.supportsInterface('0xd9b67a26')) || (await token.supportsInterface('0x0e89341c'))) {
      return 'erc1155';
    }

    throw new Error('unknown contract standard address ' + addr);
  }

  public async infoForERC20(tokenAddr: string) {
    const token = new ERC20(this.chain, tokenAddr);
    return await token.info();
  }

  public async infoForERC20s(tokenAddrs: string[]) {
    const infos = await Promise.all(tokenAddrs.map((d) => this.infoForERC20(d)));
    const result: Record<string, TypedTokenInfo> = {};
    for (let d of infos) {
      result[d.address] = d;
    }
    return result;
  }

  public async allownceForERC20s(tokenAddrs: string[], user: string, operator: string, operatorName: string = '') {
    if (!tokenAddrs.length) throw new Error('no token address');
    if (!user) throw new Error('no user');
    if (!operator) throw new Error('no operator');

    const result: Record<string, string> = {};
    const zeroAddr = this.chain.getNativeAddr();
    if (tokenAddrs.includes(zeroAddr)) {
      result[zeroAddr] = BigNumber.from(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ).toString();
    }

    tokenAddrs.map((v, i) => {
      if (this.chain.isZeroAddress(v)) {
        tokenAddrs.splice(i, 1);
      }
    });

    if (!tokenAddrs.length) return result;

    const callDatas: CallTyped[] = [];
    for (let i = 0; i < tokenAddrs.length; i++) {
      const cd = await this._wrapAllownceInfoForERC20CallData(tokenAddrs[i], user, operator);
      callDatas.push(cd);
    }

    const res = await multicall(this.chain, callDatas);
    for (let i = 0; i < res.length; i++) {
      const addr = tokenAddrs[i].toLowerCase();
      result[addr] = BigNumber.from(res[i]).toString();
    }
    return result;
  }

  public async balanceForERC20s(tokenAddrs: string[], user: string) {
    if (!tokenAddrs.length) throw new Error('no token address');
    if (!user) {
      user = await this.chain.getAccount();
    }

    const result: Record<string, string> = {};
    const zeroAddr = this.chain.getNativeAddr();
    if (tokenAddrs.includes(zeroAddr)) {
      result[zeroAddr] = await this.chain.getBalance(user);
    }
    tokenAddrs.map((v, i) => {
      if (this.chain.isZeroAddress(v)) {
        tokenAddrs.splice(i, 1);
      }
    });

    if (!tokenAddrs.length) return result;

    const callDatas: CallTyped[] = [];
    for (let i = 0; i < tokenAddrs.length; i++) {
      const cd = await this._wrapBalanceInfoForERC20CallData(user, tokenAddrs[i]);
      callDatas.push(cd);
    }

    const res = await multicall(this.chain, callDatas);
    for (let i = 0; i < res.length; i++) {
      result[tokenAddrs[i].toLowerCase()] = BigNumber.from(res[i]).toString();
    }
    return result;
  }

  public async balanceInfoForERC1155(tokenAddrs: string[], tokenIds: string[] | number[], users: string[]) {
    if (!tokenAddrs.length || !tokenIds.length || tokenAddrs.length != tokenIds.length)
      throw new Error('invalid pramaters');

    const callDatas: CallTyped[] = [];
    for (let i = 0; i < tokenAddrs.length; i++) {
      const cd = await this._wrapBalanceInfoForERC1155CallData(users[i], tokenAddrs[i], tokenIds[i]);
      callDatas.push(cd);
    }

    const result: Record<string, string> = {};
    const res = await multicall(this.chain, callDatas);
    for (let i = 0; i < res.length; i++) {
      const key = tokenAddrs[i].toLowerCase() + '-' + tokenIds[i] + '-' + users[i].toLowerCase();
      result[key] = BigNumber.from(res[i]).toString();
    }
    return result;
  }

  public async ownerOfInfoForERC721(tokenAddrs: string[], tokenIds: string[] | number[], users: string[]) {
    if (
      !tokenAddrs.length ||
      !tokenIds.length ||
      !users.length ||
      tokenAddrs.length != tokenIds.length ||
      tokenAddrs.length != users.length
    )
      throw new Error('invalid pramaters');

    const callDatas: CallTyped[] = [];
    for (let i = 0; i < tokenAddrs.length; i++) {
      const cd = await this._wrapOwnerOfInfoForERC721CallData(tokenAddrs[i], tokenIds[i]);
      callDatas.push(cd);
    }

    const result: Record<string, boolean> = {};
    const res = await multicall(this.chain, callDatas);
    for (let i = 0; i < res.length; i++) {
      const check = users[i].toLowerCase() === formatAddress(res[i]).toLowerCase();
      const key = tokenAddrs[i].toLowerCase() + '-' + tokenIds[i] + '-' + users[i].toLowerCase();
      result[key] = check;
    }
    return result;
  }

  public async estimateGasApproveForERC20(tokenAddr: string, operator: string) {
    if (!tokenAddr) throw new Error('no token address');
    if (!operator) throw new Error('no operator');

    const token = new ERC20(this.chain, tokenAddr);
    const approve = token.approve(operator);
    const gas = await approve.estimateGas();
    return BigNumber.from(gas).toString();
  }

  public async estimateGasApproveForERC20s(tokenAddrs: string[], operator: string) {
    if (!tokenAddrs.length) throw new Error('no token address');
    if (!operator) throw new Error('no operator');

    const result: Record<string, string> = {};
    for (let i = 0; i < tokenAddrs.length; i++) {
      const tokenAddr = tokenAddrs[i].toLowerCase();
      result[tokenAddr] = await this.estimateGasApproveForERC20(tokenAddr, operator);
    }

    return result;
  }

  async _wrapAllownceInfoForERC20CallData(tokenAddr: string, user: string, operator: string) {
    const token = new ERC20(this.chain, tokenAddr);
    const d = token.allowanceEncodeFunction(user, operator);
    return {
      target: tokenAddr,
      gasLimit: 0,
      callData: d,
    };
  }

  async _wrapBalanceInfoForERC20CallData(user: string, tokenAddr: string) {
    const token = new ERC20(this.chain, tokenAddr);
    const d = token.balanceOfEncodeFunction(user);
    return {
      target: tokenAddr,
      gasLimit: 0,
      callData: d,
    };
  }

  async _wrapBalanceInfoForERC1155CallData(user: string, tokenAddr: string, tokenId: string | number) {
    const token = new ERC1155(this.chain, tokenAddr);

    const d = token.balanceOfEncodeFunction(user, tokenId);
    return {
      target: tokenAddr,
      gasLimit: 0,
      callData: d,
    };
  }

  async _wrapOwnerOfInfoForERC721CallData(tokenAddr: string, tokenId: string | number) {
    const token = new ERC721(this.chain, tokenAddr);

    const d = token.ownerOfEncodeFunction(tokenId);
    return {
      target: tokenAddr,
      gasLimit: 0,
      callData: d,
    };
  }
}
