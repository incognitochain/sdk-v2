import bn from 'bn.js';
import {
  PriKeyType,
  PriKeySerializeSize,
  PaymentAddressType,
  PaymentAddrSerializeSize,
  ViewingKeyType,
  ReadonlyKeySerializeSize,
  PublicKeyType,
  PublicKeySerializeSize,
  ChildNumberSize,
  ChainCodeSize,
} from '@src/services/wallet/constants';
import { addChecksumToBytes } from './utils';
import { checkEncode, checkDecode, checkSumFirst4Bytes } from '@src/utils/base58';
import { ENCODE_VERSION, ED25519_KEY_SIZE } from '@src/constants/constants';
import PrivateKeyModel from '@src/models/key//privateKey';
import PaymentAddressKeyModel from '@src/models/key/paymentAddress';
import ViewingKeyModel from '@src/models/key//viewingKey';
import { generateKeySet } from '@src/services/key/accountKeySet';
import CryptoJS from 'crypto-js';
import { wordArrayToByteArray, byteArrayToWordArray } from '@src/services/key/utils';

type AllKeyModelType = PrivateKeyModel | PaymentAddressKeyModel | ViewingKeyModel;
type KeyTypeString = 'PRIVATE_KEY' | 'PAYMENT_ADDRESS' | 'PUBLIC_KEY' | 'VIEWING_KEY';

export function serializeKey(key : AllKeyModelType, depth: KeyWalletDepth, childNumber: KeyWalletChildNumber, chainCode: KeyWalletChainCode) {
  // Write fields to buffer in order
  let keyBytes;
  const keyType = key.keyType;

  if (keyType === PriKeyType) {
    keyBytes = new Uint8Array(PriKeySerializeSize);
    let offset = 0;
    keyBytes.set([keyType], offset);
    offset += 1;

    keyBytes.set([depth], offset);
    offset += 1;

    keyBytes.set(childNumber, offset);
    offset += ChildNumberSize;

    keyBytes.set(chainCode, offset);
    offset += ChainCodeSize;

    keyBytes.set([(<PrivateKeyModel>key).privateKeyBytes.length], offset);
    offset += 1;
    keyBytes.set((<PrivateKeyModel>key).privateKeyBytes, offset);

  } else if (keyType === PaymentAddressType) {
    keyBytes = new Uint8Array(PaymentAddrSerializeSize);
    let offset = 0;
    keyBytes.set([keyType], offset);
    offset += 1;

    keyBytes.set([(<PaymentAddressKeyModel>key).publicKeyBytes.length], offset);
    offset += 1;
    keyBytes.set((<PaymentAddressKeyModel>key).publicKeyBytes, offset);
    offset += ED25519_KEY_SIZE;

    keyBytes.set([(<PaymentAddressKeyModel>key).transmissionKeyBytes.length], offset);
    offset += 1;
    keyBytes.set((<PaymentAddressKeyModel>key).transmissionKeyBytes, offset);

  } else if (keyType === ViewingKeyType) {
    keyBytes = new Uint8Array(ReadonlyKeySerializeSize);
    let offset = 0;
    keyBytes.set([keyType], offset);
    offset += 1;

    keyBytes.set([(<ViewingKeyModel>key).publicKeyBytes.length], offset);
    offset += 1;
    keyBytes.set((<ViewingKeyModel>key).publicKeyBytes, offset);
    offset += ED25519_KEY_SIZE;

    keyBytes.set([(<ViewingKeyModel>key).receivingKeyBytes.length], offset);
    offset += 1;
    keyBytes.set((<ViewingKeyModel>key).receivingKeyBytes, offset);
  } else if (keyType === PublicKeyType) {
    keyBytes = new Uint8Array(PublicKeySerializeSize);
    let offset = 0;
    keyBytes.set([keyType], offset);
    offset += 1;

    keyBytes.set([(<PaymentAddressKeyModel>key).publicKeyBytes.length], offset);
    offset += 1;
    keyBytes.set((<PaymentAddressKeyModel>key).publicKeyBytes, offset);
  }

  // Append key bytes to the standard sha3 checksum
  return addChecksumToBytes(keyBytes);
}

function deserializeKeyValidate(bytes: KeyBytes) {
  // validate checksum
  let cs1 = checkSumFirst4Bytes(bytes.slice(0, bytes.length - 4));
  let cs2 = bytes.slice(bytes.length - 4);

  if (!cs1.equals(cs2)) {
    throw Error('Checksum deserialize key wrong!!!');
  }
}

