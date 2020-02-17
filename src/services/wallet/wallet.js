import bn from 'bn.js';
import Validator from '@src/utils/validator';
import _ from 'lodash';
import { KeyWallet, KeySet } from '@src/key';
import { MnemonicGenerator } from './mnemonic';
import CryptoJS from 'crypto-js';
import JSON from 'circular-json';
import { PaymentAddress, ViewingKey } from '@src/key';
import rpcClient from '@src/services/rpc/index.ts';
import { setRandBytesFunc, hashSha3BytesToBytes } from '../privacy/utils';
import {
  PaymentAddressType,
  ViewingKeyType,
  PriKeyType,
} from './constants';
import { checkEncode } from '@src/utils/base58';
import { Account, MasterAccount } from '@src/account';
import { ENCODE_VERSION } from '@src/constants/constants';
import { generateBLSPubKeyB58CheckEncodeFromSeed, generateMasterKey } from '@src/services/key/generator';
import MasterAccountModel from '@src/models/account/masterAccount';

export class Wallet {
  seed: Uint8Array;
  entropy: number[];
  passPhrase: string;
  mnemonic: string;
  masterAccount: MasterAccountModel;
  name: string;

  constructor(name: string, passPhrase: string) {
    new Validator('wallet name', name).required().string();
    new Validator('wallet passPhrase', passPhrase).required().string();

    this.seed = new Uint8Array();
    this.entropy = [];
    this.passPhrase = passPhrase;
    this.mnemonic = '';
    this.masterAccount = null;
    this.name = name;

    this.init();
  }

  getAccountByName(name: string) {
    new Validator('account name', name).required().string();

    const accounts = this.masterAccount.child || [];
    const account = accounts.find(account => account?.name === name);
    
    return account;
  }

  getAccountByPrivateKey(privateKey: string) {
    new Validator('account privateKey', privateKey).required().privateKey();

    const accounts = this.masterAccount.child || [];
    const account = accounts.find(account => account?.key?.base58CheckSerialize(PriKeyType) === privateKey);
    
    return account;
  }

  /**
   * Add or import (privateKey provided) an account to this wallet
   * @param {string} name 
   * @param {object} option
   * @param {number} shardId
   * @param {string} privateKey
   */
  addAccount(name: string, { shardId = null, privateKey } = {}) {
    new Validator('account name', name).required().string();
    new Validator('account shardId', shardId).shardId();
    new Validator('account privateKey', privateKey).privateKey();

    // check existed account
    if (this.getAccountByName(name)) {
      throw new Error(`Account with name "${name}" was existed, please try another`);
    }

    if (privateKey && this.getAccountByPrivateKey(privateKey)) {
      throw new Error('This account was existed on the wallet');
    }

    if (privateKey) { // import account   
      if (typeof shardId === 'number') {
        throw new Error('Can not import an account with a shard ID');
      }

      this.masterAccount.addChildAccount(name, { privateKey });
    } else { // create account
      this.masterAccount.addChildAccount(name, { shardId });
    }
  }

  init() {
    // generate mnenomic generator
    let mnemonicGen = new MnemonicGenerator();
    this.entropy = mnemonicGen.newEntropy(128);

    // mnemonic
    this.mnemonic = mnemonicGen.newMnemonic(this.entropy);

    // seed
    this.seed = mnemonicGen.newSeed(this.mnemonic, this.passPhrase);

    // master account with master key
    this.masterAccount = new MasterAccount('master', this.seed);

    // add first account
    this.addAccount('Account 0', { privateKey: '112t8rnXA4juTmaeVGzjHH4fZyjs8mWbhyvqVjP4uSgd5kiaUsYa99Lj9N7qKQVTowUUzYMf3As3NxEVsMDk8Dfhmn54dPp1meH9R4PYrZdz' });
  }

  removeAccount(privateKey) {
    new Validator('account privateKey', privateKey).required().privateKey();

    const accounts = [...this.masterAccount.child];

    const remainAccounts = _.remove(accounts, account => account?.key.base58CheckSerialize(PriKeyType) === privateKey);

    this.masterAccount.child = [...remainAccounts];
  }

