import hdkey from 'hdkey';
import {base64Decode, base64Encode} from '@src/privacy/utils';
import goMethods from '@src/go';
import { generateECDSAKeyPair } from '@src/privacy/ecdsa';
import { generateBLSKeyPair } from '@src/privacy/bls';
import { stringToBytes, convertUint8ArrayToArray } from '@src/privacy/utils';
import { checkEncode } from '@src/utils/base58';
import { ENCODE_VERSION } from '@src/constants/constants';
import json from 'circular-json';
import { base64ArrayBuffer } from '@src/utils/common';
import CryptoJS from 'crypto-js';
import { wordArrayToByteArray, byteArrayToWordArray } from './utils';
import { generateKeySet } from './accountKeySet';
import KeyWalletModel from '@src/models/key/keyWallet';
import Validator from '@src/utils/validator';
import { BIP44_COIN_TYPE, ChildNumberSize } from '@src/constants/wallet';
import bn from 'bn.js';

// GeneratePrivateKey generates spending key from seed
export async function generatePrivateKey(seed: Buffer) : Promise<KeyBytes> {
  new Validator('seed', seed).required();

  let seedB64Encode = base64Encode(seed);

  let privateKeyB64Encode;
  if (typeof goMethods.generateKeyFromSeed == 'function') {
    privateKeyB64Encode = await goMethods.generateKeyFromSeed(seedB64Encode);
  }
  if (privateKeyB64Encode == null) {
    throw new Error('Can not generate private key');
  }
  console.log('privateKeyB64Encode', privateKeyB64Encode);
  let spendingKey = base64Decode(privateKeyB64Encode);
  return spendingKey;
}

// GeneratePublicKey generates a public key (address) from spendingKey
export async function generatePublicKey(privateKey: KeyBytes) : Promise<KeyBytes> {
  new Validator('privateKey', privateKey).required();

  let privateKeyB64Encode = base64Encode(privateKey);

  let publicKeyB64Encode;
  if (typeof goMethods.scalarMultBase == 'function') {
    publicKeyB64Encode = await goMethods.scalarMultBase(privateKeyB64Encode);
  }
  if (publicKeyB64Encode == null) {
    throw new Error('Can not generate public key');
  }

  let publicKey = base64Decode(publicKeyB64Encode);
  return publicKey;
}

// GenerateReceivingKey generates a receiving key (ElGamal decryption key) from spendingKey
export async function generateReceivingKey(privateKey: KeyBytes) : Promise<KeyBytes> {
  new Validator('privateKey', privateKey).required();

  let privateKeyB64Encode = base64Encode(privateKey);

  let receivingKeyB64Encode;
  if (typeof goMethods.generateKeyFromSeed == 'function') {
    receivingKeyB64Encode = await goMethods.generateKeyFromSeed(privateKeyB64Encode);
  }
  if (receivingKeyB64Encode == null) {
    throw new Error('Can not generate private key');
  }

  let receivingKey = base64Decode(receivingKeyB64Encode);
  return receivingKey;
}

// GenerateTransmissionKey generates a transmission key (ElGamal encryption key) from receivingKey
export async function generateTransmissionKey(receivingKey: KeyBytes) : Promise<KeyBytes> {
  new Validator('receivingKey', receivingKey).required();

  let receivingKeyB64Encode = base64Encode(receivingKey);

  let transmissionKeyB64Encode;
  if (typeof goMethods.scalarMultBase == 'function') {
    transmissionKeyB64Encode = await goMethods.scalarMultBase(receivingKeyB64Encode);
  }
  if (transmissionKeyB64Encode == null) {
    throw new Error('Can not generate public key');
  }

  let transmissionKey = base64Decode(transmissionKeyB64Encode);
  return transmissionKey;
}

// hashPrivateKey
export async function generateCommitteeKeyFromHashPrivateKey(hashPrivateKeyBytes: Uint8Array, publicKeyBytes: Uint8Array) {
  new Validator('hashPrivateKeyBytes', hashPrivateKeyBytes).required();
  new Validator('publicKeyBytes', publicKeyBytes).required();

  let incPubKey = convertUint8ArrayToArray(publicKeyBytes);

  let blsKeyPair = await generateBLSKeyPair(hashPrivateKeyBytes);

  let ecdsaKeyPair = generateECDSAKeyPair(hashPrivateKeyBytes);

  let miningPubKey = {
    'bls': base64ArrayBuffer(blsKeyPair.blsPublicKey),
    'dsa': base64ArrayBuffer(ecdsaKeyPair.ecdsaPublicKey)
  };

  console.log('Generate committee key bls public key: ', blsKeyPair.blsPublicKey.join(', '));
  console.log('Generate committee key mining pub key dsa: ', ecdsaKeyPair.ecdsaPublicKey.join(', '));
  console.log('Generate committee key incognito pub key: ', incPubKey.join(', '));

  let committeeKey = {
    IncPubKey: base64ArrayBuffer(incPubKey),
    MiningPubKey: miningPubKey,
  };

  // JSON marshal commiteeKey
  let keyStr = json.stringify(committeeKey);
  let encodedKey = checkEncode(stringToBytes(keyStr), ENCODE_VERSION);

  return encodedKey;
}

export async function generateBLSPubKeyB58CheckEncodeFromSeed(seed: number[]) {
  new Validator('seed', seed).required();

  let blsKeyPair = await generateBLSKeyPair(seed);
  let blsPublicKey = convertUint8ArrayToArray(blsKeyPair.blsPublicKey);
  return checkEncode(blsPublicKey, ENCODE_VERSION);
}

export async function generateKey(seed: Buffer, index = 0, depth = -1) {
  const hdKey = hdkey.fromMasterSeed(seed);

  const childHdKey = hdKey.derive(`m/44'/${BIP44_COIN_TYPE}'/0'/0/${index}`);
  const incognitoKeySet = await generateKeySet(childHdKey.privateKey);

  const incognitoChildKey = new KeyWalletModel();
  // @ts-ignore
  incognitoChildKey.childNumber = (new bn(index)).toArray("be", ChildNumberSize);
  incognitoChildKey.chainCode = childHdKey.chainCode;
  incognitoChildKey.depth = depth + 1;
  incognitoChildKey.keySet = incognitoKeySet;

  return incognitoChildKey;
}
