import BaseAccountModel from './baseAccount';
import AccountModel from './account';

interface MasterAccountModelParam {
  key: object,
  name: string,
  child: AccountModel[],
};

class MasterAccountModel extends BaseAccountModel {
  child: AccountModel[];

  constructor({ name, key, child } : MasterAccountModelParam) {
    super({ name, key });

    this.child = child;
  }
}

export default MasterAccountModel;