import BaseModel from '../baseModel';
import KeyWalletModel from '../key/keyWallet';

class BaseAccountModel extends BaseModel {
  name: string;
  key: KeyWalletModel;

  constructor(name: string, key: KeyWalletModel) {
    super();

    this.name = name;
    this.key = key;
  }
}

export default BaseAccountModel;