import BaseModel from './baseModel';
import MasterAccountModel from './account/masterAccount';

class WalletModel extends BaseModel {
  seed: Uint8Array;
  entropy: number[];
  passPhrase: string;
  mnemonic: string;
  masterAccount: MasterAccountModel;
  name: string;

  constructor() {
    super();
    
    this.seed = null;
    this.entropy = null;
    this.passPhrase = null;
    this.mnemonic = null;
    this.masterAccount = null;
    this.name = null;
  }
}

export default WalletModel;