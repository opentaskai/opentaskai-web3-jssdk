import { ethers } from 'ethers';

export function formatAddress(val: string) {
  if (val.length === 66) {
    return '0x' + val.substring(26);
  }
  return val;
}

export function hexToBytes32(val: string) {
  if (val.substring(0, 2) !== '0x') val = '0x' + val;
  return ethers.utils.hexZeroPad(val, 32);
}

export function bytes32ToHex(val: string, has0x: boolean = false, len=32) {
    if (val.substring(0, 2) !== '0x') val = '0x' + val;
    let res = ethers.utils.hexStripZeros(val);
    if (!has0x) res = res.substring(2);
    if (len && res.length < len) {
        res = res.padStart(32, '0');
    }
    return res;
}