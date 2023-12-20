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
        AIGenesis: '0x8519BA6087cA60bdec4B3457EB579DAcAA6375e7',
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
        AIGenesis: '0x442133B6814F5E6c0ee5dc7DABB6db8DE00C3577',
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
