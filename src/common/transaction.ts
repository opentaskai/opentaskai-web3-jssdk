import { Contract, Overrides, CallOverrides, PayableOverrides, BigNumber } from 'ethers';

import type { TransactionMethods, ContractMethodReturnType, TypedFunctionData } from './types';

const instanceOfOverrides = <T extends Overrides | PayableOverrides | CallOverrides>(obj: any): obj is T => {
  const validKeys = [
    'gasLimit',
    'gasPrice',
    'maxFeePerGas',
    'maxPriorityFeePerGas',
    'nonce',
    'type',
    'accessList',
    'customData',
    'ccipReadEnabled',
    'value',
    'blockTag',
    'CallOverrides',
  ];

  return obj === undefined || Object.keys(obj).every((key) => validKeys.includes(key));
};

export const getTransactionMethods = <T extends Contract, U extends keyof T['functions']>(
  contract: T,
  method: U,
  args: Parameters<T['functions'][U]>
): TransactionMethods<ContractMethodReturnType<T, U>> => {
  const lastArg = args[args.length - 1];

  let initialOverrides: Overrides;

  if (instanceOfOverrides(lastArg)) {
    initialOverrides = lastArg;
    args.pop();
  }

  return {
    callStatic: (overrides?: Overrides) => {
      const mergedOverrides = { ...initialOverrides, ...overrides };

      return contract.callStatic[method as string](...[...args, mergedOverrides]);
    },
    estimateGas: (overrides?: Overrides) => {
      const mergedOverrides = { ...initialOverrides, ...overrides };

      return contract.estimateGas[method as string](...[...args, mergedOverrides]);
    },
    transact: (overrides?: Overrides) => {
      const mergedOverrides = { ...initialOverrides, ...overrides };

      return contract[method as string](...args, mergedOverrides);
    },
    buildTransaction: (overrides?: Overrides) => {
      const mergedOverrides = { ...initialOverrides, ...overrides };
      // console.log('mergedOverrides', mergedOverrides);
      return contract.populateTransaction[method as string](...[...args, mergedOverrides]);
    },
    encodeFunction: (overrides?: PayableOverrides) => {
      const mergedOverrides = { ...initialOverrides, ...overrides };
      let value = BigNumber.from('0');
      if (mergedOverrides?.value) value = BigNumber.from(mergedOverrides.value);
      return {
        to: contract.address,
        value,
        data: contract.interface.encodeFunctionData(method as string, args),
      };
    },
  };
};
