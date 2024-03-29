import WalletModel from "@src/models/wallet";
import { MasterAccount } from "./account";
import { initWalletData, encryptWalletData, decryptWalletData } from '@src/services/wallet';
import Validator from "@src/utils/validator";
import mnemonicService from '@src/services/wallet/mnemonic';
import SDKError, { ERROR_CODE } from '@src/constants/error';
import { apiGetWalletAccounts, apiUpdateWalletAccounts } from '@src/services/api';
import _ from 'lodash';

const  DEFAULT_WALLET_NAME = 'INCOGNITO_WALLET';

class Wallet implements WalletModel {
  seed: Buffer;
  mnemonic: string;
  masterAccount: MasterAccount;
  name: string;

  constructor() {
    this.seed = null;
    this.mnemonic = null;
    this.masterAccount = null;
    this.name = DEFAULT_WALLET_NAME;
  }

  static async restore(encryptedWallet: string, password: string) {
    try {
      new Validator('encryptedWallet', encryptedWallet).required().string();
      new Validator('password', password).required().string();

      const data: any = await decryptWalletData(encryptedWallet, password);
      const { masterAccount, name, mnemonic, seed } = data;
      const wallet = new Wallet();

      const seedBuffer = Buffer.from(seed);

      await wallet.restore(name, mnemonic, seedBuffer, MasterAccount.restoreFromBackupData(masterAccount, seedBuffer));

      L.info(`Restored wallet "${name}"`);

      return wallet;
    } catch (e) {
      L.error('Restored wallet failed', e);
      throw e;
    }
  }

  async init(name?: string) {
    try {
      new Validator('name', name).string();

      const { mnemonic, seed } = initWalletData();
      this.name = name || this.name;
      this.seed = seed;
      this.mnemonic = mnemonic;
      this.masterAccount = await new MasterAccount('MASTER', seed).init();

      L.info(`Initialized new wallet "${this.name}"`);

      return this;
    } catch(e) {
      L.error('Initialized wallet failed', e);
      throw e;
    }
  }

  async restore(name: string, mnemonic: string, seed: Buffer, masterAccount: MasterAccount) {
    new Validator('name', name).required().string();
    new Validator('mnemonic', mnemonic).required().string();
    new Validator('seed', seed).required();
    new Validator('masterAccount', masterAccount).required();

    this.name = name;
    this.seed = seed;
    this.mnemonic = mnemonic;
    this.masterAccount = masterAccount;

    const isIncorrectBIP44 = await this.isIncorrectBIP44();

    if (isIncorrectBIP44) {
      console.warn('Your master key is not supported back up accounts with mnemonic. Please create another master key then transfer all your funds to it.');
    }
  }

  async import(name: string, mnemonic: string) {
    new Validator('name', name).required().string();
    new Validator('mnemonic', mnemonic).required().string();

    const isValid = mnemonicService.validateMnemonic(mnemonic);

    if (!isValid) {
      throw new SDKError(ERROR_CODE.INVALID_MNEMONIC);
    }

    const seed = mnemonicService.newSeed(mnemonic);

    this.name = name;
    this.seed = seed;
    this.mnemonic = mnemonic;
    this.masterAccount = await new MasterAccount('MASTER', seed).init();
  }

  async isIncorrectBIP44() {
    const seed = mnemonicService.newSeed(this.mnemonic);

    if (this.seed !== seed) {
      return true;
    }

    const newMasterAccount = new MasterAccount('master', seed);
    await newMasterAccount.init();

    if (newMasterAccount.key.keySet.privateKeySerialized !== this.masterAccount.key.keySet.paymentAddressKeySerialized) {
      return true;
    }

    return false;
  }

  backup(password: string) {
    try {
      new Validator('password', password).required().string();

      const data = {
        masterAccount: this.masterAccount.getBackupData(),
        name: this.name,
        mnemonic: this.mnemonic,
        seed: this.seed,
      };

      L.info('Created wallet backup string successfully');

      return encryptWalletData(data, password);
    } catch (e) {
      L.error('Created wallet backup string failed', e);
      throw e;
    }
  }

  /**
   * Sync this wallet with the wallet stored on the api
   * This will get new keychains from the api (if have any)
   */
  async sync() {
    const serverAccounts = await apiGetWalletAccounts(this);
    const accountIds: number[] = this.masterAccount.deletedIndexes || [];

    for (const account of this.masterAccount.getAccounts()) {
        accountIds.push(account.getIndex());
    }

    const newAccounts = serverAccounts.filter(
        (item: any) => !accountIds.includes(item.id) && !(this.masterAccount.deletedIndexes || []).includes(item.id),
    );

    if (newAccounts.length > 0) {
        const newCreatedAccounts = [];
        for (const account of newAccounts) {
            // eslint-disable-next-line no-await-in-loop
            const newAccount = await this.masterAccount.addAccount(account.name, undefined, account.id);
            newCreatedAccounts.push(newAccount);
        }
    }
  }

  /**
   * This will update keychain list stored on api with this keychain list
   */
  async update() {
    const serverAccounts = await apiGetWalletAccounts(this);
    const currentAccounts = this.masterAccount.getAccounts();

    const serverAccountIds = serverAccounts.map((item: any) => item.id);

    if (_.some(currentAccounts, account =>{
      const accountInfo = account.getSerializedInformations();
      const id = accountInfo.index;
      return !account.isImport && !serverAccountIds.includes(id);
    })) {
      await apiUpdateWalletAccounts(this);
    }
  }
}

export default Wallet;
