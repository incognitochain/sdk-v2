import '@src/utils/polyfill.ts';
import '@src/global';
import  { loadWASM } from '@src/wasm';
import Wallet from '@src/walletInstance/wallet';
import storage from '@src/services/storage'
import bn from 'bn.js';
import { checkCachedHistories, getTxHistoryByPublicKey } from '@src/services/history/txHistory';

const historyService = {
  checkCachedHistories,
  getTxHistoryByPublicKey
};

export default {
  loadWASM,
  storage,
  bn,
  Wallet,
  historyService
};