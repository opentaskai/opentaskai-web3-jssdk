import { CHAIN_RPC } from '../../constants';

export type NetworkMeta = {
  id: number;
  Payment: string;
  AIGenesis: string;
  RewardClaim: string;
};

export const getNetworkMeta = (network: number): NetworkMeta => {
  switch (network) {
    case 11155111:
      return {
        id: network,
        Payment: '0xF58cD5dEAA238210d2cc1328Dd8eB27F5B2a30b2',
        AIGenesis: '0x3323a6EcAA42f3aF97a6656eC80c1610E357c2FE',
        RewardClaim: '',
      };
    case 56:
      return {
        id: network,
        Payment: '0xF50BF1B4b808fd6956271B4800398323050C773e',
        AIGenesis: '0xD9C2Ff6DBD04A9Ed4d3EFdeD68Bd3766D16de26C',
        RewardClaim: '',
      };
    case 97:
      return {
        id: network,
        Payment: '0x8971fb14a37B9E9A940bE4789f1bb00c9804cd0F',
        AIGenesis: '0x3A2A916EbF8F84D3993B6D7d45b25C9acA8E2AA5',
        RewardClaim: '',
      };
    case 656476:
      return {
        id: network,
        Payment : "0x3212257cAc8cf8eC690e232868f90681F2CDf7a3",
        AIGenesis : "0xF58cD5dEAA238210d2cc1328Dd8eB27F5B2a30b2",
        RewardClaim: '0x7C35db8CD3A8EeC823b9556D0B71f6659EBfe7fB',
      };
    case 41923:
      return {
        id: network,
        Payment : "0xD9C2Ff6DBD04A9Ed4d3EFdeD68Bd3766D16de26C",
        AIGenesis : "",
        RewardClaim: '',
      };
    default:
      return {
        id: 56,
        Payment: '0xF50BF1B4b808fd6956271B4800398323050C773e',
        AIGenesis: '0xD9C2Ff6DBD04A9Ed4d3EFdeD68Bd3766D16de26C',
        RewardClaim: '',
      };
  }
};
