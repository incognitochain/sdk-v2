import _ from 'lodash';
import bn from 'bn.js';
import BaseAccount from './baseAccount';
import MasterAccountModel from '@src/models/account/masterAccount';
import { base58CheckDeserialize, restoreKeyWalletFromBackupData } from '@src/services/key/keyWallet';
import KeyWalletModel from '@src/models/key/keyWallet';
import { getShardIDFromLastByte } from '@src/utils/common';
import Account from './account';
import { getKeySetFromPrivateKeyBytes } from '@src/services/key/accountKeySet';
import PrivateKeyModel from '@src/models/key/privateKey';
import Validator from '@src/utils/validator';
import { generateKey } from '@src/services/key/generator';

const DEFAULT_MASTER_ACCOUNT_NAME = 'MASTER_ACCOUNT';

interface MasterAccountInterface extends MasterAccountModel {};

class MasterAccount extends BaseAccount implements MasterAccountInterface {
  seed: Buffer;
  child: Account[];

  constructor(name: string = DEFAULT_MASTER_ACCOUNT_NAME, seed: Buffer) {
    new Validator('walletSeed', seed).required();
    new Validator('name', name).required().string();

    super(name);

    this.child = [];
    this.key = null;
    this.seed = seed;
  }

  static restoreFromBackupData(data: any, seed: Buffer) {
    new Validator('data', data).required();

    const { name, key, child } = data;
    const keyWallet = restoreKeyWalletFromBackupData(key);
    const account = new MasterAccount(name, seed);
    account.key = keyWallet;
    account.child = child.map((accountData: any) => Account.restoreFromBackupData(accountData));
    account.serializeKeys();

    return account;
  }

  async init() {
    this.key = await generateKey(this.seed);
    this.serializeKeys();

    await this.addAccount('Anon');

    return this;
  }

  getAccountByName(name: string) {
    new Validator('name', name).required().string();

    return _.find(this.getAccounts(), account => account.name === name);
  }

  getAccountByPrivateKey(privateKeySerialized: string) {
    new Validator('privateKeySerialized', privateKeySerialized).required().string();

    return _.find(this.getAccounts(), account => account.key.keySet.privateKeySerialized === privateKeySerialized);
  }

  async addAccount(name: string, shardId?: number) {
    try {
      new Validator('name', name).required().string();
      new Validator('shardId', shardId).shardId();

      L.info('Add new account', { name, shardId });

      if (this.getAccountByName(name)) {
        throw new ErrorCode(`Account with name ${name} was existed`);
      }

      const lastChildAccountIndex = _.findLastIndex(this.child, account => !account.isImport && !!account.key.childNumber);
      const lastChildAccount = lastChildAccountIndex !== -1 && this.child[lastChildAccountIndex];
      let newIndex = lastChildAccount ? new bn(lastChildAccount.key.childNumber).add(new bn(1)).toNumber() : 1;
      let keyData, lastByte;
      do {
        keyData = await generateKey(this.seed, newIndex, 0);
        const publicKeyBytes = keyData.keySet.paymentAddress.publicKeyBytes;

        lastByte = publicKeyBytes[publicKeyBytes.length - 1];
        newIndex += 1;
      } while(typeof shardId === 'number' && getShardIDFromLastByte(lastByte) !== shardId);

      const childAccountKeyWallet = new KeyWalletModel();

      childAccountKeyWallet.chainCode = keyData.chainCode;
      childAccountKeyWallet.childNumber = keyData.childNumber;
      childAccountKeyWallet.depth = keyData.depth;
      childAccountKeyWallet.keySet = keyData.keySet;

      const account = new Account(name, childAccountKeyWallet, false);
      this.child.push(account);

      return account;
    } catch (e) {
      L.error('Add new account failed', e)
      throw e;
    }
  }

  removeAccount(name: string) {
    new Validator('name', name).required().string();

    _.remove(this.child, account => account.name === name);
  }

  getAccounts() {
    return this.child;
  }

  async importAccount(name: string, privateKey: string) {
    try {
      new Validator('name', name).required().string();
      new Validator('privateKey', privateKey).required().privateKey();

      L.info('Import account', { name, privateKey: `${privateKey.substring(0, 15)}...` });

      if (this.getAccountByName(name)) {
        throw new ErrorCode(`Account with name ${name} was existed`);
      }

      if (this.getAccountByPrivateKey(privateKey)) {
        throw new ErrorCode('Account with this private key was existed');
      }

      const { key, type } = base58CheckDeserialize(privateKey);
      if (type === 'PRIVATE_KEY') {
        const privateKeyData = <{[key: string]: any}>key;
        const childAccountKeyWallet = new KeyWalletModel();
        const keySet = await getKeySetFromPrivateKeyBytes((<PrivateKeyModel>privateKeyData.privateKey).privateKeyBytes);

        childAccountKeyWallet.chainCode = <Uint8Array>privateKeyData.chainCode;
        childAccountKeyWallet.childNumber = <Uint8Array>privateKeyData.childNumber;
        childAccountKeyWallet.depth = <number>privateKeyData.depth;
        childAccountKeyWallet.keySet = keySet;

        const account = new Account(name, childAccountKeyWallet, true);
        this.child.push(account);

        return account;
      } else {
        throw new ErrorCode('Import account failed, private key is invalid');
      }
    } catch (e) {
      L.error('Import account failed', e);
      throw e;
    }
  }

  getBackupData() {
    const data = super.getBackupData();

    return {
      child: this.child.map(account => account.getBackupData()),
      ...data
    };
  }
}

export default MasterAccount;
