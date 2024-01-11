import { CHAIN_RPC } from '../../constants';

export type NetworkMeta = {
  id: number;
  rpcUrl: string;
  Payment: string;
  AIGenesis: string;
};

export const getNetworkMeta = (network: number): NetworkMeta => {
  switch (network) {
    case 5:
      return {
        id: network,
        rpcUrl: CHAIN_RPC[network],
        Payment: '0x539b12d3780C2A8527b6Bda0FE916A1c9698eB8B',
        AIGenesis: '0x026a12D91d0de4C45468E4cC36Ef91609b3B5a6F',
      };
    case 56:
      return {
        id: network,
        rpcUrl: CHAIN_RPC[network],
        Payment: '',
        AIGenesis: '0xD9C2Ff6DBD04A9Ed4d3EFdeD68Bd3766D16de26C',
      };
    case 97:
      return {
        id: network,
        rpcUrl: CHAIN_RPC[network],
        Payment: '0x3858705aeCB29DcD597C40d17712f4E708396e84',
        AIGenesis: '0x3A2A916EbF8F84D3993B6D7d45b25C9acA8E2AA5',
      };
    default:
      return {
        id: 56,
        rpcUrl: CHAIN_RPC[network],
        Payment: '',
        AIGenesis: '',
      };
  }
};
