import WalletModel from "@src/models/wallet";
import CryptoJS from "crypto-js";
import { MasterAccount } from "./account";
import { initWalletData, encryptWalletData, decryptWalletData } from '@src/services/wallet';

const  DEFAULT_WALLET_NAME = 'INCOGNITO_WALLET';

class Wallet implements WalletModel {
  seed: Uint8Array;
  entropy: number[];
  passPhrase: string;
  mnemonic: string;
  masterAccount: MasterAccount;
  name: string;

  constructor() {
    this.seed = null;
    this.entropy = null;
    this.passPhrase = null;
    this.mnemonic = null;
    this.masterAccount = null;
    this.name = DEFAULT_WALLET_NAME;
  }

  static async restore(encryptedWallet: string, password: string) {
    const data: any = await decryptWalletData(encryptedWallet, password);
    const { masterAccount, name, mnemonic, seed, entropy, passPhrase } = data;
    const wallet = new Wallet();

    wallet.import(name, passPhrase, mnemonic, entropy, Uint8Array.from(seed), MasterAccount.restoreFromBackupData(masterAccount));

    return wallet;
  }

  async init(passPhrase: string, name?: string) {
    const { entropy, mnemonic, seed } = initWalletData(null, passPhrase);
    this.passPhrase = passPhrase;
    this.name = name || this.name;
    this.seed = seed;
    this.mnemonic = mnemonic;
    this.entropy = entropy;
    this.masterAccount = await new MasterAccount('MASTER').init(seed);

    return this;
  }

  import(name: string, passPhrase: string, mnemonic: string, entropy: number[], seed: Uint8Array, masterAccount: MasterAccount) {
    this.name = name;
    this.seed = seed;
    this.entropy = entropy;
    this.passPhrase = passPhrase;
    this.mnemonic = mnemonic;
    this.masterAccount = masterAccount;
  }

  backup(password: string) {
    const data = {
      masterAccount: this.masterAccount.getBackupData(),
      name: this.name,
      mnemonic: this.mnemonic,
      passPhrase: this.passPhrase,
      entropy: this.entropy,
      seed: Array.from(this.seed)
    };

    return encryptWalletData(data, password);
  }
}

export default Wallet;