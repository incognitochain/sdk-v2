import '@src/utils/polyfill.ts';
import '@src/global';
import { checkCachedHistories, getTxHistoryByPublicKey } from '@src/services/history/txHistory';
import { implementGoMethodManually, implementGoMethodUseWasm, GO_METHOD_NAMES } from '@src/go';
import { setPrivacyUtilRandomBytesFunc } from '@src/services/wallet';

export { default as AccountInstance } from '@src/walletInstance/account/account';
export { default as NativeTokenInstance } from '@src/walletInstance/token/nativeToken';
export { default as PrivacyTokenInstance } from '@src/walletInstance/token/privacyToken';
export { default as WalletInstance } from '@src/walletInstance/wallet';
export { default as storageService } from '@src/services/storage';

export const historyServices = {
  checkCachedHistories,
  getTxHistoryByPublicKey
};

export const walletServices = {
  setPrivacyUtilRandomBytesFunc
};

export const goServices = {
  implementGoMethodManually,
  implementGoMethodUseWasm,
  GO_METHOD_NAMES
};