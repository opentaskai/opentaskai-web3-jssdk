import { ethers, Wallet } from 'ethers';
import assert from 'assert';
import { bnWithoutDecimals, bnWithDecimals } from '../src/common/bignumber';
import { Seaport, getSeaport } from '../src/libs/seaport';
import { getMaximumSizeForOrder } from '../src/libs/seaport/utils/item';
import { formatBytes32String } from 'ethers/lib/utils';
import { ItemType } from '../src/constants';
import TEST_CONFIG from './test.config';
import { chain } from './common';

console.log('chainId', chain.chainId);
const wallet = new Wallet(TEST_CONFIG.pklist[1]);
console.log('wallet:', wallet.address);
chain.connect(wallet);

async function test() {
  const erc721Addr = '0xf2a22d3e0d18a62c496e1b6d707dcd0a0135cc64';
  const seaport = new Seaport(chain);
  console.log('seaport address', seaport.address, seaport.getVersion(), seaport.getOperator());

  const order: any = {
    marketplace: 'opensea',
    protocol_name: 'seaport 1.4',
    protocol_address: '0x00000000000001ad428e4906ae43d8f9852d0dd6',
    createtime: '2023-03-14T03:52:22.000Z',
    endtime: '2023-04-13T03:52:22.000Z',
    action: 'list',
    order_hash: '0x750d3bb8183f4040d1d57eafcc82e5d127e7ff34008eb1dc08508bb523b77ed6',
    erc_type: 'erc1155',
    address: '0xe741398b1ed2529fc5adc3bbafd101baca792338',
    token_id: '5',
    amount: 3,
    price: '3000000000000000',
    currency: '0x0000000000000000000000000000000000000000',
    order_status: 'open',
    from: '0x0b8996ca85955f6545bfaa63c931b7328886db69',
    to: '',
    is_collection: false,
    is_bundle: false,
    bundle_count: 1,
    bundle_offset: 0,
    raw_order: {
      parameters: {
        offerer: '0x0b8996ca85955f6545bfaa63c931b7328886db69',
        offer: [
          {
            itemType: 3,
            token: '0xe741398B1Ed2529FC5ADc3bBaFd101baCa792338',
            identifierOrCriteria: '5',
            startAmount: '3',
            endAmount: '3',
          },
        ],
        consideration: [
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '2925000000000000',
            endAmount: '2925000000000000',
            recipient: '0x0B8996cA85955f6545bFAa63c931b7328886Db69',
          },
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '75000000000000',
            endAmount: '75000000000000',
            recipient: '0x0000a26b00c1F0DF003000390027140000fAa719',
          },
        ],
        startTime: '1678765942',
        endTime: '1681357942',
        orderType: 1,
        zone: '0x0000000000000000000000000000000000000000',
        zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        salt: '0x91c0e7a214be6093',
        conduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
        totalOriginalConsiderationItems: 2,
        counter: 0,
      },
      signature:
        '0x8d6a96fb61ecd48e1969bbf6b1a2a53f1308a2203a8c324b304481d794461873cc2173483ef88a767521b675a01cefdf23aa1160b15ca2eb9fda0352f14720a6',
    },
  };

  const transaction = await getSeaport(chain, order.protocol_address).fulfillOrderEncodeFunction({
    order: order.raw_order,
    unitsToFill: 1,
  });
  console.log('fulfillOrderEncodeFunction:', transaction, transaction.value.toString());
}

test();
