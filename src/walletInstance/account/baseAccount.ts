import BaseAccountModel from '@src/models/account/baseAccount';
import KeyWalletModel from '@src/models/key/keyWallet';
import { base58CheckSerialize, getBackupData as getBackupDataKeyWallet } from '@src/services/key/keyWallet';

interface BaseAccountInterface extends BaseAccountModel {};

class BaseAccount implements BaseAccountInterface {
  name: string;
  key: KeyWalletModel;

  constructor(name: string) {
    this.name = name;
    this.key = null;
  }

  getIndex() {
    const array = this.key.childNumber;
    let value = 0;
    for (let i = 0; i < array.length; i++) {
      value = (value * 256) + array[i];
    }

    return value;
  };

  serializeKeys() {
    this.key.keySet.privateKeySerialized = base58CheckSerialize(this.key.keySet.privateKey, this.key.depth, this.key.childNumber, this.key.chainCode);
    this.key.keySet.paymentAddressKeySerialized = base58CheckSerialize(this.key.keySet.paymentAddress, this.key.depth, this.key.childNumber, this.key.chainCode);
    this.key.keySet.viewingKeySerialized = base58CheckSerialize(this.key.keySet.viewingKey, this.key.depth, this.key.childNumber, this.key.chainCode);
    this.key.keySet.index = this.getIndex();
  }

  getSerializedInformations() {
    return {
      privateKey: this.key.keySet.privateKeySerialized,
      publicKey: this.key.keySet.publicKeyCheckEncode,
      paymentAddress: this.key.keySet.paymentAddressKeySerialized,
      readOnlyKey: this.key.keySet.viewingKeySerialized,
      index: this.key.keySet.index,
    }
  }

  getBackupData() {
    return {
      name: this.name,
      key: getBackupDataKeyWallet(this.key),
    };
  }
}

export default BaseAccount;
