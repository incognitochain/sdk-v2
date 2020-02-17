import _ from 'lodash';
import { generateMasterKey } from '@src/services/key/generator';
import bn from 'bn.js';
import BaseAccount from './baseAccount';
import ChildAccount from './account';

interface AddChildAccountOptions {
  shardId: number,
  privateKey: string
};

class MasterAccount extends BaseAccount {
  constructor(name: string, seed: string) {
    super(name);

    this.key = generateMasterKey(seed);
  }

  addChildAccount(name: string, { shardId, privateKey }: AddChildAccountOptions) {
    let lastChildAccountIndex = _.findLastIndex(this.child, account => !account.isImport && account.key.childNumber);
    const lastChildAccount = lastChildAccountIndex !== -1 && this.child[lastChildAccountIndex];
    let newIndex = lastChildAccount ? new bn(lastChildAccount.key.ChildNumber).add(new bn(1)).toNumber() : 0;

    const account = new ChildAccount(name, this);

    if (privateKey) {
      account.importFromPrivateKey(privateKey);
    } else {
      account.create({ shardId, accountIndex: newIndex });
    }

    this.child.push(account);
  }
}

export default MasterAccount;