import BaseModel from './baseModel';
import MasterAccountModel from './account/masterAccount';

class WalletModel extends BaseModel {
  seed: Buffer;
  mnemonic: string;
  masterAccount: MasterAccountModel;
  name: string;

  constructor() {
    super();

    this.seed = null;
    this.mnemonic = null;
    this.masterAccount = null;
    this.name = null;
  }
}

export default WalletModel;
