import { KeyWallet } from '@src/key';
import AccountModel from '@src/models/account/account';
import BaseAccountModel from '@src/models/account/baseAccount';

interface BaseAccountInterface extends BaseAccountModel {
  child: AccountModel[];
};

class BaseAccount implements BaseAccountInterface {
  name: string;
  key: KeyWallet;
  child: AccountModel[];

  constructor(name: string) {
    this.name = name;
    this.key = new KeyWallet();
    this.child = [];
  }

  getBackupString() {
  }
}

export default BaseAccount;