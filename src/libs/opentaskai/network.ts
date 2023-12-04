import { CHAIN_RPC } from '../../constants';

export type NetworkMeta = {
  id: number;
  rpcUrl: string;
  PaymentContract: string;
};

export const getNetworkMeta = (network: number): NetworkMeta => {
  switch (network) {
    case 5:
      return {
        id: network,
        rpcUrl: CHAIN_RPC[network],
        PaymentContract: '0x9Aa6Ff7524C8bb7E78e9853713657FD678C8F3F7',
      };
    case 56:
      return {
        id: network,
        rpcUrl: CHAIN_RPC[network],
        PaymentContract: '',
      };
    case 97:
      return {
        id: network,
        rpcUrl: CHAIN_RPC[network],
        PaymentContract: '0xF58cD5dEAA238210d2cc1328Dd8eB27F5B2a30b2',
      };
    default:
      return {
        id: 56,
        rpcUrl: CHAIN_RPC[network],
        PaymentContract: '',
      };
  }
};
