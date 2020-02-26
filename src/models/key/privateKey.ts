import BaseKeyModel from './baseKey';
import { PriKeyType } from '@src/constants/wallet';

class PrivateKeyModel extends BaseKeyModel {
  privateKeyBytes: Uint8Array;

  constructor(privateKeyBytes: Uint8Array) {
    super();

    this.privateKeyBytes = privateKeyBytes;
    this.keyType = PriKeyType;
  }
}

export default PrivateKeyModel;