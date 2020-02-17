import WalletModel from "@src/models/wallet";
import { MasterAccount } from "./account";
import { initWalletData } from '@src/services/wallet';

const  DEFAULT_WALLET_NAME = 'INCOGNITO_WALLET';

class Wallet implements WalletModel {
  seed: Uint8Array;
  entropy: number[];
  passPhrase: string;
  mnemonic: string;
  masterAccount: MasterAccount;
  name: string;

  constructor(passPhrase: string, name?: string) {
    this.seed = null;
    this.entropy = null;
    this.passPhrase = passPhrase;
    this.mnemonic = null;
    this.masterAccount = null;
    this.name = name || DEFAULT_WALLET_NAME;

    this.init();
  }

  init() {
    const { entropy, mnemonic, seed } = initWalletData(null, this.passPhrase);
    this.seed = seed;
    this.mnemonic = mnemonic;
    this.entropy = entropy;
    this.masterAccount = new MasterAccount(this.seed);
  }
}

export default Wallet;