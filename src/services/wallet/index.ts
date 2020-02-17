import { MnemonicGenerator } from "./mnemonic";
import WalletModel from "@src/models/wallet";
import { setRandBytesFunc } from '@src/privacy/utils';

export function setPrivacyUtilRandomBytesFunc(f: Function) {
  setRandBytesFunc(f);
}

export function initWalletData(randomBytesFunction: Function, passPhrase: string) {
  setPrivacyUtilRandomBytesFunc(randomBytesFunction);

   // generate mnenomic generator
   const mnemonicGen = new MnemonicGenerator();
   const entropy = mnemonicGen.newEntropy(128);

   // mnemonic
   const mnemonic = mnemonicGen.newMnemonic(entropy);

   // seed
   const seed = mnemonicGen.newSeed(mnemonic, passPhrase);

  return {
    entropy,
    mnemonic,
    seed
  };
}

 /**
   * Backup the wallet, encrypt with `password` (if not provided, use passPhrase instead), return a encrypted text
   * @param {string} password 
   */
export function encryptWallet(walelt: WalletModel, password: string) {
  // try {
  //   new Validator('backup password', password).required().string();

  //   const accounts = [...walelt.masterAccount.child];
  //   const masterKey = { ...walelt.masterAccount?.key || {} };

  //   // parse to byte[]
  //   for (let i = 0; i < accounts.length; i++) {
  //     const account = accounts[i];

  //     if (account) {
  //       account.key.ChainCode = Array.from(account.key.ChainCode);
  //       account.key.ChildNumber = Array.from(account.key.ChildNumber);
  //       account.key.KeySet.PrivateKey = Array.from(account.key.KeySet.PrivateKey);
  //       account.key.KeySet.PaymentAddress.Pk = Array.from(account.key.KeySet.PaymentAddress.Pk);
  //       account.key.KeySet.PaymentAddress.Tk = Array.from(account.key.KeySet.PaymentAddress.Tk);
  //       account.key.KeySet.ReadonlyKey.Pk = Array.from(account.key.KeySet.ReadonlyKey.Pk);
  //       account.key.KeySet.ReadonlyKey.Rk = Array.from(account.key.KeySet.ReadonlyKey.Rk);
  //     }
  //   }

  //   masterKey.ChainCode = Array.from(masterKey?.ChainCode);
  //   masterKey.ChildNumber = Array.from(masterKey?.ChildNumber);
  //   masterKey.KeySet.PrivateKey = Array.from(masterKey?.KeySet?.PrivateKey);
  //   masterKey.KeySet.PaymentAddress.Pk = Array.from(masterKey?.KeySet?.PaymentAddress.Pk);
  //   masterKey.KeySet.PaymentAddress.Tk = Array.from(masterKey?.KeySet?.PaymentAddress.Tk);
  //   masterKey.KeySet.ReadonlyKey.Pk = Array.from(masterKey?.KeySet?.ReadonlyKey?.Pk);
  //   masterKey.KeySet.ReadonlyKey.Rk = Array.from(masterKey?.KeySet?.ReadonlyKey?.Rk);

  //   walelt.masterAccount.child = accounts;

  //   let data = JSON.stringify(walelt);

  //   // encrypt
  //   let cipherText = CryptoJS.AES.encrypt(data, password);

  //   return cipherText?.toString();
  // } catch (e) {
  //   throw new Error('Encrypt wallet to string failed');
  // }
}


export async function decryptWallet(encryptString: string, password: string) {
  // try {
  //   new Validator('decrypt password', password).required().string();
  //   new Validator('encrypt string', encryptString).required().string();
    
  //   const decryptData = CryptoJS.AES.decrypt(encryptString, password);
  //   const decryptString = decryptData?.toString(CryptoJS.enc.Utf8);
  //   const wallet = JSON.parse(decryptString);

  //   Object.setPrototypeOf(wallet, Wallet.prototype);
  //   Object.setPrototypeOf(wallet.masterAccount, Account.prototype);
  //   Object.setPrototypeOf(wallet.masterAccount.key, KeyWallet.prototype);

  //   Object.assign(this, wallet);

  //   for (let i = 0; i < wallet.masterAccount.child.length; i++) {
  //     Object.setPrototypeOf(wallet.masterAccount.child[i], Account.prototype);
  //     Object.setPrototypeOf(wallet.masterAccount.child[i].key, KeyWallet.prototype);

  //     // chaincode
  //     wallet.masterAccount.child[i].key.ChainCode = new Uint8Array(wallet.masterAccount.child[i].key.ChainCode);

  //     // child num
  //     wallet.masterAccount.child[i].key.ChildNumber = new Uint8Array(wallet.masterAccount.child[i].key.ChildNumber);

  //     Object.setPrototypeOf(wallet.masterAccount.child[i].key.KeySet, KeySet.prototype);

  //     // payment address
  //     Object.setPrototypeOf(wallet.masterAccount.child[i].key.KeySet.PaymentAddress, PaymentAddress.prototype);
  //     wallet.masterAccount.child[i].key.KeySet.PaymentAddress.Pk = new Uint8Array(wallet.masterAccount.child[i].key.KeySet.PaymentAddress.Pk);
  //     wallet.masterAccount.child[i].key.KeySet.PaymentAddress.Tk = new Uint8Array(wallet.masterAccount.child[i].key.KeySet.PaymentAddress.Tk);

  //     // read only key
  //     Object.setPrototypeOf(wallet.masterAccount.child[i].key.KeySet.ReadonlyKey, ViewingKey.prototype);
  //     wallet.masterAccount.child[i].key.KeySet.ReadonlyKey.Pk = new Uint8Array(wallet.masterAccount.child[i].key.KeySet.ReadonlyKey.Pk);
  //     wallet.masterAccount.child[i].key.KeySet.ReadonlyKey.Rk = new Uint8Array(wallet.masterAccount.child[i].key.KeySet.ReadonlyKey.Rk);

  //     // private key
  //     wallet.masterAccount.child[i].key.KeySet.PrivateKey = new Uint8Array(wallet.masterAccount.child[i].key.KeySet.PrivateKey);
  //   }

  //   Object.assign(this, wallet);

  //   return this;
  // } catch (e) {
  //   throw new Error('Decrypt wallet failed');
  // }
}