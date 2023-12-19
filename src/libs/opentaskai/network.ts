import { CHAIN_RPC } from '../../constants';

export type NetworkMeta = {
  id: number;
  rpcUrl: string;
  PaymentContract: string;
  AIGenesis: string;
};

export const getNetworkMeta = (network: number): NetworkMeta => {
  switch (network) {
    case 5:
      return {
        id: network,
        rpcUrl: CHAIN_RPC[network],
        PaymentContract: '0x93Ca7fb4BA6d6Bb025c2C09af80291495a6Bf81F',
        AIGenesis: '0x79504C748cfCFA64e0E12aA616e57ce535EA3707',
      };
    case 56:
      return {
        id: network,
        rpcUrl: CHAIN_RPC[network],
        PaymentContract: '',
        AIGenesis: '',
      };
    case 97:
      return {
        id: network,
        rpcUrl: CHAIN_RPC[network],
        PaymentContract: '0xdb188157871232D3E791B766ecFB4855086097aE',
        AIGenesis: '0xb47768e196aDC31157027006352172610ccA4732',
      };
    default:
      return {
        id: 56,
        rpcUrl: CHAIN_RPC[network],
        PaymentContract: '',
        AIGenesis: '',
      };
  }
};
