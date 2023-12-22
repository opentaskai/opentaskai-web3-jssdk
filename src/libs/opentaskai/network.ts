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
        Payment: '0x93Ca7fb4BA6d6Bb025c2C09af80291495a6Bf81F',
        AIGenesis: '0x026a12D91d0de4C45468E4cC36Ef91609b3B5a6F',
      };
    case 56:
      return {
        id: network,
        rpcUrl: CHAIN_RPC[network],
        Payment: '',
        AIGenesis: '',
      };
    case 97:
      return {
        id: network,
        rpcUrl: CHAIN_RPC[network],
        Payment: '0xdb188157871232D3E791B766ecFB4855086097aE',
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
