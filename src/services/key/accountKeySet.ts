import { generatePublicKey, generateReceivingKey, generateTransmissionKey, generatePrivateKey } from '@src/services/key/generator';
import PaymentAddressKeyModel from '@src/models/key/paymentAddress';
import ViewingKeyModel from '@src/models/key/viewingKey';
import PrivateKeyModel from '@src/models/key/privateKey';
import AccountKeySetModel from '@src/models/key/accountKeySet';

export function getKeySetFromPrivateKeyBytes(privateKeyBytes: KeyBytes) {
  const paymentAddress = new PaymentAddressKeyModel();
  const viewingKey = new ViewingKeyModel();
  const privateKey = new PrivateKeyModel(privateKeyBytes);
  const publicKeyBytes = generatePublicKey(privateKeyBytes);
  const receivingKeyBytes = generateReceivingKey(privateKeyBytes);
  const transmissionKeyBytes = generateTransmissionKey(receivingKeyBytes);

  paymentAddress.publicKeyBytes = publicKeyBytes;
  paymentAddress.transmissionKeyBytes = transmissionKeyBytes;
  
  viewingKey.publicKeyBytes = publicKeyBytes;
  viewingKey.receivingKeyBytes = receivingKeyBytes;

  return new AccountKeySetModel({ privateKey, paymentAddress, viewingKey });
}

export function generateKeySet(seed: string) {
  const privateKey = generatePrivateKey(seed);
  return getKeySetFromPrivateKeyBytes(privateKey);
}

export function getBackupData(keySet: AccountKeySetModel) {
  const data = {
    publicKeyBytes: Array.from(keySet.paymentAddress.publicKeyBytes),
    transmissionKeyBytes: Array.from(keySet.paymentAddress.transmissionKeyBytes),
    privateKeyBytes: Array.from(keySet.privateKey.privateKeyBytes),
    receivingKeyBytes: Array.from(keySet.viewingKey.receivingKeyBytes),
  };

  return data;
}

export function restoreKeySetFromBackupData(data: any) {
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