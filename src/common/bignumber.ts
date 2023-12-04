import { ethers, BigNumberish, BigNumber } from 'ethers';
import BN from 'bignumber.js';

export function bnWithoutDecimals(bn: string | BigNumber | BN, decimals: number): string {
  if (bn instanceof BigNumber) bn = bn.toString();
  return new BN(bn).shiftedBy(-1 * decimals).toFixed();
}

export function bnWithDecimals(bn: string | number, decimals: number): string {
  return new BN(bn).shiftedBy(1 * decimals).toFixed(0);
}

export function toHexZeroPad32(val: string | number) {
  let res: any = BigNumber.from(val);
  res = ethers.utils.hexZeroPad(res.toHexString(), 32);
  return res;
}

export function fromHexZeroPad32(hexVal: string) {
  let res = BigNumber.from(hexVal);
  return res.toString();
}
