import BaseAccountModel from './baseAccount';
import AccountModel from './account';
import KeyWalletModel from '../key/keyWallet';

class MasterAccountModel extends BaseAccountModel {
  child: AccountModel[];
  deletedIndexes: Number[];

  constructor(name: string, key: KeyWalletModel, child: AccountModel[]) {
    super(name, key);

    this.child = child;
    this.deletedIndexes = [];
  }
}

export default MasterAccountModel;
