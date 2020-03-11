import WalletModel from "@src/models/wallet";
import { MasterAccount } from "./account";
import { initWalletData, encryptWalletData, decryptWalletData } from '@src/services/wallet';
import Validator from "@src/utils/validator";

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
    try {
      new Validator('encryptedWallet', encryptedWallet).required().string();
      new Validator('password', password).required().string();
  
      const data: any = await decryptWalletData(encryptedWallet, password);
      const { masterAccount, name, mnemonic, seed, entropy, passPhrase } = data;
      const wallet = new Wallet();
  
      wallet.import(name, passPhrase, mnemonic, entropy, Uint8Array.from(seed), MasterAccount.restoreFromBackupData(masterAccount));
  
      L.info(`Restored wallet "${name}"`);
  
      return wallet;
    } catch (e) {
      L.error('Restored wallet failed', e);
      throw e;
    }
  }

  async init(passPhrase: string, name?: string) {
    try {
      new Validator('passPhrase', passPhrase).required().string();
      new Validator('name', name).string();
  
      const { entropy, mnemonic, seed } = initWalletData(passPhrase);
      this.passPhrase = passPhrase;
      this.name = name || this.name;
      this.seed = seed;
      this.mnemonic = mnemonic;
      this.entropy = entropy;
      this.masterAccount = await new MasterAccount('MASTER').init(seed);
  
      L.info(`Initialized new wallet "${this.name}"`);
  
      return this;
    } catch(e) {
      L.error('Initialized wallet failed', e);
      throw e;
    }
  }

  import(name: string, passPhrase: string, mnemonic: string, entropy: number[], seed: Uint8Array, masterAccount: MasterAccount) {
    new Validator('name', name).required().string();
    new Validator('passPhrase', passPhrase).required().string();
    new Validator('mnemonic', mnemonic).required().string();
    new Validator('entropy', entropy).required().array();
    new Validator('seed', seed).required();
    new Validator('masterAccount', masterAccount).required();

    this.name = name;
    this.seed = seed;
    this.entropy = entropy;
    this.passPhrase = passPhrase;
    this.mnemonic = mnemonic;
    this.masterAccount = masterAccount;
  }

  backup(password: string) {
    try {
      new Validator('password', password).required().string();

      const data = {
        masterAccount: this.masterAccount.getBackupData(),
        name: this.name,
        mnemonic: this.mnemonic,
        passPhrase: this.passPhrase,
        entropy: this.entropy,
        seed: Array.from(this.seed)
      };
  
      L.info('Created wallet backup string successfully');
  
      return encryptWalletData(data, password);
    } catch (e) {
      L.error('Created wallet backup string failed', e);
      throw e;
    }
  }
}

export default Wallet;