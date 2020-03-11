import { MnemonicGenerator } from "./mnemonic";
import { setRandBytesFunc } from '@src/privacy/utils';
import CryptoJS from 'crypto-js';
import Validator from "@src/utils/validator";

export function setPrivacyUtilRandomBytesFunc(f: Function) {
  new Validator('f', f).required().function();

  setRandBytesFunc(f);
}

export function initWalletData(passPhrase: string) {
  new Validator('passPhrase', passPhrase).required().string();

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
export function encryptWalletData(walletData: object, password: string): string {
  new Validator('walletData', walletData).required();
  new Validator('password', password).required().string();

  return CryptoJS.AES.encrypt(JSON.stringify(walletData), password).toString();
}


export async function decryptWalletData(encryptString: string, password: string) {
  new Validator('password', password).required().string();
  new Validator('encryptString', encryptString).required().string();

  let decryptedData = CryptoJS.AES.decrypt(encryptString, password);
  const data = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));

  return data;
}