  /**
   * Backup the wallet, encrypt with `password` (if not provided, use passPhrase instead), return a encrypted text
   * @param {string} password 
   */
  getEncryptString(password = this.passPhrase) {
    try {
      new Validator('backup password', password).required().string();

      const accounts = [...this.masterAccount.child];
      const masterKey = { ...this.masterAccount?.key || {} };
  
      // parse to byte[]
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
  
        if (account) {
          account.key.ChainCode = Array.from(account.key.ChainCode);
          account.key.ChildNumber = Array.from(account.key.ChildNumber);
          account.key.KeySet.PrivateKey = Array.from(account.key.KeySet.PrivateKey);
          account.key.KeySet.PaymentAddress.Pk = Array.from(account.key.KeySet.PaymentAddress.Pk);
          account.key.KeySet.PaymentAddress.Tk = Array.from(account.key.KeySet.PaymentAddress.Tk);
          account.key.KeySet.ReadonlyKey.Pk = Array.from(account.key.KeySet.ReadonlyKey.Pk);
          account.key.KeySet.ReadonlyKey.Rk = Array.from(account.key.KeySet.ReadonlyKey.Rk);
        }
      }
  
      masterKey.ChainCode = Array.from(masterKey?.ChainCode);
      masterKey.ChildNumber = Array.from(masterKey?.ChildNumber);
      masterKey.KeySet.PrivateKey = Array.from(masterKey?.KeySet?.PrivateKey);
      masterKey.KeySet.PaymentAddress.Pk = Array.from(masterKey?.KeySet?.PaymentAddress.Pk);
      masterKey.KeySet.PaymentAddress.Tk = Array.from(masterKey?.KeySet?.PaymentAddress.Tk);
      masterKey.KeySet.ReadonlyKey.Pk = Array.from(masterKey?.KeySet?.ReadonlyKey?.Pk);
      masterKey.KeySet.ReadonlyKey.Rk = Array.from(masterKey?.KeySet?.ReadonlyKey?.Rk);
  
      this.masterAccount.child = accounts;
  
      let data = JSON.stringify(this);
  
      // encrypt
      let cipherText = CryptoJS.AES.encrypt(data, password);
  
      return cipherText?.toString();
    } catch (e) {
      throw new Error('Encrypt wallet to string failed');
    }
  }

  async decryptString(encryptString, password) {
    try {
      new Validator('decrypt password', password).required().string();
      new Validator('encrypt string', encryptString).required().string();
      
      const decryptData = CryptoJS.AES.decrypt(encryptString, password);
      const decryptString = decryptData?.toString(CryptoJS.enc.Utf8);
      const wallet = JSON.parse(decryptString);

      Object.setPrototypeOf(wallet, Wallet.prototype);
      Object.setPrototypeOf(wallet.masterAccount, Account.prototype);
      Object.setPrototypeOf(wallet.masterAccount.key, KeyWallet.prototype);

      Object.assign(this, wallet);

      for (let i = 0; i < wallet.masterAccount.child.length; i++) {
        Object.setPrototypeOf(wallet.masterAccount.child[i], Account.prototype);
        Object.setPrototypeOf(wallet.masterAccount.child[i].key, KeyWallet.prototype);

        // chaincode
        wallet.masterAccount.child[i].key.ChainCode = new Uint8Array(wallet.masterAccount.child[i].key.ChainCode);

        // child num
        wallet.masterAccount.child[i].key.ChildNumber = new Uint8Array(wallet.masterAccount.child[i].key.ChildNumber);

        Object.setPrototypeOf(wallet.masterAccount.child[i].key.KeySet, KeySet.prototype);

        // payment address
        Object.setPrototypeOf(wallet.masterAccount.child[i].key.KeySet.PaymentAddress, PaymentAddress.prototype);
        wallet.masterAccount.child[i].key.KeySet.PaymentAddress.Pk = new Uint8Array(wallet.masterAccount.child[i].key.KeySet.PaymentAddress.Pk);
        wallet.masterAccount.child[i].key.KeySet.PaymentAddress.Tk = new Uint8Array(wallet.masterAccount.child[i].key.KeySet.PaymentAddress.Tk);

        // read only key
        Object.setPrototypeOf(wallet.masterAccount.child[i].key.KeySet.ReadonlyKey, ViewingKey.prototype);
        wallet.masterAccount.child[i].key.KeySet.ReadonlyKey.Pk = new Uint8Array(wallet.masterAccount.child[i].key.KeySet.ReadonlyKey.Pk);
        wallet.masterAccount.child[i].key.KeySet.ReadonlyKey.Rk = new Uint8Array(wallet.masterAccount.child[i].key.KeySet.ReadonlyKey.Rk);

        // private key
        wallet.masterAccount.child[i].key.KeySet.PrivateKey = new Uint8Array(wallet.masterAccount.child[i].key.KeySet.PrivateKey);
      }

      Object.assign(this, wallet);

      return this;
    } catch (e) {
      throw new Error('Decrypt wallet failed');
    }
  }

  async getAccounts() {
    try {
      return this.masterAccount.child.map(async (child, index) => {
        try {
          let miningSeedKey = hashSha3BytesToBytes(hashSha3BytesToBytes(child.key.KeySet.PrivateKey));
          let blsPublicKey = await generateBLSPubKeyB58CheckEncodeFromSeed(miningSeedKey);
    
          return {
            name: child.name,
            privateKey: child.key.base58CheckSerialize(PriKeyType),
            paymentAddress: child.key.base58CheckSerialize(PaymentAddressType),
            readonlyKey: child.key.base58CheckSerialize(ViewingKeyType),
            publicKey: child.key.getPublicKeyByHex(),
            publicKeyCheckEncode: child.key.getPublicKeyCheckEncode(),
            validatorKey: checkEncode(hashSha3BytesToBytes(hashSha3BytesToBytes(child.key.KeySet.PrivateKey)), ENCODE_VERSION),
            publicKeyBytes: child.key.KeySet.PaymentAddress.Pk.toString(),
            index,
            blsPublicKey,
          };
        } catch (e) {
          return null;
        }
      });
    } catch (e) {
      throw new Error('Get account list failed');
    }
  }

  static RpcClient = rpcClient;
  static RandomBytesFunc = null;

  static setPrivacyUtilRandomBytesFunc(randomBytesFunc) {
    setRandBytesFunc(randomBytesFunc);
  }

  static ProgressTx = 0;

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async updateProgressTx(progress) {
    Wallet.ProgressTx = progress;
    await Wallet.sleep(100);
  }

  static async resetProgressTx() {
    await Wallet.updateProgressTx(0);
  }

  static ShardNumber = 8;
}


