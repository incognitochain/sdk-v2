import '@src/utils/polyfill.ts';
import '@src/global';
import  { loadWASM } from '@src/wasm';
import WalletInstance from '@src/walletInstance/wallet';
import storageService from '@src/services/storage'
import { checkCachedHistories, getTxHistoryByPublicKey } from '@src/services/history/txHistory';

const historyService = {
  checkCachedHistories,
  getTxHistoryByPublicKey
};

export default {
  loadWASM,
  WalletInstance,
  storageService,
  historyService
};