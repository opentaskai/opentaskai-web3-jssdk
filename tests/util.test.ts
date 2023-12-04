import assert from 'assert';
import { ethers, BigNumber } from 'ethers';
import { toBase64, fromBase64 } from 'js-base64';
import BN from 'bignumber.js';

describe('Util', () => {
  it('test', async () => {
    const result: Record<string, string> = {};
    const query: any[] = [];
    const datas = ['a', 'b', 'c', 'a', 'b'];
    for (let i = 0; i < datas.length; i++) {
      if (!result.hasOwnProperty(datas[i])) query.push(datas[i]);
      result[datas[i]] = '0';
    }

    console.log('result:', result);
    console.log('query:', query);
  });

  it('base64', async () => {
    let str = '$abc';
    console.log(str);
    let encodeStr = toBase64(str);
    console.log(encodeStr);
    let str2 = fromBase64(encodeStr);
    console.log(str2);
    assert.strictEqual(str, str2);
  });

  it('BigNumber', async () => {
    let res: any = BigNumber.from(2);
    console.log(res.toString());

    res = new BN(0.1);
    console.log(res.toString());

    res = res.lt(new BN(0.2));
    console.log(res);

    res = BigNumber.from('0x360c6ebe00000000000000000000000000000000000000006c02fa236544063e');
    console.log('0x360c6ebe00000000000000000000000000000000000000006c02fa236544063e', res.toString());
  });

  it('abi', async () => {
    console.log('transfer', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('transfer(address,uint256)')));

    console.log(
      'transferFrom',
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('transferFrom(address,address,uint256)'))
    );

    console.log(
      'ERC20 Transfer',
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Transfer(address,address,uint256)'))
    );

    console.log(
      'ERC20/721 Transfer',
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Transfer(address,address,uint256)'))
    );

    console.log(
      'ERC1155 TransferSingle',
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('TransferSingle(address,address,address,uint256,uint256)'))
    );

    console.log(
      'ERC1155 TransferBatch',
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('TransferBatch(address,address,address,uint256[],uint256[])'))
    );

    console.log(
      'Uniswap V3 Pool Swap Event',
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Swap(address,address,int256,int256,uint160,uint128,int24)'))
    );
  });

  it('div', async () => {
    let res: any = new BN('10000000000000000');
    res = res.div(3);
    const res1 = res.toFixed(0);
    console.log(res.shiftedBy(-18).toFixed(), res.toFixed(0));

    res = new BN(res.shiftedBy(-18).toFixed());
    const res2 = res.shiftedBy(18).toFixed(0);
    console.log(res1);
    console.log(res2);
    assert.strictEqual(res1, res2);
  });

  it('record', async () => {
    let res: Record<string, any> = {};
    const name = '0x1';
    if (!res[name.toLowerCase()]) {
      res[name] = true;
    }
    console.log(res);
  });
});
