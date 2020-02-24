import '@src/utils/polyfill.ts';
import '@src/global';
import { checkCachedHistories, getTxHistoryByPublicKey } from '@src/services/history/txHistory';
import { implementGoMethodManually, implementGoMethodUseWasm, GO_METHOD_NAMES } from '@src/go';

export { default as WalletInstance } from '@src/walletInstance/wallet';
export { default as storageService } from '@src/services/storage';

export const historyServices = {
  checkCachedHistories,
  getTxHistoryByPublicKey
};

export const goServices = {
  implementGoMethodManually,
  implementGoMethodUseWasm,
  GO_METHOD_NAMES
};