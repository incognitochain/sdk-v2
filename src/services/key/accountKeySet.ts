import { generatePublicKey, generateReceivingKey, generateTransmissionKey, generatePrivateKey, generateBLSPubKeyB58CheckEncodeFromSeed } from '@src/services/key/generator';
import PaymentAddressKeyModel from '@src/models/key/paymentAddress';
import ViewingKeyModel from '@src/models/key/viewingKey';
import PrivateKeyModel from '@src/models/key/privateKey';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import Validator from '@src/utils/validator';

export async function getKeySetFromPrivateKeyBytes(privateKeyBytes: KeyBytes) {
  new Validator('privateKeyBytes', privateKeyBytes).required();

  const paymentAddress = new PaymentAddressKeyModel();
  const viewingKey = new ViewingKeyModel();
  const privateKey = new PrivateKeyModel(privateKeyBytes);
  const publicKeyBytes = await generatePublicKey(privateKeyBytes);
  const receivingKeyBytes = await generateReceivingKey(privateKeyBytes);
  const transmissionKeyBytes = await generateTransmissionKey(receivingKeyBytes);

  paymentAddress.publicKeyBytes = publicKeyBytes;
  paymentAddress.transmissionKeyBytes = transmissionKeyBytes;

  viewingKey.publicKeyBytes = publicKeyBytes;
  viewingKey.receivingKeyBytes = receivingKeyBytes;

  return new AccountKeySetModel({ privateKey, paymentAddress, viewingKey });
}

export async function getBLSPublicKeyB58CheckEncode(miningSeedKey: number[]){
  new Validator('miningSeedKey', miningSeedKey).required();

  return await generateBLSPubKeyB58CheckEncodeFromSeed(miningSeedKey);
}

export async function generateKeySet(seed: Buffer) {
  new Validator('seed', seed).required();

  const privateKey = await generatePrivateKey(seed);
  return getKeySetFromPrivateKeyBytes(privateKey);
}

export function getBackupData(keySet: AccountKeySetModel) {
  new Validator('keySet', keySet).required();

  const data = {
    publicKeyBytes: Array.from(keySet.paymentAddress.publicKeyBytes),
    transmissionKeyBytes: Array.from(keySet.paymentAddress.transmissionKeyBytes),
    privateKeyBytes: Array.from(keySet.privateKey.privateKeyBytes),
    receivingKeyBytes: Array.from(keySet.viewingKey.receivingKeyBytes),
  };

  return data;
}

export function restoreKeySetFromBackupData(data: any) {
  new Validator('data', data).required();

  const { publicKeyBytes, transmissionKeyBytes, privateKeyBytes, receivingKeyBytes } = data;
  const privateKey = new PrivateKeyModel(Uint8Array.from(privateKeyBytes));
  const paymentAddress = new PaymentAddressKeyModel();
  const viewingKey = new ViewingKeyModel();

  paymentAddress.publicKeyBytes = Uint8Array.from(publicKeyBytes);
  paymentAddress.transmissionKeyBytes = Uint8Array.from(transmissionKeyBytes);
  viewingKey.publicKeyBytes = Uint8Array.from(publicKeyBytes);
  viewingKey.receivingKeyBytes = Uint8Array.from(receivingKeyBytes);

  const keySet = new AccountKeySetModel({
    privateKey,
    paymentAddress,
    viewingKey
  });

  return keySet;
}
