import BaseAccountModel from './baseAccount';
import NativeTokenModel from '../token/nativeToken';

interface AccountModelParam {
  key: object,
  name: string,
};

class AccountModel extends BaseAccountModel {
  isImport: boolean;
  nativeToken: NativeTokenModel;
  privacyTokenIds: string[];

  constructor({ name, key } : AccountModelParam) {
    super({ name, key });

    this.isImport = false;
    this.nativeToken = null;
    this.privacyTokenIds = [];
  }
}

export default AccountModel;