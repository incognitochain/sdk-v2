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
} from '@src/constants/wallet';
import { addChecksumToBytes } from './utils';
import { checkEncode, checkSumFirst4Bytes } from '@src/utils/base58';
import { ENCODE_VERSION, ED25519_KEY_SIZE } from '@src/constants/constants';
import PrivateKeyModel from '@src/models/key//privateKey';
import PaymentAddressKeyModel from '@src/models/key/paymentAddress';
import ViewingKeyModel from '@src/models/key//viewingKey';
import {
  getBackupData as getBackupDataKeySet,
  restoreKeySetFromBackupData,
} from '@src/services/key/accountKeySet';
import CryptoJS from 'crypto-js';
import {
  wordArrayToByteArray,
  byteArrayToWordArray,
} from '@src/services/key/utils';
import KeyWalletModel from '@src/models/key/keyWallet';
import Validator from '@src/utils/validator';
import {
  getKeyBytes,
  extractPaymentAddressKey,
  extractPrivateKey,
  extractViewingKey,
} from '@src/utils/key';
import KEYS from '@src/constants/keys';

type AllKeyModelType =
  | PrivateKeyModel
  | PaymentAddressKeyModel
  | ViewingKeyModel;
type KeyTypeString =
  | 'PRIVATE_KEY'
  | 'PAYMENT_ADDRESS'
  | 'PUBLIC_KEY'
  | 'VIEWING_KEY';

export function serializeKey(
  key: AllKeyModelType,
  depth: KeyWalletDepth,
  childNumber: KeyWalletChildNumber,
  chainCode: KeyWalletChainCode
) {
  new Validator('key', key).required();
  new Validator('depth', depth).required().number();
  new Validator('childNumber', childNumber).required();
  new Validator('chainCode', chainCode).required();

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

    keyBytes.set(
      [(<PaymentAddressKeyModel>key).transmissionKeyBytes.length],
      offset
    );
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
  new Validator('bytes', bytes).required();

  // validate checksum
  let cs1 = checkSumFirst4Bytes(bytes.slice(0, bytes.length - 4));
  let cs2 = bytes.slice(bytes.length - 4);

  if (!cs1.equals(cs2)) {
    throw Error('Checksum deserialize key wrong!!!');
  }
}

export function deserializePrivateKeyBytes(
  bytes: KeyBytes
): {
  depth: KeyWalletDepth;
  childNumber: KeyWalletChildNumber;
  chainCode: KeyWalletChainCode;
  privateKey: PrivateKeyModel;
} {
  new Validator('bytes', bytes).required();

  const { depth, childNumber, chainCode, keyLength } = extractPrivateKey(bytes);

  const privateKey = new PrivateKeyModel(bytes.slice(39, 39 + keyLength));

  deserializeKeyValidate(bytes);

  return {
    depth,
    childNumber,
    chainCode,
    privateKey,
  };
}

export function deserializePaymentAddressKeyBytes(
  bytes: KeyBytes
): PaymentAddressKeyModel {
  new Validator('bytes', bytes).required();

  const paymentAddress = new PaymentAddressKeyModel();

  const { publicKeyBytes, transmissionKeyBytes } = extractPaymentAddressKey(
    bytes
  );

  paymentAddress.publicKeyBytes = publicKeyBytes;
  paymentAddress.transmissionKeyBytes = transmissionKeyBytes;

  deserializeKeyValidate(bytes);

  return paymentAddress;
}

export function deserializeViewingKeyBytes(bytes: KeyBytes): ViewingKeyModel {
  new Validator('bytes', bytes).required();

  const viewingKey = new ViewingKeyModel();

  const { publicKeyBytes, receivingKeyBytes } = extractViewingKey(bytes);

  viewingKey.publicKeyBytes = publicKeyBytes;
  viewingKey.receivingKeyBytes = receivingKeyBytes;

  deserializeKeyValidate(bytes);

  return viewingKey;
}

export function deserializePublicKeyBytes(bytes: KeyBytes): KeyBytes {
  new Validator('bytes', bytes).required();

  const publicKeyLength = bytes[1];
  const publicKeyBytes = bytes.slice(2, 2 + publicKeyLength);

  deserializeKeyValidate(bytes);

  return publicKeyBytes;
}

export function base58CheckSerialize(
  key: AllKeyModelType,
  depth: KeyWalletDepth,
  childNumber: KeyWalletChildNumber,
  chainCode: KeyWalletChainCode
) {
  new Validator('key', key).required();
  new Validator('depth', depth).required();
  new Validator('childNumber', childNumber).required();
  new Validator('chainCode', chainCode).required();

  let serializedKey = serializeKey(key, depth, childNumber, chainCode);
  return checkEncode(serializedKey, ENCODE_VERSION);
}

export function base58CheckDeserialize(keyStr: string) {
  new Validator('keyStr', keyStr).required().string();

  const { keyBytes, keyType } = getKeyBytes(keyStr);

  let type: KeyTypeString;
  let key;

  switch (keyType) {
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

export function getIntermediary(
  childIndex: number,
  keyWalletChainCode: KeyWalletChainCode
) {
  new Validator('childIndex', childIndex).required();
  new Validator('keyWalletChainCode', keyWalletChainCode).required();

  let childIndexBytes = new bn(childIndex).toArray();
  // HmacSHA512(data, key)
  let hmac = CryptoJS.HmacSHA512(
    CryptoJS.enc.Base64.stringify(byteArrayToWordArray(keyWalletChainCode)),
    byteArrayToWordArray(Uint8Array.from(childIndexBytes))
  );
  let intermediary = wordArrayToByteArray(hmac);
  return intermediary;
}

export function getBackupData(keyWallet: KeyWalletModel) {
  new Validator('keyWallet', keyWallet).required();

  const data = {
    chainCode: Array.from(keyWallet.chainCode),
    childNumber: Array.from(keyWallet.childNumber),
    depth: keyWallet.depth,
    keySet: getBackupDataKeySet(keyWallet.keySet),
  };

  return data;
}

export function restoreKeyWalletFromBackupData(data: any) {
  new Validator('data', data).required();

  const { chainCode, childNumber, depth, keySet } = data;
  const keyWallet = new KeyWalletModel();

  keyWallet.chainCode = Uint8Array.from(chainCode);
  keyWallet.childNumber = Uint8Array.from(childNumber);
  keyWallet.depth = depth;
  keyWallet.keySet = restoreKeySetFromBackupData(keySet);

  return keyWallet;
}

export const checkPaymentAddress = (paymentAddr: string) => {
  new Validator('data', paymentAddr).required();
  let result = false;
  try {
    const { keyBytes } = getKeyBytes(paymentAddr);
    const key = deserializePaymentAddressKeyBytes(keyBytes);
    result =
      key.publicKeyBytes.length === KEYS.PUBLIC_KEY_BYTES_LENGTH &&
      key.transmissionKeyBytes.length === KEYS.PUBLIC_KEY_BYTES_LENGTH;
  } catch (error) {
    result = false;
  }
  return result;
};
