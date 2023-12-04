import { ethers, BigNumber, BigNumberish, utils, Wallet } from 'ethers';
/* eslint-disable node/no-extraneous-import */
import { TypedDataDomain } from '@ethersproject/abstract-signer';
/* eslint-disable node/no-extraneous-import */
import { Signature } from '@ethersproject/bytes';
/* eslint-disable node/no-extraneous-import */
import { _TypedDataEncoder } from '@ethersproject/hash';
const { defaultAbiCoder, keccak256, solidityPack } = utils;

export const signData = async (
  signer: Wallet,
  types: string[],
  values: (BigNumberish | boolean)[],
  domain?: TypedDataDomain
): Promise<Signature> => {
  if (domain) {
    return await signTypedData(signer, types, values, domain);
  }

  // https://docs.ethers.io/v5/api/utils/abi/coder/#AbiCoder--methods
  const hash = keccak256(solidityPack(types, values));
  // console.debug('signData hash', hash);
  // Compute the digest
  const digest = keccak256(solidityPack(['string', 'bytes32'], ['\x19Ethereum Signed Message:\n32', hash]));

  // console.debug('signer address:', signer.address);
  const res: any = { ...signer._signingKey().signDigest(digest) };
  res.compact = res.r + res.s.substring(2) + ethers.utils.hexValue(res.v).substring(2);
  res.messageHash = hash;
  res.domainHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
  return res;
};

export const signTypedData = async (
  signer: Wallet,
  types: string[],
  values: (BigNumberish | boolean)[],
  domain: TypedDataDomain
): Promise<Signature> => {
  const domainSeparator = _TypedDataEncoder.hashDomain(domain);

  // https://docs.ethers.io/v5/api/utils/abi/coder/#AbiCoder--methods
  const hash = keccak256(solidityPack(types, values));

  // Compute the digest
  const digest = keccak256(
    solidityPack(['bytes1', 'bytes1', 'bytes32', 'bytes32'], ['0x19', '0x01', domainSeparator, hash])
  );
  // console.debug('signTypedData digest', digest);
  // console.debug('signer address:', signer.address);
  const res: any = { ...signer._signingKey().signDigest(digest) };
  res.compact = res.r + res.s.substring(2) + ethers.utils.hexValue(res.v).substring(2);
  res.messageHash = hash;
  res.domainHash = domainSeparator;
  return res;
};

export const computeDomainSeparator = (domain: TypedDataDomain): string => {
  return _TypedDataEncoder.hashDomain(domain);
};