export function deserializePrivateKeyBytes(bytes: KeyBytes) : {
  depth: KeyWalletDepth,
  childNumber: KeyWalletChildNumber,
  chainCode: KeyWalletChainCode,
  privateKey: PrivateKeyModel
} {
  const depth = bytes[1];
  const childNumber = bytes.slice(2, 6);
  const chainCode = bytes.slice(6, 38);
  const keyLength = bytes[38];

  const privateKey = new PrivateKeyModel(bytes.slice(39, 39 + keyLength));

  deserializeKeyValidate(bytes);

  return {
    depth,
    childNumber,
    chainCode,
    privateKey
  };
}

export function deserializePaymentAddressKeyBytes(bytes: KeyBytes) : PaymentAddressKeyModel{
  const paymentAddress = new PaymentAddressKeyModel();

  const publicKeyLength = bytes[1];
  paymentAddress.publicKeyBytes = bytes.slice(2, 2 + publicKeyLength);

  const transmisionKeyLength = bytes[publicKeyLength + 2];
  paymentAddress.transmissionKeyBytes = bytes.slice(publicKeyLength + 3, publicKeyLength + 3 + transmisionKeyLength);

  deserializeKeyValidate(bytes);

  return paymentAddress;
}

export function deserializeViewingKeyBytes(bytes: KeyBytes) : ViewingKeyModel{
  const viewingKey = new ViewingKeyModel();

  const publicKeyLength = bytes[1];
  viewingKey.publicKeyBytes = bytes.slice(2, 2 + publicKeyLength);

  const receivingKeyLength = bytes[publicKeyLength + 2];
  viewingKey.receivingKeyBytes = bytes.slice(publicKeyLength + 3, publicKeyLength + 3 + receivingKeyLength);
  
  deserializeKeyValidate(bytes);

  return viewingKey;
}

export function deserializePublicKeyBytes(bytes: KeyBytes) : KeyBytes {
  const publicKeyLength = bytes[1];
  const publicKeyBytes =  bytes.slice(2, 2 + publicKeyLength);

  deserializeKeyValidate(bytes);

  return publicKeyBytes;
}

export function base58CheckSerialize(key: AllKeyModelType, depth: KeyWalletDepth, childNumber: KeyWalletChildNumber, chainCode: KeyWalletChainCode) {
  let serializedKey = serializeKey(key, depth, childNumber, chainCode);
  return checkEncode(serializedKey, ENCODE_VERSION);
}

export function getKeyTypeFromKeyBytes(keyBytes: KeyBytes) {
  const keyType = keyBytes[0];
  return keyType;
}

export function base58CheckDeserialize(keyStr: string) {
  let keyBytes = checkDecode(keyStr).bytesDecoded;
  const keyType = getKeyTypeFromKeyBytes(keyBytes);

  let type: KeyTypeString;
  let key;

  switch(keyType) {
    case PriKeyType:
      type = 'PRIVATE_KEY';
      key = deserializePrivateKeyBytes(keyBytes);
      break;
    case PaymentAddressType:
      type = 'PAYMENT_ADDRESS';
      key = deserializePaymentAddressKeyBytes(keyBytes);
      break;
    case ViewingKeyType:
      type = 'VIEWING_KEY';
      key = deserializeViewingKeyBytes(keyBytes);
      break;
    case PublicKeyType:
      type = 'PUBLIC_KEY';
      key = deserializePublicKeyBytes(keyBytes);
      break;
  }

  return { type, key };
}

export function getIntermediary(childIndex: number, keyWalletChainCode: KeyWalletChainCode) {
  let childIndexBytes = (new bn(childIndex)).toArray();
  // HmacSHA512(data, key)
  let hmac = CryptoJS.HmacSHA512(CryptoJS.enc.Base64.stringify(byteArrayToWordArray(keyWalletChainCode)), byteArrayToWordArray(Uint8Array.from(childIndexBytes)));
  let intermediary = wordArrayToByteArray(hmac);
  return intermediary;
}


export function generateChildKeyData(childIndex: number, keyWalletDepth: KeyWalletDepth, keyWalletChainCode: KeyWalletChainCode) {
  let intermediary = getIntermediary(childIndex, keyWalletChainCode);
  let newSeed = intermediary.slice(0, 32);
  const keySet = generateKeySet(newSeed);

  const childNumber: KeyWalletChildNumber = Uint8Array.from((new bn(childIndex)).toArray('be', ChildNumberSize));
  const chainCode: KeyWalletChainCode = intermediary.slice(ChainCodeSize);

  return {
    childNumber,
    chainCode,
    depth: keyWalletDepth + 1,
    keySet
  };
}

