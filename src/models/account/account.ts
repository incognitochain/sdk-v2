import BaseAccountModel from './baseAccount';
import NativeTokenModel from '../token/nativeToken';
import KeyWalletModel from '../key/keyWallet';

class AccountModel extends BaseAccountModel {
  isImport: boolean;
  nativeToken: NativeTokenModel;
  privacyTokenIds: string[];

  constructor(name: string, key: KeyWalletModel) {
    super(name, key);

    this.isImport = false;
    this.nativeToken = null;
    this.privacyTokenIds = [];
  }
}

export default AccountModel;