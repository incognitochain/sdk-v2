import BaseKeyModel from './baseKey';
import { ViewingKeyType } from '@src/constants/wallet'
import { VIEWING_KEY_SIZE, PUBLIC_KEY_SIZE } from '@src/constants/constants';


class ViewingKeyModel extends BaseKeyModel {
  publicKeyBytes: Uint8Array;
  receivingKeyBytes: Uint8Array;

  constructor() {
    super();

    this.publicKeyBytes = null;
    this.receivingKeyBytes = null;
    this.keyType = ViewingKeyType;
  }

  toBytes() {
    let viewingKeyBytes = new Uint8Array(VIEWING_KEY_SIZE);
    viewingKeyBytes.set(this.publicKeyBytes, 0);
    viewingKeyBytes.set(this.receivingKeyBytes, PUBLIC_KEY_SIZE);
    return viewingKeyBytes;
  }
}

export default ViewingKeyModel;