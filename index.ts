import '@src/utils/polyfill.ts';
import '@src/global';
import  { loadWASM } from '@src/wasm';
import { sendNativeToken } from '@src/services/send/sendNativeToken';
import { inPrivacyToken } from '@src/services/send/initPrivacyToken';
import { sendPrivacyToken } from '@src/services/send/sendPrivacyToken';
import { byteArrayToWordArray, wordArrayToByteArray } from '@src/services/key/utils.ts';

import storage from '@src/services/storage'
import CryptoJS from 'crypto-js';
import bn from 'bn.js';

export default {
  loadWASM,
  storage,
  bn,
  byteArrayToWordArray,
  wordArrayToByteArray,
  CryptoJS,
  sendNativeToken,
  inPrivacyToken,
  sendPrivacyToken,
};