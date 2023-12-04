import { Contract, BaseContract } from 'ethers';
import { Chain } from './chain';
import type { FunctionFragment, Interface, Result } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { providers as multicallProviders } from '@0xsequence/multicall';

export type MethodArg = string | number | BigNumber;
export type MethodArgs = Array<MethodArg | MethodArg[]>;

export function isMethodArg(x: any): x is MethodArg {
  return BigNumber.isBigNumber(x) || ['string', 'number'].indexOf(typeof x) !== -1;
}

export function isValidMethodArgs(x: any): x is MethodArgs | undefined {
  return (
    x === undefined ||
    (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
  );
}

export type CallTyped = {
  target: string;
  gasLimit: number;
  callData: string | undefined;
};

export type CallResult = {
  valid: boolean;
  result: Result;
};

export type CallState = {
  valid: boolean;
  // the result, or undefined if loading or errored/no data
  result: Result | undefined;
  // true if the call was made and is synced, but the return data is invalid
  error: boolean;
};

type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined;

export async function useSingleContractWithCallData(chain: Chain, contract: Contract, callData: any[], options?: any) {
  if (!callData.length) {
    throw new Error('useSingleContractWithCallData no call data');
  }
  let gasLimit: any = options?.gasRequired ?? 0;
  if (gasLimit === undefined) gasLimit = 0;
  const calls: CallTyped[] = callData.map((d) => {
    return {
      target: contract.address,
      callData: d,
      gasLimit,
    };
  });

  const rc = await multicall(chain, calls);
  if (rc.length != callData.length) {
    throw new Error('useSingleContractWithCallData call result length is not match');
  }
  const res = rc.map((d, i) => {
    return decodeCall(
      d,
      contract?.interface,
      BaseContract.getInterface(contract.interface).getFunction(callData[i].substring(0, 10))
    );
  });
  return res;
}

export async function useMultipleContractSingleData(
  chain: Chain,
  addresses: (string | undefined)[],
  contractInterface: Interface,
  methodName: string,
  callInputs?: (string | number | import('ethers').BigNumber | MethodArg[] | undefined)[] | undefined,
  options?: any
) {
  if (!addresses.length) {
    throw new Error('useMultipleContractSingleData no addresses');
  }
  let gasLimit: any = options?.gasRequired ?? 0;
  if (gasLimit === undefined) gasLimit = 0;
  const { fragment, callData } = getCallData(methodName, contractInterface, callInputs);
  const calls: CallTyped[] = [];
  addresses.map((d) => {
    if (d) {
      calls.push({
        target: d,
        callData: callData,
        gasLimit,
      });
    }
  });

  const rc = await multicall(chain, calls);
  const res = rc.map((d) => decodeCall(d, contractInterface, fragment ?? ''));
  return res;
}

function getCallData(
  methodName: string,
  contractInterface: Interface | null | undefined,
  callInputs: OptionalMethodInputs | undefined
) {
  // Create ethers function fragment
  const fragment = contractInterface?.getFunction(methodName);
  // Get encoded call data
  const callData: string | undefined =
    fragment && isValidMethodArgs(callInputs) ? contractInterface?.encodeFunctionData(fragment, callInputs) : undefined;

  return { fragment, callData };
}

export async function multicall(chain: Chain, callData: CallTyped[]): Promise<string[]> {
  const transactions = callData.map((d) => {
    return {
      to: d.target,
      data: d.callData,
    };
  });

  const provider = chain.getProvider();
  if (!provider) throw new Error('no provider');
  const multicallProvider = new multicallProviders.MulticallProvider(provider);
  return await Promise.all(transactions.map((d) => multicallProvider.call(d)));
}

export function decodeCall(data: string, contractInterface: Interface, fragment: FunctionFragment | string): CallState {
  const success = data && data.length > 2;
  let result: CallState = {
    valid: false,
    error: false,
    result: undefined,
  };
  if (success && data) {
    result.valid = true;
    try {
      result.error = true;
      result.result = contractInterface.decodeFunctionResult(fragment, data);
      // console.debug('decodeCall result', result.result);
    } catch (error) {
      // const _fragment: any = fragment;
      // console.error('decodeFunctionResult except', _fragment?.name, data);
    }
  }
  return result;
}
